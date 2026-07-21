import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ErrorBoundary } from './ErrorBoundary';
import { HomePage } from './HomePage';
import { FallbackPage } from './FallbackPage';

const ExplorerPage = lazy(() => import('@/features/explorer/ExplorerPage'));

export function App() {
  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<main className="route-loading" aria-live="polite">Caricamento controllato del motore 3D…</main>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/fallback" element={<FallbackPage />} />
            <Route path="*" element={<Navigate to="/fallback" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  );
}
