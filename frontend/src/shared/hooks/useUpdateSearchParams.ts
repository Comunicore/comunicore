'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Value = string | number | boolean | string[] | null | undefined;

export function useUpdateSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (updates: Record<string, Value>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      const empty =
        value == null ||
        value === '' ||
        value === false ||
        (Array.isArray(value) && !value.length);
      if (empty) params.delete(key);
      else params.set(key, String(value));
    });

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
}
