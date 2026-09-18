'use client';

import { useEffect, useState } from 'react';

const isDev = process.env.NODE_ENV !== 'production';
const isMockMode = process.env.NEXT_PUBLIC_API_MODE === 'mock';
const shouldMock = isDev && isMockMode;

/**
 * Синглтон на уровне модуля, а не состояние компонента.
 *
 * В деве StrictMode монтирует провайдер дважды, и два worker.start() уходят
 * конкурентно. MSW от этого не защищает: его проверка readyState ловит только
 * уже поднятый воркер, а между ней и configure() лежит await регистрации
 * service worker'а — в это окно и попадает второй вызов, после чего падает
 * инвариант «cannot configure an already enabled network».
 *
 * Промис живёт вне жизненного цикла компонента, поэтому старт случается ровно
 * один раз, сколько бы раз провайдер ни перемонтировали.
 */
let workerStart: Promise<void> | null = null;

const startWorker = (): Promise<void> => {
  if (!workerStart) {
    // start() резолвится ServiceWorkerRegistration — гасим его до void,
    // чтобы наружу торчал один понятный «воркер поднят» без деталей MSW.
    workerStart = import('@/shared/api/mock/browser').then(
      async ({ worker }) => {
        await worker.start({ onUnhandledRequest: 'bypass' });
      },
    );
  }

  return workerStart;
};

const MswProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(!shouldMock);

  useEffect(() => {
    if (!shouldMock) return;

    startWorker()
      .catch((error: unknown) => {
        // Приложение не блокируем: без моков запросы просто уйдут в реальный API.
        console.error('MSW не запустился, моки недоступны:', error);
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return children;
};

export default MswProvider;
