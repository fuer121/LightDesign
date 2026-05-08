'use client';

import { useEffect } from 'react';

export function ErrorCatcher() {
  useEffect(() => {
    function handler(event: PromiseRejectionEvent) {
      console.error(
        '[unhandledRejection]',
        'reason:', event.reason,
        'message:', event.reason?.message,
        'stack:', event.reason?.stack,
        'type:', typeof event.reason,
        'constructor:', event.reason?.constructor?.name,
      );
    }

    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);

  return null;
}
