// AI 文章摘要生成模块（构建期，Node 侧）
// 通过 OpenAI 兼容接口调用大模型，为没有手动填写 articleGPT 的文章生成摘要。
// 设计原则：
// - 全程不 throw：任何失败（配置缺失/网络错误/超时/缓存损坏）都收敛为 console.warn + 降级，绝不阻断构建
// - 内容哈希缓存：正文不变则复用缓存摘要，增量构建零 token 消耗
// - 并发限制 + 超时 + 指数退避重试：避免限流与无效重试浪费 token
import crypto from "node:crypto";
import path from "node:path";
import fs from "fs-extra";
import pc from "picocolors";
import { globby } from "globby";

// 内置 provider 预设（均为 OpenAI 兼容接口），用户可通过 baseURL 覆盖
const PROVIDER_PRESETS = {
  openai: "https://api.openai.com/v1",
  deepseek: "https://api.deepseek.com",
  kimi: "https://api.moonshot.cn/v1",
  glm: "https://open.bigmodel.cn/api/coding/paas/v4",
  qwen: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  minimax: "https://api.minimaxi.com/v1",
  mimo: "https://api.xiaomimimo.com/v1",
  "mimo-token-plan": "https://token-plan-cn.xiaomimimo.com/v1",
  doubao: "https://ark.cn-beijing.volces.com/api/v3",
  "volcengine-coding": "https://ark.cn-beijing.volces.com/api/coding/v3",
  shengsuanyun: "https://router.shengsuanyun.com/api/v1",
  stepfun: "https://api.stepfun.com/step_plan/v1",
};

// 内置 system prompt（要求输出 80-120 字纯文本中文摘要）
const DEFAULT_PROMPT =
  "你是一位资深的中文技术博客编辑，擅长为博客文章撰写精准、耐读的导语摘要。请根据用户提供的文章正文，输出一段 80-120 字的中文摘要。遵循以下要求：" +
  "1. 先通读全文，提炼文章最核心的主题与结论：教程类文章突出「解决了什么问题、用了什么方案、达成什么效果」；观点类文章突出「核心论点与关键依据」；记录类文章突出「事件与结果」。" +
  "2. 只依据原文信息作答，不虚构原文不存在的内容、数据或结论；原文未给出的细节不要编造。" +
  "3. 使用简洁通顺的书面中文，信息密度高、无废话；为一段连续的文字，不使用列表、标题、引用或任何 Markdown 语法。" +
  "4. 直接输出摘要正文本身，不要添加任何前后缀（如“摘要：”“本文”开头可酌情使用但不强制），不使用第一人称，不要评价文章质量。" +
  "5. 严格控制在 80-120 字之间，不要超出或不足。";

// 正文过短时不生成摘要的阈值（字符数）
const MIN_CONTENT_LENGTH = 50;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 清洗 Markdown 正文为纯文本（减少无效 token）
 * @param {string} content - 文章 Markdown 正文（不含 frontmatter）
 * @returns {string} - 清洗后的纯文本
 */
