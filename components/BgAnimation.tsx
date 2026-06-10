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
    <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-[#0b0914] p-3 flex items-center justify-center max-w-lg w-full">
      <div 
        className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center w-full aspect-[4/3]"
        style={isFinished ? {
          backgroundColor: '#0F0C1B',
          backgroundImage: 'linear-gradient(45deg, #1C192E 25%, transparent 25%, transparent 75%, #1C192E 75%, #1C192E), linear-gradient(45deg, #1C192E 25%, transparent 25%, transparent 75%, #1C192E 75%, #1C192E)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        } : undefined}
      >
        {/* Mode A: Infinite Scanning Loop (Waiting for API response) */}
        {!tempResultUrl && (
          <div className="relative w-full h-full">
            <img
              src={originalUrl}
              alt="Scanning original"
              className="w-full h-full object-cover opacity-90 filter brightness-90 contrast-105"
            />
            {/* Matrix grid & scanner tint overlay */}
            <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay pointer-events-none" />
            {/* Glowing Laser Scan Bar */}
            <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#6366f1,0_0_24px_#6366f1] animate-laser-scan z-20" />
          </div>
        )}

        {/* Mode B: Wipe Reveal Transition (API complete, animation running) */}
        {tempResultUrl && isRevealing && (
          <div className="relative w-full h-full">
            {/* Checkerboard Background (revealed underneath) */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: '#0F0C1B',
                backgroundImage: 'linear-gradient(45deg, #1C192E 25%, transparent 25%, transparent 75%, #1C192E 75%, #1C192E), linear-gradient(45deg, #1C192E 25%, transparent 25%, transparent 75%, #1C192E 75%, #1C192E)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            />

            {/* Transparent Result Image (Clipped from bottom up) */}
            <img
              src={tempResultUrl}
              alt="Processed Preview"
              className="absolute inset-0 z-10 w-full h-full object-cover transition-all duration-75"
              style={{ clipPath: `inset(0 0 ${100 - revealProgress}% 0)` }}
            />

            {/* Original Image (Clipped from top down) */}
            <div 
              className="absolute inset-0 z-20 w-full h-full"
              style={{ clipPath: `inset(${revealProgress}% 0 0 0)` }}
            >
              <img
                src={originalUrl}
                alt="Original Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Laser Wipe Bar */}
            <div 
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#6366f1,0_0_30px_#6366f1] z-30 transition-all duration-75"
              style={{ top: `${revealProgress}%` }}
            />
          </div>
        )}

        {/* Mode C: Static Result (Sweep finished, show clean PNG) */}
        {isFinished && (
          <img
            src={resultUrl}
            alt="Background Removed Result"
            className="w-full h-full object-contain p-4 relative z-10 animate-fade-up"
          />
        )}
      </div>
    </div>
  );
}
