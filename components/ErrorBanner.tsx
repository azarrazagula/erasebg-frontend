"use client";

import React from "react";

/**
 * Props expected by the ErrorBanner component.
 */
interface ErrorBannerProps {
  /** Error message string description to render */
  error: string;
}

/**
 * ErrorBanner Component
 * 
 * Simple, accessible banner wrapper designed to display API network execution faults or 
 * file reading exceptions clearly. Styled with a warning color palette.
 */
export default function ErrorBanner({ error }: ErrorBannerProps): JSX.Element {
  return (
    <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl animate-fade-up mt-6 relative z-10">
      <p className="text-red-400 text-sm text-center font-medium">{error}</p>
    </div>
  );
}
