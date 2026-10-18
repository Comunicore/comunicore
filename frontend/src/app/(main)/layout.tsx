import { ReactNode } from 'react';

export default function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <main className='flex-1'>{children}</main>;
}
