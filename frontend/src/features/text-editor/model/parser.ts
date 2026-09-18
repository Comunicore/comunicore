import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

export const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre><code class="hljs language-${lang}">` +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        );
      } catch (error) {
        console.error(error);
      }
    }

    return (
      '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
    );
  },
});

// Links security

md.renderer.rules.link_open = (tokens, idx, options, _, self) => {
  const aIndex = tokens[idx].attrIndex('target');
  const token = tokens[idx];

  const hrefIndex = token.attrIndex('href');
  const href = hrefIndex >= 0 ? token.attrs![hrefIndex][1] : '';

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']);
  } else {
    tokens[idx].attrs![aIndex][1] = '_blank';
  }
  tokens[idx].attrPush(['rel', 'noopener noreferrer']);

  token.attrPush(['data-confirm-link', href]);

  return self.renderToken!(tokens, idx, options);
};
