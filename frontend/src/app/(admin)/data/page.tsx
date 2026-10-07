'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';

import type { AnalyticsMetricsResponse } from '@/shared/api/generated';
import { apiBaseUrl } from '@/shared/api/setup';

function explain401(body: string): string {
  if (body.includes('failed to read security credentials')) {
    return (
      'Бэкенд не видит cookie сессии (sid). Сделай так: 1) запуск фронта через npm run dev:local ' +
      '(чтобы логин и метрики шли на один хост API); 2) войди в аккаунт на этом же фронте; 3) обнови эту страницу.'
    );
  }
  return body.replace(/\s+/g, ' ').slice(0, 280);
}

function formatMs(ms: number): string {
  if (ms >= 1_000_000) return `${(ms / 1_000_000).toFixed(2)} млн мс`;
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} с`;
  return `${Math.round(ms)} мс`;
}

function formatPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className='space-y-2.5'>
      <div className='border-b border-slate-200/90 pb-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <span
            className='bg-blue-16 shadow-blue-16/35 h-2 w-2 shrink-0 rounded-full shadow-sm'
            aria-hidden
          />
          <h2 className='text-sm font-semibold tracking-tight text-slate-900'>
            {title}
          </h2>
        </div>
        {description ? (
          <p className='mt-1 max-w-xl pl-4 text-xs leading-relaxed text-slate-500'>
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='hover:border-blue-d3/80 hover:shadow-blue-20/10 group relative overflow-hidden rounded-xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50/90 px-3 py-2.5 shadow-sm shadow-slate-900/5 transition hover:shadow-md'>
      <div className='from-blue-16/0 to-blue-16/12 pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b opacity-0 transition group-hover:opacity-100' />
      <div className='relative'>
        <div className='text-xs leading-relaxed text-slate-600'>{label}</div>
        <div className='text-blue-20 mt-1.5 text-base font-semibold tracking-tight tabular-nums'>
          {value}
        </div>
      </div>
    </div>
  );
}

function PostHighlightCard({
  period,
  postId,
  title,
  repliesInWindow,
}: {
  period: string;
  postId: number;
  title: string;
  repliesInWindow: number;
}) {
  return (
    <div className='to-blue-d3/15 hover:border-blue-d3/70 relative overflow-hidden rounded-xl border border-slate-200/85 bg-linear-to-br from-white via-white px-3 py-2.5 shadow-sm shadow-slate-900/5 transition hover:shadow-md'>
      <div className='from-blue-16 to-blue-77 absolute top-0 bottom-0 left-0 w-0.5 bg-linear-to-b opacity-90' />
      <div className='pl-2'>
        <div className='flex items-center justify-between gap-2'>
          <span className='shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white'>
            {period}
          </span>
          <span className='text-xs text-slate-500'>
            ответов:{' '}
            <span className='font-semibold text-slate-800'>
              {repliesInWindow}
            </span>
          </span>
        </div>
        <p className='mt-2 text-sm leading-relaxed text-slate-900'>
          <span className='text-blue-16 text-xs'>#{postId}</span> {title}
        </p>
      </div>
    </div>
  );
}

function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className='overflow-hidden rounded-xl border border-slate-200/85 bg-white shadow-md ring-1 shadow-slate-900/6 ring-slate-900/4'>
      <div className='custom-scrollbar overflow-x-auto'>{children}</div>
    </div>
  );
}

function TableHeadRow({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className='to-blue-16 bg-linear-to-r from-slate-900 text-left text-white shadow-inner shadow-black/10'>
        {children}
      </tr>
    </thead>
  );
}

function maxSharePercent(rows: { sharePercent: number }[]): number {
  return Math.max(...rows.map((r) => r.sharePercent), 0.0001);
}

function MetricsBoard({ data }: { data: AnalyticsMetricsResponse }) {
  const maxHourShare = useMemo(
    () => maxSharePercent(data.activityByHourUtc),
    [data.activityByHourUtc],
  );

  return (
    <div className='mt-6 space-y-7'>
      <Section title='Сводка' description='События и участники'>
        <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
          <StatCard
            label='Среднее active (фокус вкладки)'
            value={formatMs(data.avgActiveTimeMs)}
          />
          <StatCard
            label='Среднее visible (вкладка видна)'
            value={formatMs(data.avgVisibleTimeMs)}
          />
          <StatCard
            label='Макс. active за батч'
            value={formatMs(data.maxActiveTimeMs)}
          />
          <StatCard
            label='Плотность связей (ответы / участники)'
            value={data.connectionDensity.toFixed(2)}
          />
          <StatCard
            label={`Отток (≥${data.dropoffAfterMessages} комментариев, ${data.dropoffInactiveDays} дн.)`}
            value={formatPct(data.dropoffChurnPercent)}
          />
          <StatCard
            label='Mobile: сессии'
            value={formatPct(data.mobilePctSessions)}
          />
          <StatCard
            label='Mobile: читатели'
            value={formatPct(data.mobilePctReaders)}
          />
          <StatCard
            label='Mobile: авторы'
            value={formatPct(data.mobilePctWriters)}
          />
          <StatCard
            label='Mobile: пользователи (батчи)'
            value={formatPct(data.mobilePctUsers)}
          />
        </div>
      </Section>

      {data.topTag ? (
        <Section title='Топ-тег' description='Чаще всего в выборке'>
          <div className='from-blue-d3/25 to-light-fc/40 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-linear-to-r via-white px-3 py-2 shadow-sm'>
            <span className='shadow-orange-f4/25 from-orange-f4 to-orange-c5 rounded-lg bg-linear-to-br px-2.5 py-1 text-xs font-semibold text-white shadow-sm'>
              {data.topTag.tag}
            </span>
            <span className='text-sm text-slate-600'>
              <span className='font-semibold text-slate-900'>
                {data.topTag.usageCount}
              </span>{' '}
              раз
            </span>
          </div>
        </Section>
      ) : null}

      {(data.topThreadWeekly || data.topThreadMonthly) && (
        <Section title='Топ-посты' description='По ответам в окне'>
          <div className='grid gap-2 md:grid-cols-2'>
            {data.topThreadWeekly ? (
              <PostHighlightCard
                period='7 дн.'
                postId={data.topThreadWeekly.threadId}
                title={data.topThreadWeekly.title}
                repliesInWindow={data.topThreadWeekly.repliesInWindow}
              />
            ) : null}
            {data.topThreadMonthly ? (
              <PostHighlightCard
                period='30 дн.'
                postId={data.topThreadMonthly.threadId}
                title={data.topThreadMonthly.title}
                repliesInWindow={data.topThreadMonthly.repliesInWindow}
              />
            ) : null}
          </div>
        </Section>
      )}

      <Section title='Активность по часу (UTC)' description='Доля по часам'>
        <TableShell>
          <table className='w-full min-w-70 text-sm'>
            <TableHeadRow>
              <th className='px-3 py-2.5 text-xs font-semibold tracking-wide'>
                Час UTC
              </th>
              <th className='px-3 py-2.5 text-xs font-semibold tracking-wide'>
                Доля
              </th>
            </TableHeadRow>
            <tbody className='divide-y divide-slate-100'>
              {data.activityByHourUtc.map((row, i) => (
                <tr
                  key={row.hour}
                  className={`hover:bg-blue-d3/25 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                >
                  <td className='px-3 py-2 font-medium whitespace-nowrap text-slate-800 tabular-nums'>
                    {row.hour}
                  </td>
                  <td className='px-3 py-2'>
                    <div className='flex items-center gap-2'>
                      <div className='h-1.5 min-w-14 flex-1 overflow-hidden rounded-full bg-slate-200/90 ring-1 ring-slate-900/5'>
                        <div
                          className='from-blue-16 to-blue-77 shadow-blue-16/20 h-full rounded-full bg-linear-to-r shadow-sm'
                          style={{
                            width: `${Math.min(100, (row.sharePercent / maxHourShare) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className='w-12 shrink-0 text-right text-sm text-slate-700 tabular-nums'>
                        {row.sharePercent.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Section>

      <section className='grid gap-5 lg:grid-cols-2'>
        <Section title='Топ по комментариям'>
          <TableUserCounts rows={data.topUsersByPosts} />
        </Section>
        <Section title='Топ по постам'>
          <TableUserCounts rows={data.topUsersByThreads} />
        </Section>
        <Section title='Только комментарии'>
          <TableUserCounts rows={data.postOnlyUsers} />
        </Section>
        <Section title='Популярные теги'>
          <TableShell>
            <table className='w-full text-sm'>
              <TableHeadRow>
                <th className='px-3 py-2.5 text-xs font-semibold tracking-wide'>
                  Тег
                </th>
                <th className='px-3 py-2.5 text-xs font-semibold tracking-wide'>
                  Постов
                </th>
              </TableHeadRow>
              <tbody className='divide-y divide-slate-100'>
                {data.popularTags.map((row, i) => (
                  <tr
                    key={row.tag}
                    className={`hover:bg-blue-d3/25 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                  >
                    <td className='px-3 py-2'>
                      <span className='bg-blue-d3/45 text-blue-20 inline-block rounded-md px-2 py-0.5 text-xs font-medium'>
                        {row.tag}
                      </span>
                    </td>
                    <td className='px-3 py-2 text-slate-800 tabular-nums'>
                      {row.threadCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        </Section>
      </section>

      <Section title='Комментарии по дням' description='Календарные дни'>
        <TableShell>
          <table className='w-full text-sm'>
            <TableHeadRow>
              <th className='px-3 py-2.5 text-xs font-semibold tracking-wide'>
                День
              </th>
              <th className='px-3 py-2.5 text-xs font-semibold tracking-wide'>
                Комментариев
              </th>
            </TableHeadRow>
            <tbody className='divide-y divide-slate-100'>
              {data.postsActivityByDay.map((row, i) => (
                <tr
                  key={row.day}
                  className={`hover:bg-blue-d3/25 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                >
                  <td className='px-3 py-2 text-slate-800'>{row.day}</td>
                  <td className='text-blue-20 px-3 py-2 font-semibold tabular-nums'>
                    {row.postsCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Section>
    </div>
  );
}

function TableUserCounts({
  rows,
}: {
  rows: AnalyticsMetricsResponse['topUsersByPosts'];
}) {
  if (rows.length === 0) {
    return (
      <p className='rounded-xl border border-dashed border-slate-200/90 bg-slate-50/50 px-3 py-4 text-center text-sm text-slate-500'>
        Нет данных
      </p>
    );
  }
  return (
    <TableShell>
      <table className='w-full table-fixed text-sm'>
        <TableHeadRow>
          <th className='px-3 py-2.5 text-xs font-semibold tracking-wide'>
            Пользователь
          </th>
          <th className='w-24 px-3 py-2.5 text-right text-xs font-semibold tracking-wide whitespace-nowrap'>
            Счёт
          </th>
        </TableHeadRow>
        <tbody className='divide-y divide-slate-100'>
          {rows.map((row, i) => (
            <tr
              key={`${row.userId}-${row.name}`}
              className={`hover:bg-blue-d3/25 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
            >
              <td className='px-3 py-2 align-top text-slate-800'>
                <span className='text-blue-16 text-xs'>#{row.userId}</span>{' '}
                <span className='leading-snug font-medium wrap-break-word'>
                  {row.name}
                </span>
              </td>
              <td className='w-24 px-3 py-2 text-right text-slate-900 tabular-nums'>
                {row.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function PageSkeleton() {
  return (
    <div className='mt-6 animate-pulse space-y-3' aria-hidden>
      <div className='h-7 max-w-xs rounded-lg bg-linear-to-r from-slate-200 via-slate-100 to-slate-200' />
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='h-16 rounded-xl border border-slate-200/80 bg-slate-100/90'
          />
        ))}
      </div>
    </div>
  );
}

export default function DataPage() {
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AnalyticsMetricsResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setMetrics(null);
      setLoading(true);
      setHint(`API: ${apiBaseUrl}`);

      const me = await fetch(`${apiBaseUrl}/api/user/me`, {
        credentials: 'include',
      });

      if (!me.ok) {
        const t = await me.text();
        setError(
          me.status === 401
            ? explain401(t)
            : `Сначала нужна сессия. /api/user/me → HTTP ${me.status} ${t.slice(0, 120)}`,
        );
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/api/analytics/metrics`, {
        credentials: 'include',
      });

      const ct = response.headers.get('content-type') ?? '';
      if (!ct.includes('application/json')) {
        const text = await response.text();
        setError(
          `Ожидался JSON, пришло ${ct.slice(0, 40)}… (первые символы: ${text.slice(0, 80).replace(/\s+/g, ' ')})`,
        );
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const raw = (await response.clone().text()).slice(0, 400);
        setError(
          response.status === 401
            ? explain401(raw)
            : `HTTP ${response.status} — ${raw.replace(/\s+/g, ' ')}`,
        );
        setLoading(false);
        return;
      }

      const data = (await response.json()) as AnalyticsMetricsResponse;
      setMetrics(data);
      setHint(`API: ${apiBaseUrl}`);
      setLoading(false);
    };

    void fetchData().catch((e: unknown) => {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    });
  }, []);

  return (
    <div className='custom-scrollbar min-h-0 flex-1 overflow-y-auto'>
      <div className='mx-auto max-w-6xl px-4 py-5 sm:px-5 lg:px-6'>
        <div className='to-blue-d3/20 shadow-blue-20/10 relative overflow-hidden rounded-2xl border border-white/80 bg-linear-to-br from-white via-white p-4 shadow-xl ring-1 ring-slate-200/50 backdrop-blur-sm sm:p-5'>
          <div className='via-blue-d3/80 pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent to-transparent' />
          <div className='relative flex flex-col gap-3 border-b border-slate-200/70 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2'>
                <span
                  className='from-blue-16 to-blue-77 shadow-blue-16/30 h-6 w-1 shrink-0 rounded-full bg-linear-to-b shadow-sm'
                  aria-hidden
                />
                <div>
                  <h1 className='text-lg font-semibold tracking-tight text-slate-900 sm:text-xl'>
                    Собранные данные
                  </h1>
                  <p className='mt-0.5 text-sm leading-snug text-slate-500'>
                    Вовлечённость, мобильная доля, топы, активность по времени
                  </p>
                </div>
              </div>
            </div>
            {hint ? (
              <div className='to-blue-d3/25 shrink-0 rounded-xl border border-slate-200/80 bg-linear-to-br from-slate-50 px-3 py-2 shadow-sm sm:text-right'>
                <p className='text-[11px] font-semibold tracking-wide text-slate-400'>
                  API
                </p>
                <p className='mt-0.5 text-xs leading-snug break-all text-slate-700'>
                  {hint.replace(/^API:\s*/, '')}
                </p>
              </div>
            ) : null}
          </div>

          {loading ? <PageSkeleton /> : null}

          {error ? (
            <div
              className='ring-orange-f4/15 border-orange-c5/20 from-orange-f4/10 to-light-fc/50 mt-4 rounded-xl border bg-linear-to-br p-4 text-sm shadow-md ring-1'
              role='alert'
            >
              <p className='text-orange-c5 text-sm font-semibold'>
                Ошибка загрузки
              </p>
              <p className='mt-2 text-sm leading-relaxed text-slate-800'>
                {error}
              </p>
            </div>
          ) : null}

          {!loading && !error && metrics ? (
            <MetricsBoard data={metrics} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
