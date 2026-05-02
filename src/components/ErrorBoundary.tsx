import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Tiny Terra render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app error-state">
          <h2>Tiny Terra needs a quick restart 🌱</h2>
          <p>{this.state.message || 'Unexpected rendering issue.'}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </main>
      );
    }

    return this.props.children;
  }
}
