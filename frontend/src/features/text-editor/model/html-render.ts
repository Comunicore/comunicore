import { md } from './parser';
import { santitize } from './santitize';

export function renderHtml(markdown: string) {
  const html = md.render(markdown);

  return santitize(html);
}
