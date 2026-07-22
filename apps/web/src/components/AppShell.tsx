import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PwaStatus } from './PwaStatus';
import { useAppStore } from '@/state/appStore';

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const immersive = pathname.endsWith('/explorer');
  const { t, i18n } = useTranslation();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const changeLanguage = (next: 'it' | 'en') => { setLanguage(next); void i18n.changeLanguage(next); };

  return (
    <div className={`app-shell${immersive ? ' immersive-shell' : ''}`}>
      <a className="skip-link" href="#main-content">Vai al contenuto</a>
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">M</span>
          <div><strong>{t('appName')}</strong><span>{t('prototype')}</span></div>
        </div>
        <nav aria-label="Navigazione principale">
          <NavLink to="/" end>{t('home')}</NavLink>
          <NavLink to="/explorer">{t('explorer')}</NavLink>
          <NavLink to="/fallback">{t('fallback')}</NavLink>
        </nav>
        <div className="topbar-actions">
          <PwaStatus />
          <label className="language-control">Lingua
            <select value={language} onChange={(event) => changeLanguage(event.target.value as 'it' | 'en')}>
              <option value="it">IT</option><option value="en">EN</option>
            </select>
          </label>
        </div>
      </header>
      <div id="main-content">{children}</div>
      <footer className="global-watermark" aria-label={t('warning')}>{t('warning')}</footer>
    </div>
  );
}