const stripMarkdown = (content) => {
  return (
    content
      // 围栏代码块
      .replace(/```[\s\S]*?```/g, " ")
      // 行内代码
      .replace(/`[^`]*`/g, " ")
      // 图片
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      // 链接保留文字
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // HTML 标签
      .replace(/<[^>]+>/g, " ")
      // 标题/引用/列表等行首标记
      .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
      // 折叠所有空白
      .replace(/\s+/g, " ")
      .trim()
  );
};

/**
 * 计算内容哈希（缓存命中判断依据）
 */
const md5 = (text) => crypto.createHash("md5").update(text).digest("hex");

/**
 * 读取缓存文件，损坏或不存在时返回空对象（不抛错）
 * @param {string} cacheFile - 缓存文件绝对路径
 * @returns {Promise<Object>} - { [regularPath]: { hash, summary } }
 */
const readCache = async (cacheFile) => {
  try {
    if (!(await fs.pathExists(cacheFile))) return {};
    const data = await fs.readJson(cacheFile);
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
};

/**
 * 写入缓存文件，失败仅 warn（不阻断构建）
 */
const writeCache = async (cacheFile, data) => {
  try {
    await fs.outputJson(cacheFile, data, { spaces: 2 });
  } catch (error) {
    console.warn(
      pc.yellow("⚠️  [vitepress-theme-ninc] AI 摘要缓存写入失败：") +
        pc.dim(`${cacheFile}（${error?.message || error}），下次构建将重新生成。`)
    );
  }
};

/**
 * 校验 provider 配置完整性，返回缺失字段列表与解析后的 baseURL
 * 不打印、不降级，仅做纯校验（CLI 入口与构建期 resolveProvider 共用，避免重复实现）
 * @returns {{ missing: string[], baseURL: string, apiKey: string, model: string }}
 */
export const getProviderMissing = (config) => {
  const presetBaseURL = PROVIDER_PRESETS[config.provider] || "";
  const baseURL = (config.baseURL || presetBaseURL || "").replace(/\/+$/, "");
  const missing = [];
  if (!config.apiKey) missing.push("apiKey");
  if (!config.model) missing.push("model");
  if (!baseURL) missing.push("baseURL（provider 为 custom 时必填）");
  return { missing, baseURL, apiKey: config.apiKey, model: config.model };
};

/**
 * 解析 provider 配置，合并预设 baseURL
 * 缺少关键配置（apiKey/model/baseURL）时打印警告并返回 null（触发降级，不生成摘要）
 * @returns {{ baseURL: string, apiKey: string, model: string } | null}
 */
const resolveProvider = (config) => {
  const { missing, baseURL, apiKey, model } = getProviderMissing(config);
  if (missing.length > 0) {
    console.warn(
      "\n" +
        pc.yellow(pc.bold("⚠️  [vitepress-theme-ninc] aiSummary 已启用，但以下配置缺失：")) +
        "\n" +
        pc.dim(`   ${missing.join("、")}`) +
        "\n" +
        pc.cyan("   已自动降级为不生成 AI 摘要，构建将继续，文章页摘要回退到 description。") +
        "\n"
    );
    return null;
  }
  return { baseURL, apiKey, model };
};

/**
 * 调用 OpenAI 兼容的 chat completions 接口生成摘要
 * @param {Object} opts
 * @param {string} opts.baseURL - 接口地址（到 /v1 为止）
 * @param {string} opts.apiKey - API Key
 * @param {string} opts.model - 模型名称
 * @param {string} opts.systemPrompt - system 提示词
 * @param {string} opts.text - 清洗后的文章正文
 * @param {number} opts.timeout - 超时毫秒
 * @param {(token: string, full: string) => void} [opts.onToken] - 流式 token 回调，传入时启用 SSE 流式传输
 * @returns {Promise<string>} - 摘要文本
 */
const callModel = async ({ baseURL, apiKey, model, systemPrompt, text, timeout, onToken }) => {
  const useStream = typeof onToken === "function";
  const res = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      stream: useStream,
    }),
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) {
    // 尝试提取错误详情
    let detail = "";
    try {
      const errBody = await res.text();
      detail = errBody ? ` — ${errBody.slice(0, 200)}` : "";
    } catch { /* ignore */ }
    throw new Error(`HTTP ${res.status} ${res.statusText}${detail}`.trim());
  }

  if (useStream && res.body) {
    // SSE 流式解析：逐 token 回调，让 CLI 终端实时显示生成过程
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let full = "";
    const handleLine = (line) => {
      if (!line.startsWith("data:")) return;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload);
        const token = json?.choices?.[0]?.delta?.content ?? "";
        if (token) {
          full += token;
          onToken(token, full);
        }
      } catch { /* 忽略非 JSON 行 */ }
    };
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) handleLine(line.replace(/\r$/, ""));
    }
    // flush 剩余缓冲
    buffer += decoder.decode();
    if (buffer) handleLine(buffer.replace(/\r$/, ""));

    const summary = full.trim();
    if (!summary) throw new Error("流式响应中未包含摘要内容");
    return summary;
  }

  const data = await res.json();
  const summary = data?.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    throw new Error("响应中未包含摘要内容");
  }
  return summary;
};

/**
 * 指数退避重试包装（1s / 2s / 4s ...）
 */
const withRetry = async (fn, retries) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(1000 * 2 ** attempt);
      }
    }
  }
  throw lastError;
};

/**
 * 简易并发池（不引入 p-limit 依赖）
 * @param {Array<() => Promise<any>>} tasks - 任务工厂数组
 * @param {number} concurrency - 并发数
 */
const runPool = async (tasks, concurrency) => {
  let index = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, tasks.length)) },
    async () => {
      while (index < tasks.length) {
        const current = index++;
        await tasks[current]();
      }
    }
  );
  await Promise.all(workers);
};

/**
 * 为文章列表生成 AI 摘要（构建期主流程）
 *
 * 过滤规则（不消耗 token）：
 * - 已手动填写 articleGPT 的文章（_hasArticleGPT）
 * - 加密文章（crypto.enable）
 * - exclude glob 命中的文章
 * - 清洗后正文不足 50 字符的文章
 *
 * @param {Object[]} posts - getAllPosts 返回的文章数组（需带 _content 与 _hasArticleGPT）
 * @param {Object} config - themeConfig.aiSummary
 * @param {(ctx: Object) => void} [onProgress] - 进度回调（CLI 用于终端反馈）
 *   ctx: { type: 'start'|'generating'|'success'|'failed', completed?, total?, index?, path?, error?, stats }
 * @param {(ctx: { path: string, token: string, full: string }) => void} [onToken] - 流式 token 回调
 *   传入时 callModel 使用 SSE 流式传输，CLI 可实时显示生成内容
 * @returns {Promise<{ summaries: Object, stats: Object }>}
 *   summaries: { [regularPath]: summary }，stats: { cached, generated, failed, skipped }
 */
export const generateAiSummaries = async (posts, config, onProgress, onToken) => {
  const summaries = {};
  const stats = { cached: 0, generated: 0, failed: 0, skipped: 0 };
  try {
    const resolved = resolveProvider(config);
    if (!resolved) return { summaries, stats };

    const maxInputLength = config.maxInputLength || 2000;
    const timeout = config.timeout || 30000;
    const retries = config.retries ?? 2;
    const concurrency = config.concurrency || 3;
    const systemPrompt = config.prompt || DEFAULT_PROMPT;

    // exclude glob（相对于 process.cwd，与文章扫描目录约定一致）
    const exclude = Array.isArray(config.exclude) ? config.exclude : [];
    let excludedFiles = new Set();
    if (exclude.length > 0) {
      try {
        excludedFiles = new Set(await globby(exclude, { cwd: process.cwd() }));
      } catch {
        excludedFiles = new Set();
      }
    }

    // 缓存
    const cacheEnable = config.cache?.enable !== false;
    const cacheFile = path.resolve(
      process.cwd(),
      config.cache?.file || ".vitepress/ai-summary-cache.json"
    );
    const cache = cacheEnable ? await readCache(cacheFile) : {};

    // 筛选待生成文章 / 命中缓存
    const pending = [];
    for (const post of posts) {
      const relFile = post.regularPath.replace(/^\//, "").replace(/\.html$/, ".md");
      if (
        post._hasArticleGPT ||
        post.crypto?.enable ||
        excludedFiles.has(relFile) ||
        typeof post._content !== "string"
      ) {
        stats.skipped++;
        continue;
      }
      const clean = stripMarkdown(post._content).slice(0, maxInputLength);
      if (clean.length < MIN_CONTENT_LENGTH) {
        stats.skipped++;
        continue;
      }
      const hash = md5(clean);
      const hit = cache[post.regularPath];
      if (!config.force && hit && hit.hash === hash && hit.summary) {
        summaries[post.regularPath] = hit.summary;
        stats.cached++;
        continue;
      }
      pending.push({ post, clean, hash });
    }

    // buildGenerate: false 时构建期只读缓存，不调用大模型（摘要由 CLI 命令预生成）
    if (config.buildGenerate === false) {
      if (pending.length > 0) {
        console.log(
          pc.dim(
            `ℹ️  [vitepress-theme-ninc] AI 摘要：${pending.length} 篇文章待生成（buildGenerate: false，构建期不调用大模型）。` +
              `请运行 npx vitepress-theme-ninc summary 预生成，未生成的文章将回退到 description。`
          )
        );
        // 诊断信息：帮助排查缓存未命中的原因（路径不匹配 / hash 变化 / 缓存文件缺失等）
        const cacheKeys = Object.keys(cache);
        console.log(
          pc.dim(
            `   缓存文件：${cacheFile}（共 ${cacheKeys.length} 条记录）` +
              (cacheKeys.length > 0
                ? `\n   缓存键：${cacheKeys.slice(0, 5).join(", ")}${cacheKeys.length > 5 ? " ..." : ""}`
                : "\n   缓存为空——请确认缓存文件路径与构建目录一致") +
              pending
                .map((p) => {
                  const cached = cache[p.post.regularPath];
                  const reason = !cached
                    ? "缓存中无此键（路径不匹配？）"
                    : cached.hash !== p.hash
                      ? `hash 不匹配（缓存 ${cached.hash.slice(0, 8)}... ≠ 当前 ${p.hash.slice(0, 8)}...）`
                      : "缓存摘要为空";
                  return `\n   未命中：${p.post.regularPath} — ${reason}`;
                })
                .join("")
          )
        );
        stats.skipped += pending.length;
      }
    } else {
      // 并发调用大模型
      onProgress?.({ type: "start", completed: 0, total: pending.length, stats: { ...stats } });
      let completedCount = 0;
      const tasks = pending.map(({ post, clean, hash }, taskIndex) => async () => {
      let success = false;
      let errorMsg = null;
      // 通知 CLI 开始生成该文章（在 API 调用前给出反馈，避免长时间无响应）
      onProgress?.({ type: "generating", index: taskIndex + 1, total: pending.length, path: post.regularPath, stats: { ...stats } });
      try {
        const summary = await withRetry(
          () =>
            callModel({
              ...resolved,
              systemPrompt,
              text: clean,
              timeout,
              onToken: onToken
                ? (token, full) => onToken({ path: post.regularPath, token, full })
                : undefined,
            }),
          retries
        );
        summaries[post.regularPath] = summary;
        cache[post.regularPath] = { hash, summary };
        stats.generated++;
        success = true;
      } catch (error) {
        stats.failed++;
        errorMsg = error?.message || String(error);
        console.warn(
          pc.yellow(
            `⚠️  [vitepress-theme-ninc] AI 摘要生成失败（${post.regularPath}）：${error?.message || error}`
          ) + pc.dim(" 已跳过该文章，页面摘要将回退到 description。")
        );
      }
      completedCount++;
      onProgress?.({
        type: success ? "success" : "failed",
        completed: completedCount,
        total: pending.length,
        path: post.regularPath,
        error: errorMsg,
        stats: { ...stats },
      });
    });
    await runPool(tasks, concurrency);

    // 有新摘要时写回缓存
    if (cacheEnable && stats.generated > 0) {
      await writeCache(cacheFile, cache);
    }
    } // end else（buildGenerate !== false）

    // 启动日志
    if (stats.cached > 0 || stats.generated > 0 || stats.failed > 0) {
      console.log(
        pc.cyan(
          `🤖 [vitepress-theme-ninc] AI 摘要：缓存命中 ${stats.cached} 篇，新生成 ${stats.generated} 篇` +
            (stats.failed > 0 ? pc.yellow(`，失败 ${stats.failed} 篇`) : "") +
            "。"
        )
      );
    }
  } catch (error) {
    // 顶层兜底：任何未预期异常都不阻断构建
    console.warn(
      pc.yellow("⚠️  [vitepress-theme-ninc] AI 摘要生成流程异常，已整体跳过：") +
        pc.dim(String(error?.message || error))
    );
  }
  return { summaries, stats };
};
