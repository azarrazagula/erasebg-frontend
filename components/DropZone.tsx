"use client";

import React, { useRef } from "react";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  loadingStep: number;
  disabled: boolean;
}

const LOADING_STEPS = [
  "Analyzing image...",
  "Detecting edges...",
  "Removing background...",
  "Finalizing result...",
];

export default function DropZone({
  onFileSelect,
  isLoading,
  loadingStep,
  disabled,
}: DropZoneProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = (): void => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative w-full px-8 py-14 md:py-16 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer backdrop-blur-md ${
          isDragging
            ? "border-indigo-400 bg-indigo-950/20"
            : "border-slate-700/60 bg-[#12101e]/40 hover:border-indigo-500/50 hover:bg-[#12101e]/60"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {!isLoading ? (
          <div className="flex flex-col items-center justify-center gap-5 text-center">
            {/* SVG Cloud Upload Icon */}
            <div className="p-4 rounded-2xl bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Drag and drop your image
              </h3>
              <p className="text-slate-400 text-sm">
                or click to browse from device
              </p>
            </div>

            <button className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 border border-indigo-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
            </button>

            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, WEBP (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-full max-w-xs space-y-5">
              <div className="flex gap-2.5 justify-center">
                <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce-dots" />
                <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce-dots-delay-1" />
                <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce-dots-delay-2" />
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress-fill" />
              </div>

              <p className="text-center text-sm font-medium text-indigo-200 min-h-6">
                {LOADING_STEPS[Math.min(loadingStep, LOADING_STEPS.length - 1)]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
