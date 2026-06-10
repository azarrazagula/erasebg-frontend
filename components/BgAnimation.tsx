"use client";

import React from "react";

interface BgAnimationProps {
  originalUrl: string;
  tempResultUrl: string | null;
  resultUrl: string | null;
  isRevealing: boolean;
  revealProgress: number;
}

export default function BgAnimation({
  originalUrl,
  tempResultUrl,
  resultUrl,
  isRevealing,
  revealProgress,
}: BgAnimationProps): JSX.Element {
  const isFinished = resultUrl && !isRevealing;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-[#0b0914] p-3 flex items-center justify-center max-w-full">
      <div 
        className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[45vh] max-w-full"
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
            {/* Matrix grid & scanner tint overlay */}
            <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay pointer-events-none" />
            {/* Glowing Laser Scan Bar */}
            <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#6366f1,0_0_24px_#6366f1] animate-laser-scan z-20" />
          </div>
        )}

        {/* Mode B: Wipe Reveal Transition (API complete, animation running) */}
        {tempResultUrl && isRevealing && (
          <div className="relative inline-block max-w-full max-h-full">
            {/* Checkerboard Background (revealed underneath) */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: '#ffffff',
                backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
              }}
            />

            {/* Base Image Layer to determine layout size (prevent stretching) */}
            <img
              src={originalUrl}
              alt="Original Layout Base"
              className="max-h-[45vh] max-w-full object-contain block opacity-0 pointer-events-none select-none"
            />

            {/* Transparent Result Image (Clipped from bottom up) */}
            <img
              src={tempResultUrl}
              alt="Processed Preview"
              className="absolute inset-0 z-10 w-full h-full object-contain block select-none pointer-events-none transition-all duration-75"
              style={{ clipPath: `inset(0 0 ${100 - revealProgress}% 0)` }}
            />

            {/* Original Image (Clipped from top down) */}
            <img
              src={originalUrl}
              alt="Original Preview"
              className="absolute inset-0 z-20 w-full h-full object-contain block select-none pointer-events-none"
              style={{ clipPath: `inset(${revealProgress}% 0 0 0)` }}
            />

            {/* Laser Wipe Bar */}
            <div 
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#6366f1,0_0_30px_#6366f1] z-30 transition-all duration-75"
              style={{ top: `${revealProgress}%` }}
            />
          </div>
        )}

        {/* Mode C: Static Result (Sweep finished, show clean PNG) */}
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
