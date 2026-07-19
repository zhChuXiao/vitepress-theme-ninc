/**
 * Cloudflare Worker — AI 摘要运行时代理
 * 部署步骤详见文档：https://theme.ninc.top/guide/ai-summary-proxy
 *
 * 功能：
 * - 接收浏览器 POST 请求（content + path + stream），调用大模型生成摘要
 * - 支持 SSE 流式返回（默认），也兼容一次性 JSON 返回
 * - API Key 仅保存在 Worker 环境变量中，不会暴露到浏览器
 *
 * 环境变量（Cloudflare Dashboard → Workers & Pages → 你的 Worker → Settings → Variables）：
 *   OPENAI_API_KEY      — 必填，你的大模型 API Key
 *   OPENAI_BASE_URL     — 可选，默认 https://api.openai.com/v1
 *   OPENAI_MODEL        — 可选，默认 gpt-4o-mini
 *   SYSTEM_PROMPT       — 可选，自定义 system prompt（空则使用内置）
 *   MAX_INPUT_LENGTH    — 可选，正文最大字符数，默认 2000
 *   CORS_ORIGIN         — 可选，允许的跨域来源，默认 *（生产环境建议改成你的博客域名）
 */

const DEFAULT_PROMPT =
  "你是一位资深的中文技术博客编辑，擅长为博客文章撰写精准、耐读的导语摘要。请根据用户提供的文章正文，输出一段 80-120 字的中文摘要。遵循以下要求：" +
  "1. 先通读全文，提炼文章最核心的主题与结论：教程类文章突出「解决了什么问题、用了什么方案、达成什么效果」；观点类文章突出「核心论点与关键依据」；记录类文章突出「事件与结果」。" +
  "2. 只依据原文信息作答，不虚构原文不存在的内容、数据或结论；原文未给出的细节不要编造。" +
  "3. 使用简洁通顺的书面中文，信息密度高、无废话；为一段连续的文字，不使用列表、标题、引用或任何 Markdown 语法。" +
  "4. 直接输出摘要正文本身，不要添加任何前后缀（如“摘要：”“本文”开头可酌情使用但不强制），不使用第一人称，不要评价文章质量。" +
  "5. 严格控制在 80-120 字之间，不要超出或不足。";

function makeCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsOrigin = env.CORS_ORIGIN || "*";

    // 1. CORS 预检
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: makeCorsHeaders(corsOrigin) });
    }

    // 2. 只允许 POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...makeCorsHeaders(corsOrigin) },
      });
    }

    try {
      const body = await request.json().catch(() => ({}));
      const content = String(body.content || "").trim();
      const useStream = body.stream !== false;
      const maxLen = parseInt(env.MAX_INPUT_LENGTH, 10) || 2000;

      if (!content) {
        return new Response(JSON.stringify({ error: "content is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...makeCorsHeaders(corsOrigin) },
        });
      }

      const text = content.slice(0, maxLen);

      const apiKey = env.OPENAI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Server misconfigured: missing API Key" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...makeCorsHeaders(corsOrigin) },
        });
      }

      const baseURL = (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
      const model = env.OPENAI_MODEL || "gpt-4o-mini";
      const systemPrompt = (env.SYSTEM_PROMPT || "").trim() || DEFAULT_PROMPT;

      // 3. 调用大模型
      const modelRes = await fetch(`${baseURL}/chat/completions`, {
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
      });

      if (!modelRes.ok) {
        const errText = await modelRes.text().catch(() => "");
        return new Response(JSON.stringify({ error: `Upstream error ${modelRes.status}`, detail: errText }), {
          status: 502,
          headers: { "Content-Type": "application/json", ...makeCorsHeaders(corsOrigin) },
        });
      }

      // 4. 流式转发 SSE
      if (useStream) {
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();

        // 启动后台读取并转发
        (async () => {
          try {
            const reader = modelRes.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                if (!line.trim()) continue;
                writer.write(encoder.encode(line + "\n\n"));
              }
            }
            buffer += decoder.decode();
            if (buffer.trim()) {
              writer.write(encoder.encode(buffer.trim() + "\n\n"));
            }
            writer.write(encoder.encode("data: [DONE]\n\n"));
          } catch (e) {
            writer.write(encoder.encode(`data: ${JSON.stringify({ error: e.message })}\n\n`));
          } finally {
            writer.close();
          }
        })();

        return new Response(readable, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            ...makeCorsHeaders(corsOrigin),
          },
        });
      }

      // 5. 非流式：一次性 JSON 返回
      const data = await modelRes.json();
      const summary = data?.choices?.[0]?.message?.content?.trim() || "";
      return new Response(JSON.stringify({ summary }), {
        headers: { "Content-Type": "application/json", ...makeCorsHeaders(corsOrigin) },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...makeCorsHeaders(corsOrigin) },
      });
    }
  },
};
