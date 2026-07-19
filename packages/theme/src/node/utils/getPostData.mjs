import { generateId } from "./commonTools.mjs";
import { globby } from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import CryptoJS from "crypto-js";
import path from "path";

/**
 * 兜底加密密钥
 *
 * 当用户未在 defineConfig 的 options 中配置 cryptoSecretKeyFile 时使用此兜底密钥，
 * 确保安装主题后即使不配置密钥也能正常启动项目。
 *
 * ⚠️ 安全警告：此兜底密钥硬编码在主题源码中，会随 npm 包公开发布，任何人都能从源码获取。
 * 因此它仅提供"能跑起来"的基础保护，不具真正的安全意义。
 * 用户应在 defineConfig 的 options 中配置 cryptoSecretKeyFile 指向自己的本地密钥文件，
 * 使用站点私有密钥才能获得真正的加密保护。
 */
const FALLBACK_SECRET_KEY =
  "vitepress-theme-ninc-fallback-key-not-secure-please-configure-cryptoSecretKeyFile";

/**
 * 获取指定文章目录下所有 Markdown 文件的路径
 * @param {string} [postsDir] - 文章目录绝对路径，默认 path.resolve(process.cwd(), 'posts')
 * @returns {Promise<string[]>} - 文件路径数组（相对于 process.cwd 的相对路径）
 */
const getPostMDFilePaths = async (postsDir) => {
  try {
    postsDir = postsDir || path.resolve(process.cwd(), "posts");
    // 计算 postsDir 相对于 process.cwd 的相对路径，供 globby 使用
    const relPostsDir = path.relative(process.cwd(), postsDir);
    // 扫描文章目录下所有 md 文件
    let paths = await globby([`${relPostsDir}/**/*.md`], {
      ignore: ["node_modules", "pages", ".vitepress", "README.md"],
    });
    return paths;
  } catch (error) {
    console.error("获取文章路径时出错:", error);
    throw error;
  }
};

/**
 * 基于 frontMatter 日期降序排序文章
 * @param {Object} obj1 - 第一篇文章对象
 * @param {Object} obj2 - 第二篇文章对象
 * @returns {number} - 比较结果
 */
const compareDate = (obj1, obj2) => {
  return obj1.date < obj2.date ? 1 : -1;
};
const comparePostPriority = (a, b) => {
  // 如果a是置顶文章，b不是，则a排在b前面
  if (a.top && !b.top) {
    return -1;
  }
  if (!a.top && b.top) {
    return 1;
  }
  // 在置顶状态相同的情况下，按照recommend推荐排序
  if (a.recommend && !b.recommend) {
    return -1;
  }
  if (!a.recommend && b.recommend) {
    return 1;
  }
  return compareDate(a, b);
};

/**
 * 获取所有文章，读取其内容并解析 front matter
 *
 * 加密文章的密码哈希使用站点密钥（站点私有，不再硬编码在主题源码中）做 HMAC-SHA256。
 * 站点密钥由用户在 defineConfig 的 options.cryptoSecretKeyFile 中指定本地密钥文件路径，
 * 主题在构建期读取该文件内容作为密钥。访问者上传的密钥文件内容必须与此站点密钥完全一致。
 *
 * @param {string} [postsDir] - 文章目录绝对路径，默认 path.resolve(process.cwd(), "posts")
 * @param {string} [cryptoSecretKey] - 站点加密密钥（明文字符串），用于对 frontmatter 中的密码做 HMAC-SHA256。若有加密文章但未提供，会抛出明确错误。
 * @param {Object} [options] - 附加选项
 * @param {boolean} [options.includeContent] - 为 true 时文章对象额外携带 _content（Markdown 正文，不含 frontmatter）
 *   与 _hasArticleGPT（是否手动填写了 articleGPT）。仅供构建期 AI 摘要生成使用，
 *   使用完毕后必须由调用方删除，避免正文泄漏到客户端 themeConfig。
 * @returns {Promise<Object[]>} - 文章对象数组
 */
