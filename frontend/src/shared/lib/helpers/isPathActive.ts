const normalizePath = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, '') : path;

export const isPathActive = (pathname: string, href: string) =>
  normalizePath(pathname) === normalizePath(href);
