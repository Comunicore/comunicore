'use client';

import { FormHTMLAttributes, useEffect, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { LuChevronDown } from 'react-icons/lu';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  postsFiltrationSchema,
  PostsFiltrationTypes,
} from '../model/filtration.schema';

import {
  filtrationQueryKeys,
  parsePostsParams,
  postsPeriodSortEnum,
  PostsPeriodSortTypes,
  postsSortEnum,
  type PostsSortTypes,
  sortLabels,
  sortPeriodLabels,
} from '@/entities/post';

import { useModal } from '@/shared/hooks/useModal';
import { useUpdateSearchParams } from '@/shared/hooks/useUpdateSearchParams';
import { useWindowResize } from '@/shared/hooks/useWindowResize';
import { cn } from '@/shared/lib/classNames';
import {
  Button,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

export function PostsFiltration(props: FormHTMLAttributes<HTMLFormElement>) {
  const { className, ...restAttrs } = props;
  const searchParams = useSearchParams();
  const setParams = useUpdateSearchParams();
  const { sortBy, period, withoutComments } = parsePostsParams(searchParams);

  const modalRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  const { modalOpen, setModalOpen } = useModal(modalRef, buttonRef);
  const { responsiveIsOpen } = useWindowResize(modalOpen, 1280);
  const isFormInert = !responsiveIsOpen && !modalOpen ? true : undefined;

  const { handleSubmit, register, control, reset } =
    useForm<PostsFiltrationTypes>({
      resolver: zodResolver(postsFiltrationSchema),
      defaultValues: { sortBy, period, withoutComments },
    });

  useEffect(() => {
    reset({ sortBy, period, withoutComments });
  }, [sortBy, period, withoutComments, reset]);

  const onSubmit: SubmitHandler<PostsFiltrationTypes> = (data) => {
    setParams({
      [filtrationQueryKeys.sortBy]: data.sortBy,
      [filtrationQueryKeys.period]: data.period,
      [filtrationQueryKeys.withoutComments]: data.withoutComments,
      [filtrationQueryKeys.page]: undefined,
    });
  };

  const sortOptions = postsSortEnum.options.map((value) => ({
    value: value,
    label: sortLabels[value],
  }));

  const sortPeriodOptions = postsPeriodSortEnum.options.map((value) => ({
    value: value,
    label: sortPeriodLabels[value],
  }));

  return (
    <div className={cn('relative', 'xl:static')}>
      <Button
        type='button'
        color='bordered'
        ref={buttonRef}
        size='lg'
        onClick={() => setModalOpen((prev) => !prev)}
        aria-controls='posts-filtration'
        aria-expanded={modalOpen}
        className='flex w-full justify-between gap-x-5 sm:w-fit xl:hidden'
      >
        Фильтры
        <span>
          <LuChevronDown size={20} aria-hidden className='min-w-5' />
        </span>
      </Button>
      <form
        id='posts-filtration'
        ref={modalRef}
        inert={isFormInert}
        className={cn(
          'bg-dark-1b border-gray-9e/10 absolute top-15 z-10 flex w-full flex-col gap-5 rounded-[1.25rem] border px-2.5 py-3.5',
          'sm:w-100',
          'origin-top transition-all duration-200 ease-out',
          modalOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
          'md:px-3.75 md:py-5',
          'xl:bg-dark-1b/50 xl:pointer-events-auto xl:static xl:top-0 xl:w-full xl:translate-y-0 xl:scale-100 xl:opacity-100',
          className,
        )}
        onSubmit={handleSubmit(onSubmit)}
        {...restAttrs}
      >
        <h2 className='hidden xl:col-auto xl:inline xl:text-lg xl:font-bold'>
          Фильтры
        </h2>
        <Label title='Сортировка' className='flex flex-col gap-y-2'>
          <span>Сортировка</span>
          <Controller
            name='sortBy'
            control={control}
            render={({ field }) => (
              <Select<PostsSortTypes>
                options={sortOptions}
                value={field.value}
                onChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Выберите сортировку' />
                </SelectTrigger>

                <SelectContent data-select-content>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Label>
        <Label title='Период' className='flex flex-col gap-y-2'>
          <span>Период</span>
          <Controller
            name='period'
            control={control}
            render={({ field }) => (
              <Select<PostsPeriodSortTypes>
                options={sortPeriodOptions}
                value={field.value}
                onChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Выберите период' />
                </SelectTrigger>

                <SelectContent data-select-content>
                  {sortPeriodOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Label>
        <Label
          className='flex gap-x-3 [&:has(input:focus-visible)]:rounded-sm [&:has(input:focus-visible)]:ring-1 [&:has(input:focus-visible)]:ring-white'
          htmlFor='sort-checkbox'
        >
          <Checkbox {...register('withoutComments')} id='sort-checkbox' />
          <span>Только без комментариев</span>
        </Label>
        <Button color='transparent' type='submit' size='xl'>
          Применить
        </Button>
      </form>
    </div>
  );
}
