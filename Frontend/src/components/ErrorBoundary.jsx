import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-serif text-[#1C1917] mb-3">Something Went Wrong</h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              We encountered an unexpected issue while loading this page. Please try refreshing or returning to our shop.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1C1917] text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-md"
              >
                <RefreshCcw className="w-4 h-4" /> Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-[#1C1917] text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
              >
                <Home className="w-4 h-4" /> Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
