import { postsList } from '@/shared/api/generated';
import { mockPostIds } from '@/shared/api/mock/posts.data';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://comunicore.mooo.com';
const PAGE_LIMIT = 100;
const MAX_PAGES = 100;
const REQUEST_TIMEOUT_MS = 15_000;

const isMockMode =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_API_MODE === 'mock';

const fetchApiPostIds = async () => {
  const ids: string[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const { data } = await postsList({
      baseUrl: API_URL,
      query: { page, limit: PAGE_LIMIT },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!data) break;

    ids.push(...data.posts.map(({ id }) => String(id)));

    if (!data.haveNext || !data.posts.length) break;
  }

  return ids;
};

const FALLBACK_POST_ID = '0';

const loadPostIds = async () => {
  if (isMockMode) return mockPostIds;

  try {
    return await fetchApiPostIds();
  } catch {
    return [];
  }
};

const getPostIds = async () => {
  const ids = await loadPostIds();

  return ids.length ? ids : [FALLBACK_POST_ID];
};

export default getPostIds;
