import { client } from './generated/client.gen';

const isMocking =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_API_MODE === 'mock';

export const apiBaseUrl = isMocking
  ? '/'
  : (process.env.NEXT_PUBLIC_API_URL ?? 'https://comunicore.mooo.com');

client.setConfig({
  baseUrl: apiBaseUrl,
  credentials: 'include',
});
