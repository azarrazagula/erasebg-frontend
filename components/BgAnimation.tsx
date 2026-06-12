"use client";

import React from "react";

/**
 * Props expected by the BgAnimation component.
 */
interface BgAnimationProps {
  /** The local Object URL of the original uploaded image file */
  originalUrl: string;
  /** The local Object URL of the processed image, staged during wipe reveal */
  tempResultUrl: string | null;
  /** The local Object URL of the finalized transparent PNG result */
  resultUrl: string | null;
  /** Whether the wipe transition reveal animation is currently active */
  isRevealing: boolean;
  /** Current wipe animation progress percentage (0 to 100) */
  revealProgress: number;
}

/**
 * BgAnimation Component
 * 
 * Renders a unified visual viewport container for the image. Toggles between three modes:
 * - **Mode A (Scanning)**: Loops a glowing horizontal laser bar over the original image while waiting for the API.
 * - **Mode B (Wipe Reveal)**: Sweeps a laser line down, clipping the original image away to reveal the transparent image on a checkerboard.
 * - **Mode C (Finished Result)**: Renders a static transparent PNG on a checkerboard backdrop.
 * 
 * Styled to fit a light-theme layout immediately from upload onward.
 */
export default function BgAnimation({
  originalUrl,
  tempResultUrl,
  resultUrl,
  isRevealing,
  revealProgress,
}: BgAnimationProps): JSX.Element {
  // Flag indicating if the background removal process and transitions are fully complete
  const isFinished = resultUrl && !isRevealing;

  return (
    <div className="relative rounded-3xl overflow-hidden border transition-all duration-500 shadow-2xl p-3 flex items-center justify-center max-w-full bg-white border-slate-200/80 shadow-slate-200/40">
      {/* Inner viewport container frame */}
      <div 
        className="relative rounded-2xl overflow-hidden flex items-center justify-center max-h-[45vh] max-w-full transition-colors duration-500 bg-slate-100"
        // Show checkerboard pattern when background removal is completed
        style={isFinished ? {
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        } : undefined}
      >
        {/* Mode A: Infinite Scanning Loop (Waiting for API response) */}
        {!tempResultUrl && (
          <div className="relative inline-block max-w-full max-h-full">
            <img
              src={originalUrl}
              alt="Scanning original"
              className="max-h-[45vh] max-w-full object-contain block opacity-90 filter brightness-90 contrast-105"
            />
            {/* Soft grid overlay tint to simulate diagnostic computer scanning */}
            <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay pointer-events-none" />
            {/* Glowing Laser Scan Bar - loops continuously from top to bottom */}
            <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#6366f1,0_0_24px_#6366f1] animate-laser-scan z-20" />
          </div>
        )}

        {/* Mode B: Wipe Reveal Transition (API request completed, animation running) */}
        {tempResultUrl && isRevealing && (
          <div className="relative inline-block max-w-full max-h-full">
            {/* Checkerboard Background (revealed under the transparent foreground) */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: '#ffffff',
                backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
              }}
            />

            {/* Invisible Base Image Layer to establish layout dimensions without stretching */}
            <img
              src={originalUrl}
              alt="Original Layout Base"
              className="max-h-[45vh] max-w-full object-contain block opacity-0 pointer-events-none select-none"
            />

            {/* Transparent Result Image Layer (revealed by clipping from top-down as progress goes from 0 to 100) */}
            <img
              src={tempResultUrl}
              alt="Processed Preview"
              className="absolute inset-0 z-10 w-full h-full object-contain block select-none pointer-events-none transition-all duration-75"
              style={{ clipPath: `inset(0 0 ${100 - revealProgress}% 0)` }}
            />

            {/* Original Image Layer (hidden by clipping away as progress goes from 0 to 100) */}
            <img
              src={originalUrl}
              alt="Original Preview"
              className="absolute inset-0 z-20 w-full h-full object-contain block select-none pointer-events-none"
              style={{ clipPath: `inset(${revealProgress}% 0 0 0)` }}
            />

            {/* Laser Wipe Bar - moves down matching the clip path percentages */}
            <div 
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#6366f1,0_0_30px_#6366f1] z-30 transition-all duration-75"
              style={{ top: `${revealProgress}%` }}
            />
          </div>
        )}

        {/* Mode C: Static Result (Sweep animation finished, show final clean PNG) */}
        {isFinished && (
          <div className="relative inline-block max-w-full max-h-full">
            <img
              src={resultUrl}
              alt="Background Removed Result"
              className="max-h-[45vh] max-w-full object-contain block relative z-10 animate-fade-up"
            />
          </div>
        )}
      </div>
    </div>
  );
}
