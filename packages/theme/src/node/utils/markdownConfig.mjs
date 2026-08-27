import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import markdownItAttrs from "markdown-it-attrs";
import container from "markdown-it-container";

// markdown-it
const markdownConfig = (md, themeConfig) => {
  // 插件
  md.use(markdownItAttrs);
  md.use(tabsMarkdownPlugin);
  
  // 按键块扩展 - 将%%k%%转换为<span class="keybutton">k</span>
  md.inline.ruler.after('emphasis', 'keybutton', (state, silent) => {
    const start = state.pos;
    
    // 检查是否以%%开头
    if (state.src.charAt(start) !== '%' || state.src.charAt(start + 1) !== '%') {
      return false;
    }
    
    // 查找结束标记%%
    let end = state.src.indexOf('%%', start + 2);
    if (end === -1) {
      return false; // 没有找到结束标记
    }
    
    // 如果是静默模式则不生成token，只验证语法
    if (!silent) {
      // 提取按键文本
      const keyText = state.src.slice(start + 2, end);
      
      // 创建token
      const token = state.push('keybutton_open', 'span', 1);
      token.attrSet('class', 'keybutton');
      
      // 添加内容token
      const contentToken = state.push('text', '', 0);
      contentToken.content = keyText;
      
      // 添加关闭token
      state.push('keybutton_close', 'span', -1);
    }
    
    // 更新解析位置
    state.pos = end + 2;
    return true;
  });
  
  // timeline
  md.use(container, "timeline", {
    validate: (params) => params.trim().match(/^timeline\s+(.*)$/),
    render: (tokens, idx) => {
      const m = tokens[idx].info.trim().match(/^timeline\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        return `<div class="timeline">
                    <span class="timeline-title">${md.utils.escapeHtml(m[1])}</span>
                    <div class="timeline-content">`;
      } else {
        return "</div></div>\n";
      }
    },
  });
  // radio
  md.use(container, "radio", {
    render: (tokens, idx, _options, env) => {
      const token = tokens[idx];
      const check = token.info.trim().slice("radio".length).trim();
      if (token.nesting === 1) {
        const isChecked = md.renderInline(check, {
          references: env.references,
        });
        return `<div class="radio">
          <div class="radio-point ${isChecked}" />`;
      } else {
        return "</div>";
      }
    },
  });
  // button
  md.use(container, "button", {
    render: (tokens, idx, _options) => {
      const token = tokens[idx];
      const check = token.info.trim().slice("button".length).trim();
      if (token.nesting === 1) {
        return `<button class="button ${check}">`;
      } else {
        return "</button>";
      }
    },
  });
  // card
  md.use(container, "card", {
    render: (tokens, idx, _options) => {
      const token = tokens[idx];
      if (token.nesting === 1) {
        return `<div class="card">`;
      } else {
        return "</div>";
      }
    },
  });
  // 表格
  md.renderer.rules.table_open = () => {
    return '<div class="table-container"><table>';
  };
  md.renderer.rules.table_close = () => {
    return "</table></div>";
  };
  // 图片
  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx];
    // src/alt 都来自 markdown 原文，可能含引号/尖括号（如 ![他说"hi"](x.png)），
    // 直接拼进 HTML 会产生畸形属性甚至注入；escapeHtml 同时覆盖属性与文本两个插值位。
    // 对不含特殊字符的正常内容，转义前后输出逐字节一致。
    const src = md.utils.escapeHtml(token.attrs[token.attrIndex("src")][1]);
    const alt = md.utils.escapeHtml(token.content);
    // 白名单透传 markdown-it-attrs 附加的属性（id/width/height/class），
    // 其余键（如 onerror 等事件属性）一律丢弃，防注入；所有值同样过 escapeHtml。
    const attrWhitelist = ["id", "width", "height"];
    let extraClass = "";
    const extraParts = [];
    for (const [key, value] of token.attrs || []) {
      if (key === "class") {
        extraClass = value;
      } else if (attrWhitelist.includes(key)) {
        extraParts.push(` ${key}="${md.utils.escapeHtml(value)}"`);
      }
    }
    const extra = extraParts.join("");
    const classAttr = extraClass ? ` class="${md.utils.escapeHtml(extraClass)}"` : "";
    if (!themeConfig.fancybox.enable) {
      return `<img src="${src}" alt="${alt}" loading="lazy"${extra}${classAttr}>`;
    }
    // fancybox 模式：自定义 class 并入 post-img，避免与灯箱样式冲突
    const fancyImgClass = extraClass ? `post-img ${md.utils.escapeHtml(extraClass)}` : "post-img";
    return `<a class="img-fancybox" href="${src}" data-fancybox="gallery" data-caption="${alt}">
                <img class="${fancyImgClass}" src="${src}" alt="${alt}" loading="lazy"${extra} />
                <span class="post-img-tip">${alt}</span>
              </a>`;
  };
};

export default markdownConfig;
