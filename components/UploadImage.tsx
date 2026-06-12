"use client";

import React from "react";
import BgAnimation from "./BgAnimation";
import DownloadBtn from "./DownloadBtn";
import { LoadingStep } from "@/types";

/**
 * Props expected by the UploadImage component.
 */
interface UploadImageProps {
  /** The local Object URL of the original uploaded image file */
  originalUrl: string;
  /** The local Object URL of the processed image, staged before the swipe reveal animation completes */
  tempResultUrl: string | null;
  /** The local Object URL of the finalized transparent PNG result */
  resultUrl: string | null;
  /** Whether the wipe transition reveal animation is currently active */
  isRevealing: boolean;
  /** Current wipe animation progress percentage (ranges from 0 to 100) */
  revealProgress: number;
  /** The current active step in the background processing chain */
  loadingStep: LoadingStep;
  /** The raw Blob object containing the processed PNG result data */
  resultBlob: Blob | null;
  /** Callback function to reset state and return to the main upload dropzone screen */
  handleReset: () => void;
  /** Flag representing if the entire process has successfully finished and anim completed */
  isFinished: boolean;
  /** Error message string, if any step in the API execution failed */
  error: string | null;
}

/**
 * UploadImage Component
 * 
 * Renders the image processing preview workspace. Coordinates the status message headers,
 * the wipe sweep visualizer (BgAnimation), active status loaders, and action buttons.
 * Styled to fit a light theme background as soon as an image is loaded for processing.
 */
export default function UploadImage({
  originalUrl,
  tempResultUrl,
  resultUrl,
  isRevealing,
  revealProgress,
  loadingStep,
  resultBlob,
  handleReset,
  isFinished,
  error,
}: UploadImageProps): JSX.Element {
  // Show the back navigation button if background removal is complete, or if there is an error
  const showBackButton = isFinished || !!error;

  return (
    <div className="space-y-8 animate-fade-up flex flex-col items-center justify-center min-h-[60vh] w-full relative z-10 py-6">
      {/* Back Navigation Button - positioned top-left on desktop screens */}
      {showBackButton && (
        <button
          onClick={handleReset}
          className="self-start md:absolute md:top-6 md:left-0 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold border transition-all duration-300 active:scale-95 z-30 bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      )}

      {/* Header Status Text - Dark colored texts to maintain premium readability on light background */}
      <div className="text-center space-y-2.5 max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 text-slate-900">
          {!tempResultUrl && "Analyzing Image..."}
          {tempResultUrl && isRevealing && "Revealing Result..."}
          {resultUrl && !isRevealing && "Background Removed!"}
        </h2>
        <p className="text-sm transition-colors duration-500 text-slate-600">
          {!tempResultUrl && "Detecting borders, details, and separating foreground..."}
          {tempResultUrl && isRevealing && "Applying final transparent mask..."}
          {resultUrl && !isRevealing && "Your transparent PNG is ready for download."}
        </p>
      </div>

      {/* The Unified Card visualizer (holds the scanning/reveal state layers) */}
      <BgAnimation
        originalUrl={originalUrl}
        tempResultUrl={tempResultUrl}
        resultUrl={resultUrl}
        isRevealing={isRevealing}
        revealProgress={revealProgress}
      />

      {/* Bottom Actions Row & Process Indicators */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm z-20">
        {/* While Processing Status Indicator */}
        {!tempResultUrl && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-center text-sm font-semibold tracking-wide uppercase text-indigo-600 animate-pulse">
              {loadingStep === 0 && "Analyzing Subject Elements..."}
              {loadingStep === 1 && "Isolating Edge Boundaries..."}
              {loadingStep === 2 && "Executing Neural Network..."}
              {loadingStep === 3 && "Upscaling Transparency Mask..."}
            </p>
            {/* Horizontal bouncing-dot loading status feedback */}
            <div className="flex gap-2.5 justify-center">
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce-dots" />
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce-dots-delay-1" />
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce-dots-delay-2" />
            </div>
          </div>
        )}

        {/* Reveal Progress Percentage indicator during wipe sweep */}
        {tempResultUrl && isRevealing && (
          <span className="text-indigo-600 text-sm font-semibold animate-pulse">
            Applying mask: {Math.round(revealProgress)}%
          </span>
        )}

        {/* Result Complete Action Buttons */}
        {resultUrl && !isRevealing && (
          <div className="flex gap-4 w-full justify-center items-center animate-fade-up">
            {/* New Image reset button */}
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              New Image
            </button>
            
            {/* Download PNG helper component */}
            {resultBlob && (
              <DownloadBtn resultBlob={resultBlob} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
