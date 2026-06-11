"use client";

import React from "react";

interface ErrorBannerProps {
  error: string;
}

export default function ErrorBanner({ error }: ErrorBannerProps): JSX.Element {
  return (
    <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl animate-fade-up mt-6 relative z-10">
      <p className="text-red-400 text-sm text-center font-medium">{error}</p>
    </div>
  );
}
