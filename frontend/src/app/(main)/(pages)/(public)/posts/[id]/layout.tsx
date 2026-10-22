import { ReactNode } from 'react';

import { POST_ID_PLACEHOLDER } from './model/post-route';

export function generateStaticParams() {
  return [{ id: POST_ID_PLACEHOLDER }];
}

export default function PostLayout({ children }: { children: ReactNode }) {
  return children;
}
