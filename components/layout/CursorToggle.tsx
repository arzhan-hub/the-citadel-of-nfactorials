'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/I18nProvider';

type CursorState = 'on' | 'off';

function readCursorState(): CursorState {
  if (typeof window === 'undefined') return 'on';
  const stored = window.localStorage.getItem('portalCursor');
  return stored === 'off' ? 'off' : 'on';
}

export function CursorToggle() {
  const { t } = useI18n();
  const [state, setState] = useState<CursorState>('on');

  useEffect(() => {
    setState(readCursorState());
  }, []);

  const toggle = () => {
    const next: CursorState = state === 'on' ? 'off' : 'on';
    setState(next);
    window.localStorage.setItem('portalCursor', next);
    window.dispatchEvent(new CustomEvent('portal-cursor-toggle'));
  };

  return (
    <Button variant="pill" onClick={toggle} className="px-4 py-2 text-xs sm:px-5 sm:text-sm">
      {state === 'on' ? t('cursor.on') : t('cursor.off')}
    </Button>
  );
}
