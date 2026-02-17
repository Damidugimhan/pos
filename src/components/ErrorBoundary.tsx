import { Component, type ErrorInfo, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI crash', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-6">Something went wrong. Reload the screen.</div>;
    }
    return this.props.children;
  }
}
