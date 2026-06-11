"use client";

import React from "react";
import BgAnimation from "./BgAnimation";
import DownloadBtn from "./DownloadBtn";
import { LoadingStep } from "@/types";

interface UploadImageProps {
  originalUrl: string;
  tempResultUrl: string | null;
  resultUrl: string | null;
  isRevealing: boolean;
  revealProgress: number;
  loadingStep: LoadingStep;
  resultBlob: Blob | null;
  handleReset: () => void;
  isFinished: boolean;
}

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
}: UploadImageProps): JSX.Element {
  return (
    <div className="space-y-8 animate-fade-up flex flex-col items-center justify-center min-h-[60vh] w-full relative z-10 py-6">
      {/* Header Text */}
      <div className="text-center space-y-2.5 max-w-md">
        <h2 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${
          isFinished ? "text-slate-900" : "text-white"
        }`}>
          {!tempResultUrl && "Analyzing Image..."}
          {tempResultUrl && isRevealing && "Revealing Result..."}
          {resultUrl && !isRevealing && "Background Removed!"}
        </h2>
        <p className={`text-sm transition-colors duration-500 ${
          isFinished ? "text-slate-600" : "text-slate-400"
        }`}>
          {!tempResultUrl && "Detecting borders, details, and separating foreground..."}
          {tempResultUrl && isRevealing && "Applying final transparent mask..."}
          {resultUrl && !isRevealing && "Your transparent PNG is ready for download."}
        </p>
      </div>

      {/* The Unified Card */}
      <BgAnimation
        originalUrl={originalUrl}
        tempResultUrl={tempResultUrl}
        resultUrl={resultUrl}
        isRevealing={isRevealing}
        revealProgress={revealProgress}
      />

      {/* Bottom Actions Row */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm z-20">
        {/* While Processing Status */}
        {!tempResultUrl && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-center text-sm font-semibold tracking-wide uppercase text-indigo-400 animate-pulse">
              {loadingStep === 0 && "Analyzing Subject Elements..."}
              {loadingStep === 1 && "Isolating Edge Boundaries..."}
              {loadingStep === 2 && "Executing Neural Network..."}
              {loadingStep === 3 && "Upscaling Transparency Mask..."}
            </p>
            <div className="flex gap-2.5 justify-center">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce-dots" />
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce-dots-delay-1" />
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce-dots-delay-2" />
            </div>
          </div>
        )}

        {/* Reveal Progress Percentage */}
        {tempResultUrl && isRevealing && (
          <span className="text-indigo-400 text-sm font-semibold animate-pulse">
            Applying mask: {Math.round(revealProgress)}%
          </span>
        )}

        {/* Result Complete Action Buttons */}
        {resultUrl && !isRevealing && (
          <div className="flex gap-4 w-full justify-center items-center animate-fade-up">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              New Image
            </button>
            
            {resultBlob && (
              <DownloadBtn resultBlob={resultBlob} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
