import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { PostsSection } from './PostsSection';

const state = vi.hoisted(() => ({ search: '' }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(state.search),
  usePathname: () => '/posts',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('./NotFoundRespl', () => ({ NotFoundResp: () => null }));
vi.mock('@/features/filter-by-tag', () => ({ FilterByTag: () => null }));
vi.mock('@/features/posts-filtration', () => ({ PostsFiltration: () => null }));

vi.mock('@/entities/post', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/post')>()),
  PostCard: ({ post }: { post: { title: string } }) => <div>{post.title}</div>,
}));

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  state.search = '';
});
afterAll(() => server.close());

const postsHandler = (body: unknown, status = 200) =>
  http.get('*/posts*', () => HttpResponse.json(body as object, { status }));

function renderSection() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PostsSection />
    </QueryClientProvider>,
  );
}

describe('PostsSection + API', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('загружает и отображает пост', async () => {
    server.use(
      postsHandler({
        posts: [{ id: 1, title: 'Первый пост' }],
        totalCountEstimated: 1,
      }),
    );
    renderSection();
    expect(await screen.findByText('Первый пост')).toBeInTheDocument();
  });

  it('отображает несколько постов', async () => {
    server.use(
      postsHandler({
        posts: [
          { id: 1, title: 'A' },
          { id: 2, title: 'B' },
          { id: 3, title: 'C' },
        ],
        totalCountEstimated: 3,
      }),
    );
    renderSection();
    expect(await screen.findByText('A')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('пустое состояние', async () => {
    server.use(postsHandler({ posts: [], totalCountEstimated: 0 }));
    renderSection();
    expect(await screen.findByText('Пока нет постов')).toBeInTheDocument();
  });

  it('ошибка API (500)', async () => {
    server.use(postsHandler({}, 500));
    renderSection();
    expect(
      await screen.findByText('Не удалось загрузить посты'),
    ).toBeInTheDocument();
  });

  it('состояние загрузки', async () => {
    server.use(
      http.get('*/posts*', async () => {
        await delay('infinite');
      }),
    );
    renderSection();
    expect(await screen.findByLabelText('Загрузка постов')).toBeInTheDocument();
  });

  it('при разбивке на страницы уходит нужная страница', async () => {
    state.search = 'page=2';
    let requestedPage: string | null = null;
    let requestedLimit: string | null = null;
    server.use(
      http.get('*/posts*', ({ request }) => {
        requestedPage = new URL(request.url).searchParams.get('page');
        requestedLimit = new URL(request.url).searchParams.get('limit');
        return HttpResponse.json({
          posts: [{ id: 1, title: 'P' }],
          totalCountEstimated: 50,
        });
      }),
    );
    renderSection();
    await screen.findByText('P');
    expect(requestedPage).toBe('2');
    expect(requestedLimit).toBe('20');
  });

  it('Не удалось загрузить посты', async () => {
    server.use(postsHandler({ unexpected: true }));
    renderSection();
    expect(
      await screen.findByText('Не удалось загрузить посты'),
    ).toBeInTheDocument();
  });

  it('неполный пост не роняет страницу', async () => {
    server.use(postsHandler({ posts: [{ id: 1 }], totalCountEstimated: 1 }));
    renderSection();
    expect(await screen.findByRole('listitem')).toBeInTheDocument();
  });
});
