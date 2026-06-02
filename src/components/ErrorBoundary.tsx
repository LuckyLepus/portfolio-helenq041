import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 rounded border border-red-500/30 p-4">
          <p className="text-red-400 text-sm font-mono text-center">Failed to load 3D Model</p>
          <p className="text-white/40 text-xs font-mono text-center mt-2">Check console & GitHub Release URL</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
