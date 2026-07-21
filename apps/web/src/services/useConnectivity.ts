import { useCallback, useEffect, useState } from 'react';

export function useConnectivity(): boolean {
  const [online, setOnline] = useState(navigator.onLine);
  const verify = useCallback(async () => {
    if (!navigator.onLine) { setOnline(false); return; }
    try {
      const response = await fetch(`/__network-probe__?t=${Date.now()}`, { cache: 'no-store' });
      setOnline(response.ok);
    } catch { setOnline(false); }
  }, []);

  useEffect(() => {
    const handleOffline = () => setOnline(false);
    const handleOnline = () => { void verify(); };
    window.addEventListener('online', handleOnline); window.addEventListener('offline', handleOffline);
    const initialTimer = window.setTimeout(() => void verify(), 0);
    const timer = window.setInterval(() => void verify(), 15_000);
    return () => {
      window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline);
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [verify]);
  return online;
}
