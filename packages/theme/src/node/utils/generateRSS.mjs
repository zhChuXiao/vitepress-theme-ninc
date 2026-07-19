import { createContentLoader } from "vitepress";
import { writeFileSync } from "fs";
import { Feed } from "feed";
import path from "path";

/**
 * 生成 RSS
 * @param {*} config VitePress buildEnd
 * @param {*} themeConfig 主题配置
 * @param {Object} [options] - 可选参数
 * @param {string} [options.rssOutput] - RSS 输出文件绝对路径，默认 path.join(config.outDir, 'rss.xml')
 * @param {string} [options.postsDir] - 文章目录绝对路径，默认 path.resolve(process.cwd(), 'posts')
 */
export const createRssFile = async (config, themeConfig, options = {}) => {
  // 配置信息
  const siteMeta = themeConfig.siteMeta;
  const hostLink = siteMeta.site;
  // Feed 实例
  const feed = new Feed({
    title: siteMeta.title,
    description: siteMeta.description,
    id: hostLink,
    link: hostLink,
    language: "zh",
    generator: siteMeta.author.name,
    favicon: siteMeta.author.cover,
    copyright: `Copyright © 2020-present ${siteMeta.author.name}`,
    updated: new Date(),
  });
  // 推导文章目录的相对路径（供 createContentLoader 使用，glob 模式相对于 VitePress srcDir）
  const cwd = process.cwd();
  const absPostsDir = options.postsDir || path.resolve(cwd, "posts");
  const relPostsDir = path.relative(cwd, absPostsDir);
  // 加载文章
  let posts = await createContentLoader(`${relPostsDir}/**/*.md`, {
    render: true,
  }).load();
  // 日期降序排序
  posts = posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB - dateA;
  });
  for (const { url, frontmatter } of posts) {
    // 过滤加密文章（crypto.enable: true）——不计入 RSS，避免泄露加密内容
    if (frontmatter.crypto?.enable) continue;
    // 仅保留最近 10 篇文章
    if (feed.items.length >= 10) break;
    // 文章信息
    let { title, description, date } = frontmatter;
    // 处理日期
    if (typeof date === "string") date = new Date(date);
    // 添加文章
    feed.addItem({
      title,
      id: `${hostLink}${url}`,
      link: `${hostLink}${url}`,
      description,
      date,
      // updated,
      author: [
        {
          name: siteMeta.author.name,
          email: siteMeta.author.email,
          link: siteMeta.author.link,
        },
      ],
    });
  }
  // 写入文件：优先使用用户指定的 rssOutput，否则写到 VitePress 构建输出目录
  const outputPath = options.rssOutput || path.join(config.outDir, "rss.xml");
  writeFileSync(outputPath, feed.rss2(), "utf-8");
};