export const getAllPosts = async (postsDir, cryptoSecretKey, options = {}) => {
  const { includeContent = false } = options;
  try {
    // 获取所有 Markdown 文件的路径
    let paths = await getPostMDFilePaths(postsDir);
    // 读取和处理每个 Markdown 文件的内容
    let posts = await Promise.all(
      paths.map(async (item) => {
        try {
          // 读取文件内容
          const content = await fs.readFile(item, "utf-8");
          // 文件的元数据
          const stat = await fs.stat(item);
          // 获取文件创建时间和最后修改时间
          const { birthtimeMs, mtimeMs } = stat;
          // 解析 front matter
          const { data, content: markdownBody } = matter(content);
          const {
            title,
            date,
            categories,
            description,
            tags,
            top,
            cover,
            recommend,
            cbx,
            reprint,
            mainColor,
            crypto,
            articleGPT,
          } = data;
          // 计算文章的过期天数
          const expired = Math.floor(
            (new Date().getTime() - new Date(date).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          // 对密码进行加密处理：使用站点密钥（站点私有）和 HMAC-SHA256 算法
          // 站点密钥不再硬编码在主题源码中，避免 npm 包分发后密钥对所有人公开
          //
          // 兜底策略：当 cryptoSecretKey 未传时（用户未配置 cryptoSecretKeyFile，
          // 或 paths.mjs 等动态路由文件无密钥调用），使用内置兜底密钥让项目能正常启动，
          // 不抛错。defineConfig 会在启动时打印警告提醒用户配置自己的密钥以获得真正安全。
          const effectiveSecretKey = cryptoSecretKey || FALLBACK_SECRET_KEY;
          const formatCrypto = {
            enable: crypto?.enable,
            password: crypto?.password
              ? encryptPassword(crypto.password.toString(), effectiveSecretKey)
              : undefined,
          };

          // 密码加密函数，使用 HMAC-SHA256 算法和站点密钥
          function encryptPassword(password, secretKey) {
            // 使用 HMAC-SHA256 算法加密密码
            return CryptoJS.HmacSHA256(password, secretKey).toString();
          }
          // 返回文章对象
          const post = {
            id: generateId(item),
            title: title || "未命名文章",
            date: date ? new Date(date).getTime() : birthtimeMs,
            lastModified: mtimeMs,
            expired,
            tags,
            categories,
            description,
            regularPath: `/${item.replace(".md", ".html")}`,
            top,
            cover,
            recommend,
            cbx,
            reprint,
            mainColor,
            crypto: formatCrypto,
          };
          // 构建期 AI 摘要生成专用临时字段（调用方用完后必须删除，禁止进入客户端 themeConfig）
          if (includeContent) {
            post._content = markdownBody;
            post._hasArticleGPT = Boolean(articleGPT);
          }
          return post;
        } catch (error) {
          console.error(`处理文章文件 '${item}' 时出错:`, error);
          throw error;
        }
      })
    );
    // 根据日期排序文章
    posts.sort(comparePostPriority);
    return posts;
  } catch (error) {
    console.error("获取所有文章时出错:", error);
    throw error;
  }
};

/**
 * 获取所有标签及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含标签统计信息的对象
 */
export const getAllType = (postData) => {
  const tagData = {};
  // 遍历数据
  postData.map((item) => {
    // 检查是否有 tags 属性
    if (!item.tags || item.tags.length === 0) return;
    // 处理标签
    if (typeof item.tags === "string") {
      // 以逗号分隔
      item.tags = item.tags.split(",");
    }
    // 遍历文章的每个标签
    item.tags.forEach((tag) => {
      // 初始化标签的统计信息，如果不存在
      if (!tagData[tag]) {
        tagData[tag] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果标签已存在，则增加计数和记录所属文章
        tagData[tag].count++;
        tagData[tag].articles.push(item);
      }
    });
  });
  return tagData;
};

/**
 * 获取所有分类及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含标签统计信息的对象
 */
export const getAllCategories = (postData) => {
  const catData = {};
  // 遍历数据
  postData.map((item) => {
    if (!item.categories || item.categories.length === 0) return;
    // 处理标签
    if (typeof item.categories === "string") {
      // 以逗号分隔
      item.categories = item.categories.split(",");
    }
    // 遍历文章的每个标签
    item.categories.forEach((tag) => {
      // 初始化标签的统计信息，如果不存在
      if (!catData[tag]) {
        catData[tag] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果标签已存在，则增加计数和记录所属文章
        catData[tag].count++;
        catData[tag].articles.push(item);
      }
    });
  });
  return catData;
};

/**
 * 获取所有年份及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含归档统计信息的对象
 */
export const getAllArchives = (postData) => {
  const archiveData = {};
  // 遍历数据
  postData.forEach((item) => {
    // 检查是否有 date 属性
    if (item.date) {
      // 将时间戳转换为日期对象
      const date = new Date(item.date);
      // 获取年份
      const year = date.getFullYear().toString();
      // 初始化该年份的统计信息，如果不存在
      if (!archiveData[year]) {
        archiveData[year] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果年份已存在，则增加计数和记录所属文章
        archiveData[year].count++;
        archiveData[year].articles.push(item);
      }
    }
  });
  // 提取年份并按降序排序
  const sortedYears = Object.keys(archiveData).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );
  return { data: archiveData, year: sortedYears };
};

/**
 * 获取非加密文章数据
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object[]} - 筛选后的非加密文章数组
 */
export const getUnencryptedPosts = (postData) => {
  // 筛选出crypto.enable不为true的文章
  return postData.filter((item) => {
    return !item.crypto || !item.crypto.enable;
  });
};
