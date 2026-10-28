'use client';

import { useMemo } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { useUpdateSearchParams } from '../hooks/useUpdateSearchParams';

import { Button } from './Button';

const SKIP_BUTTON_LABEL = '...';

export const getPaginationRange = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const range: (number | string)[] = [];

  if (currentPage < 4) {
    range.push(1, 2, 3, SKIP_BUTTON_LABEL, totalPages);
  } else if (currentPage >= totalPages - 2) {
    range.push(
      1,
      SKIP_BUTTON_LABEL,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );
  } else {
    range.push(
      1,
      SKIP_BUTTON_LABEL,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      SKIP_BUTTON_LABEL,
      totalPages,
    );
  }

  return range;
};

interface PaginationProps {
  totalPages: number;
  pageQueryKey: string;
  currentPage: number;
}

export function Pagination({
  totalPages,
  pageQueryKey,
  currentPage,
}: PaginationProps) {
  const setParams = useUpdateSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setParams({ [pageQueryKey]: page === 1 ? undefined : page });
  };

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center gap-x-2 py-6 select-none'>
      <Button
        type='button'
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label='Prev page'
        size='square'
        color='bordered'
        title='Previous page'
        disabled={currentPage <= 1}
      >
        <LuChevronLeft size={20} className='min-w-5' role='img' aria-hidden />
      </Button>
      {paginationRange.map((page, index) => {
        if (page === SKIP_BUTTON_LABEL) {
          return (
            <Button
              key={`dots-${index}`}
              type='button'
              color='bordered'
              size='square'
            >
              ...
            </Button>
          );
        }

        const isCurrent = Number(page) === currentPage;

        return (
          <Button
            key={`page-${page}`}
            type='button'
            onClick={() => handlePageChange(Number(page))}
            size='square'
            color={isCurrent ? 'purple' : 'bordered'}
          >
            {page}
          </Button>
        );
      })}

      <Button
        type='button'
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label='Next page'
        size='square'
        color='bordered'
        title='Next page'
        disabled={currentPage >= totalPages}
      >
        <LuChevronRight size={20} className='min-w-5' role='img' aria-hidden />
      </Button>
    </div>
  );
}
