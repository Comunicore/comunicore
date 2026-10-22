import { ReactNode } from 'react';

import getPostIds from './model/getPostIds';

export async function generateStaticParams() {
  const ids = await getPostIds();

  return ids.map((id) => ({ id }));
}

export default function PostLayout({ children }: { children: ReactNode }) {
  return children;
}
