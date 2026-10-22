export const POST_ID_PLACEHOLDER = '_';

const POST_PATH_PATTERN = /^\/posts\/(\d+)\/?$/;

export const resolvePostId = (pathname: string, routeId: string) =>
  Number(POST_PATH_PATTERN.exec(pathname)?.[1] ?? routeId);
