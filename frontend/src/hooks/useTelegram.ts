import { useEffect, useState } from 'react';

// Declaration to avoid TypeScript errors for window.Telegram
declare global {
  interface Window {
    Telegram: any;
  }
}

export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;
  const [user, setUser] = useState<{ id: number; first_name: string; username?: string } | null>(null);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
  }, [tg]);

  const close = () => {
    tg?.close();
  };

  return {
    tg,
    user,
    userId: user?.id?.toString(),
    queryId: tg?.initDataUnsafe?.query_id,
    close,
  };
};
