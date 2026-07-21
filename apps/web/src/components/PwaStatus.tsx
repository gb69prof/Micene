import { useRegisterSW } from 'virtual:pwa-register/react';
import { useTranslation } from 'react-i18next';
import { useConnectivity } from '@/services/useConnectivity';

export function PwaStatus() {
  const { t } = useTranslation();
  const online = useConnectivity();
  const { needRefresh: [needRefresh], offlineReady: [offlineReady], updateServiceWorker } = useRegisterSW({});

  return (
    <div className="pwa-status" aria-live="polite">
      <span className={`connection-dot ${online ? 'is-online' : 'is-offline'}`} aria-hidden="true" />
      <span>{online ? t('online') : t('offline')}{offlineReady ? ' · shell pronta' : ''}</span>
      {needRefresh && <button onClick={() => void updateServiceWorker(true)}>{t('updateNow')}</button>}
    </div>
  );
}
