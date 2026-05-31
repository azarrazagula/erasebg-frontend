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
        className={`relative w-full px-8 py-12 md:py-16 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-coral-dark bg-orange-50"
            : "border-gray-300 hover:border-coral-main"
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
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="text-5xl md:text-6xl animate-bob">📸</div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                Drag and drop your image
              </h3>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                or click to browse
              </p>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex gap-2 justify-center">
                <div className="w-3 h-3 bg-coral-main rounded-full animate-bounce-dots" />
                <div className="w-3 h-3 bg-coral-main rounded-full animate-bounce-dots-delay-1" />
                <div className="w-3 h-3 bg-coral-main rounded-full animate-bounce-dots-delay-2" />
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-coral animate-progress-fill" />
              </div>

              <p className="text-center text-sm font-medium text-gray-700 min-h-6">
                {LOADING_STEPS[Math.min(loadingStep, LOADING_STEPS.length - 1)]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
