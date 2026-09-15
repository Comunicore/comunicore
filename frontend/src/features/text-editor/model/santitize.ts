import DOMPurify from 'isomorphic-dompurify';

export const santitize = (html: string) =>
  DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
