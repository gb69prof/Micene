import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: string | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State { return { error: error.message }; }
  componentDidCatch(error: Error, info: ErrorInfo): void { console.error('Errore applicativo locale', error, info.componentStack); }

  render(): ReactNode {
    if (this.state.error) return (
      <main className="fatal-error" role="alert">
        <p className="eyebrow">RECUPERO CONTROLLATO</p>
        <h1>La shell è rimasta disponibile.</h1>
        <p>Un componente non è stato caricato: {this.state.error}</p>
        <button className="primary-button" onClick={() => window.location.assign('/fallback')}>Apri il fallback 2D</button>
      </main>
    );
    return this.props.children;
  }
}
