"use client";

import React from "react";
import DropZone from "./DropZone";
import { LoadingStep } from "@/types";

/**
 * Props expected by the HomeSection component.
 */
interface HomeSectionProps {
  /** Callback triggered when a new file selection event occurs */
  handleFileSelect: (file: File) => void;
  /** Whether the network API call is active */
  isLoading: boolean;
  /** The current active index representing the step loader label */
  loadingStep: LoadingStep;
}

/**
 * HomeSection Component
 * 
 * Renders the hero column and file landing section. Integrates:
 * - A left-side branding block: AI badge pill, large semantic page heading (h1), subtext paragraph description.
 * - A right-side drag-and-drop workspace container.
 */
export default function HomeSection({
  handleFileSelect,
  isLoading,
  loadingStep,
}: HomeSectionProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full py-8 md:py-16 relative z-10">
      {/* Left Column - Hero branding content */}
      <div className="lg:col-span-7 space-y-6 text-left flex flex-col items-start animate-fade-up">
        {/* Animated AI badge pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs md:text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI background remover
        </div>

        {/* Semantic H1 Main Page Title with customized gradient text wrap */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
          BACKGROUND <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            REMOVER
          </span>
        </h1>

        {/* Explanatory introduction paragraph */}
        <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
          Remove backgrounds from your photos automatically in seconds. Our advanced AI detects the subject instantly and removes the background with pixel-perfect precision—entirely free.
        </p>
      </div>

      {/* Right Column - File upload DropZone wrapper */}
      <div className="lg:col-span-5 w-full animate-fade-up-delay-1">
        <DropZone
          onFileSelect={handleFileSelect}
          isLoading={isLoading}
          loadingStep={loadingStep}
          disabled={false}
        />
      </div>
    </div>
  );
}
