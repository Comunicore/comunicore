import { ReactNode } from 'react';

import { mockPostIds } from './model/mock-post';

import { postsList } from '@/widgets/posts-section';

export function generateStaticParams() {
  const ids = new Set([
    ...mockPostIds,
    ...postsList.map(({ id }) => String(id)),
  ]);

  return [...ids].map((id) => ({ id }));
}

export default function PostLayout({ children }: { children: ReactNode }) {
  return children;
}
