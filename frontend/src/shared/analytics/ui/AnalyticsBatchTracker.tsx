'use client';

import { useEffect, useRef } from 'react';

import { apiBaseUrl } from '../../api/setup';

type AnalyticsBatchPayload = {
  clientBatchId: string;
  activeDurationMs: number;
  visibleDurationMs: number;
  isMobile: boolean;
  hadComposeActivity: boolean;
  hadReadActivity: boolean;
  batchStartAt: string;
  batchEndAt: string;
};

const FLUSH_INTERVAL_MS = 60_000;
const TICK_MS = 1_000;

const generateBatchId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const detectMobile = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  if ('userAgentData' in navigator) {
    const uaData = navigator.userAgentData as { mobile?: boolean };
    if (typeof uaData.mobile === 'boolean') {
      return uaData.mobile;
    }
  }
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
};

export function AnalyticsBatchTracker(props: { enabled?: boolean }) {
  const { enabled = true } = props;

  const startAtRef = useRef<Date>(new Date());
  const activeDurationMsRef = useRef(0);
  const visibleDurationMsRef = useRef(0);
  const hadComposeActivityRef = useRef(false);
  const hadReadActivityRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      console.log(
        '%c Analytics batch tracking is disabled. Skipping send.',
        'color: red; font-size: 12px;',
      );
      return;
    }
    const isDocumentVisible = () => document.visibilityState === 'visible';
    const isDocumentActive = () => isDocumentVisible() && document.hasFocus();

    const markRead = () => {
      hadReadActivityRef.current = true;
    };

    const markCompose = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      const tagName = target.tagName;
      const isEditor =
        target.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT';
      if (isEditor || event.type === 'submit') {
        hadComposeActivityRef.current = true;
        hadReadActivityRef.current = true;
      }
    };

    const sendBatch = async () => {
      const now = new Date();
      const payload: AnalyticsBatchPayload = {
        clientBatchId: generateBatchId(),
        activeDurationMs: activeDurationMsRef.current,
        visibleDurationMs: visibleDurationMsRef.current,
        isMobile: detectMobile(),
        hadComposeActivity: hadComposeActivityRef.current,
        hadReadActivity: hadReadActivityRef.current,
        batchStartAt: startAtRef.current.toISOString(),
        batchEndAt: now.toISOString(),
      };

      const hasMeaningfulData =
        payload.activeDurationMs > 0 ||
        payload.visibleDurationMs > 0 ||
        payload.hadReadActivity ||
        payload.hadComposeActivity;

      if (!hasMeaningfulData) {
        startAtRef.current = now;
        return;
      }

      try {
        await fetch(`${apiBaseUrl}/api/analytics/visit-batch`, {
          method: 'POST',
          credentials: 'include',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // Оптимальная аналитика: игнорируйте сбои в работе сети.
        console.log('Failed to send analytics batch', payload);
      } finally {
        startAtRef.current = now;
        activeDurationMsRef.current = 0;
        visibleDurationMsRef.current = 0;
        hadComposeActivityRef.current = false;
        hadReadActivityRef.current = false;
      }
    };

    const tickId = window.setInterval(() => {
      if (isDocumentVisible()) {
        visibleDurationMsRef.current += TICK_MS;
      }
      if (isDocumentActive()) {
        activeDurationMsRef.current += TICK_MS;
      }
    }, TICK_MS);

    const flushId = window.setInterval(() => {
      void sendBatch();
    }, FLUSH_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void sendBatch();
      }
    };

    window.addEventListener('scroll', markRead, { passive: true });
    window.addEventListener('mousemove', markRead, { passive: true });
    window.addEventListener('pointerdown', markRead, { passive: true });
    window.addEventListener('touchstart', markRead, { passive: true });
    window.addEventListener('keydown', markRead);
    window.addEventListener('input', markCompose, true);
    window.addEventListener('change', markCompose, true);
    window.addEventListener('submit', markCompose, true);
    const handlePageHide = () => {
      void sendBatch();
    };
    const handleBeforeUnload = () => {
      void sendBatch();
    };
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(tickId);
      window.clearInterval(flushId);
      window.removeEventListener('scroll', markRead);
      window.removeEventListener('mousemove', markRead);
      window.removeEventListener('pointerdown', markRead);
      window.removeEventListener('touchstart', markRead);
      window.removeEventListener('keydown', markRead);
      window.removeEventListener('input', markCompose, true);
      window.removeEventListener('change', markCompose, true);
      window.removeEventListener('submit', markCompose, true);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      void sendBatch();
    };
  }, [enabled]);

  return null;
}
