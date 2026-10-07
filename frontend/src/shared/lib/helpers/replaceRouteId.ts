export const idTemplate = ':id';

export const replaceRouteId = (path: string, id: string) =>
  path.replace(idTemplate, id);
