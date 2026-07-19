// 文档站 Markdown 扩展配置
// 复用主题的 markdown-it 扩展逻辑，使文档站能实际渲染主题特有的语法
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import markdownItAttrs from 'markdown-it-attrs'
import container from 'markdown-it-container'

const markdownExtensions = (md) => {
  // 属性语法 {:class="xxx"}
  md.use(markdownItAttrs)

  // tabs 标签页
  md.use(tabsMarkdownPlugin)

  // 状态图标短别名 - :done: :fail: :wip: :wait: :warn: 转换为带颜色的 Iconify 图标
  const statusIcons = {
    done: { icon: 'lucide:circle-check-big', class: 'status-icon status-done' },
    fail: { icon: 'lucide:circle-x', class: 'status-icon status-fail' },
    wip: { icon: 'lucide:loader-circle', class: 'status-icon status-wip' },
    wait: { icon: 'lucide:clock', class: 'status-icon status-wait' },
    warn: { icon: 'lucide:triangle-alert', class: 'status-icon status-warn' }
  }
  md.inline.ruler.before('emphasis', 'status-icon', (state, silent) => {
    const start = state.pos
    if (state.src.charAt(start) !== ':') return false
    const end = state.src.indexOf(':', start + 1)
    if (end === -1) return false
    const name = state.src.slice(start + 1, end)
    if (!statusIcons[name]) return false
    if (!silent) {
      const { icon, class: cls } = statusIcons[name]
      const token = state.push('html_inline', '', 0)
      token.content = `<Icon icon="${icon}" class="${cls}" />`
    }
    state.pos = end + 1
    return true
  })

  // 按键块扩展 - %%k%% 转换为 <span class="keybutton">k</span>
  md.inline.ruler.after('emphasis', 'keybutton', (state, silent) => {
    const start = state.pos
    if (state.src.charAt(start) !== '%' || state.src.charAt(start + 1) !== '%') {
      return false
    }
    const end = state.src.indexOf('%%', start + 2)
    if (end === -1) {
      return false
    }
    if (!silent) {
      const keyText = state.src.slice(start + 2, end)
      const token = state.push('keybutton_open', 'span', 1)
      token.attrSet('class', 'keybutton')
      const contentToken = state.push('text', '', 0)
      contentToken.content = keyText
      state.push('keybutton_close', 'span', -1)
    }
    state.pos = end + 2
    return true
  })

  // timeline 时间线容器
  md.use(container, 'timeline', {
    validate: (params) => params.trim().match(/^timeline\s+(.*)$/),
    render: (tokens, idx) => {
      const m = tokens[idx].info.trim().match(/^timeline\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return `<div class="timeline"><span class="timeline-title">${md.utils.escapeHtml(m[1])}</span><div class="timeline-content">`
      } else {
        return '</div></div>\n'
      }
    }
  })

  // radio 单选容器
  md.use(container, 'radio', {
    render: (tokens, idx, _options, env) => {
      const token = tokens[idx]
      const check = token.info.trim().slice('radio'.length).trim()
      if (token.nesting === 1) {
        const isChecked = md.renderInline(check, { references: env.references })
        return `<div class="radio"><div class="radio-point ${isChecked}" />`
      } else {
        return '</div>'
      }
    }
  })

  // button 按钮容器
  md.use(container, 'button', {
    render: (tokens, idx) => {
      const token = tokens[idx]
      const check = token.info.trim().slice('button'.length).trim()
      if (token.nesting === 1) {
        return `<button class="md-button ${check}">`
      } else {
        return '</button>'
      }
    }
  })

  // card 卡片容器
  md.use(container, 'card', {
    render: (tokens, idx) => {
      if (tokens[idx].nesting === 1) {
        return '<div class="md-card">'
      } else {
        return '</div>'
      }
    }
  })

  // 注意：不覆盖 table_open / table_close
  // VitePress 默认主题已对表格有样式支持，覆盖会与 Vue 编译器冲突
}

export default markdownExtensions
