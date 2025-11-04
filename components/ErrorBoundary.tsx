// components/ErrorBoundary.tsx
"use client";
import React, { Component, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 bg-cornflowerblue-400/10 backdrop-blur-sm border border-cornflowerblue-100/20 rounded-lg max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-cornflowerblue-100">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-300 mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-cornflowerblue-400 text-white rounded-lg hover:bg-cornflowerblue-300 transition-colors"
            >
              Reload Page
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback component for data fetching errors
 */
export function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error | string;
  onRetry?: () => void;
}) {
  const message = typeof error === "string" ? error : error.message;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
        <h3 className="text-lg font-semibold text-red-400 mb-2">
          Failed to Load Data
        </h3>
        <p className="text-gray-300 text-sm mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-cornflowerblue-400 text-white rounded hover:bg-cornflowerblue-300 transition-colors text-sm"
          >
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
}
