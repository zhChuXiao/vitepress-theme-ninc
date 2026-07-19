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
    const src = token.attrs[token.attrIndex("src")][1];
    const alt = token.content;
    if (!themeConfig.fancybox.enable) {
      return `<img src="${src}" alt="${alt}" loading="lazy">`;
    }
    return `<a class="img-fancybox" href="${src}" data-fancybox="gallery" data-caption="${alt}">
                <img class="post-img" src="${src}" alt="${alt}" loading="lazy" />
                <span class="post-img-tip">${alt}</span>
              </a>`;
  };
};

export default markdownConfig;
