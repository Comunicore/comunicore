import { idTemplate, replaceRouteId } from './replaceRouteId';

type Paths = Record<string, string>;

type RouteGroup<Root extends string, P extends Paths> = {
  readonly root: Root;
} & {
  readonly [K in keyof P]: `${Root}${P[K] & string}`;
};

type DynamicRoutes<Root extends string> = {
  readonly template: `${Root}/${typeof idTemplate}`;
  getRoute: (id: string) => string;
};

type WithId<Root extends string, P extends Paths> = {
  withId: () => RouteGroup<Root, P> & DynamicRoutes<Root>;
};

/**
 * Собирает группу роутов от общего корня.
 *
 * @example
 * routeGroup('/auth', { login: '?mode=login' })
 * // { root: '/auth', login: '/auth?mode=login' }
 *
 * routeGroup('/posts', { new: '/new' }).withId()
 * // { root: '/posts', new: '/posts/new', template: '/posts/:id', getRoute }
 */
export function routeGroup<
  const Root extends string,
  const P extends Paths = Record<never, string>,
>(root: Root, paths?: P): RouteGroup<Root, P> & WithId<Root, P> {
  const group: Record<string, unknown> = { root };

  for (const [name, path] of Object.entries(paths ?? {})) {
    group[name] = `${root}${path}`;
  }

  Object.defineProperty(group, 'withId', {
    value: () => {
      const template = `${root}/${idTemplate}`;

      return {
        ...group,
        template,
        getRoute: (id: string) => replaceRouteId(template, id),
      };
    },
  });

  return group as RouteGroup<Root, P> & WithId<Root, P>;
}
