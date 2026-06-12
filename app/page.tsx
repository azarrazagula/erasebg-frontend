"use client";

import React from "react";
// Import background removal business logic custom hook
import { useBackgroundRemover } from "@/hooks/useBackgroundRemover";
// Import layout components
import HomeSection from "@/components/HomeSection";
import UploadImage from "@/components/UploadImage";
import ExampleCards from "@/components/ExampleCards";
import ErrorBanner from "@/components/ErrorBanner";

export default function Home(): JSX.Element {
  // Destructure reactive states and handler events from custom business hook
  const {
    originalUrl,
    tempResultUrl,
    resultUrl,
    isRevealing,
    revealProgress,
    loadingStep,
    resultBlob,
    isLoading,
    error,
    isFinished,
    handleFileSelect,
    handleExampleSelect,
    handleReset,
  } = useBackgroundRemover();

  return (
    <div
      // Dynamic dark/light background based on background removal status
      // Transitions to light theme (#F8FAFC) as soon as an image is selected/uploaded (originalUrl is truthy)
      // Defaults to a premium dark-violet theme (#030014) on the home/landing phase.
      className={`min-h-screen relative overflow-hidden flex flex-col transition-colors duration-500 ${
        originalUrl ? "bg-[#F8FAFC] text-slate-900" : "bg-[#030014] text-slate-100"
      }`}
    >
      {/* Ambient background glows - adjusted dynamic opacity for light/dark theme contrast */}
      {/* Dark theme glows are only visible when no image has been selected/uploaded */}
      {!originalUrl ? (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-fuchsia-500/5 blur-[100px] pointer-events-none z-0" />
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none z-0" />
        </>
      )}

      {/* Main Landmark semantic container for accessibility compliance */}
      <main
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1 flex flex-col relative z-10 ${
          originalUrl ? "justify-center" : ""
        }`}
      >
        {/* Main Hero & Upload Area - rendered when no image is loaded */}
        {!originalUrl && (
          <HomeSection
            handleFileSelect={handleFileSelect}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        )}

        {/* Image Preview & Result Area - rendered when an image has been uploaded or chosen */}
        {originalUrl && (
          <UploadImage
            originalUrl={originalUrl}
            tempResultUrl={tempResultUrl}
            resultUrl={resultUrl}
            isRevealing={isRevealing}
            revealProgress={revealProgress}
            loadingStep={loadingStep}
            resultBlob={resultBlob}
            handleReset={handleReset}
            isFinished={isFinished}
            error={error}
          />
        )}

        {/* Error Notification banner */}
        {error && <ErrorBanner error={error} />}

        {/* Preset Sample Gallery - hidden when processing/displaying an image */}
        {!originalUrl && (
          <ExampleCards
            handleExampleSelect={handleExampleSelect}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
