"use client";

import React, { useState, useEffect } from "react";
import DropZone from "@/components/DropZone";
import ImagePreview from "@/components/ImagePreview";
import DownloadBtn from "@/components/DownloadBtn";
import { removeBg } from "@/lib/api";

type LoadingStep = 0 | 1 | 2 | 3;

export default function Home(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        const next = (prev + 1) as LoadingStep;
        return next > 3 ? (0 as LoadingStep) : next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileSelect = async (file: File): Promise<void> => {
    setSelectedFile(file);
    setError(null);

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    setIsLoading(true);
    setLoadingStep(0);
    setResultBlob(null);

    try {
      const blob = await removeBg(file);
      setResultBlob(blob);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove background";
      setError(errorMessage);
      setResultBlob(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (): void => {
    setSelectedFile(null);
    setOriginalUrl(null);
    setResultBlob(null);
    setError(null);
    setLoadingStep(0);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1 flex flex-col ${originalUrl ? 'justify-center' : ''}`}>
        {/* Header - Only show if no image selected */}
        {!originalUrl && (
          <header className="mb-12 md:mb-16 animate-fade-up">
            <div className="flex justify-center mb-6">
              <div className="inline-block px-4 py-2 bg-white rounded-full shadow-soft">
                <span className="text-xs md:text-sm font-medium text-gray-600">
                  🚀 AI Powered · Free · Unlimited
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900">
              Remove Background Like Magic.
            </h1>
          </header>
        )}

        {/* Main Card - Contains Everything (Remove card styling if result is ready) */}
        <div className={`transition-all duration-500 w-full ${resultBlob ? '' : 'card-white p-8 md:p-12 mb-12 animate-fade-up-delay-2'}`}>
          {/* UPLOAD STATE - Show upload zone */}
          {!originalUrl && (
            <DropZone
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
              loadingStep={loadingStep}
              disabled={false}
            />
          )}

          {/* PREVIEW STATE - Show loading animation during processing */}
          {originalUrl && !resultBlob && (
            <div className="space-y-6 animate-fade-up flex flex-col items-center justify-center min-h-96">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Processing your image...
              </h2>

              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xs">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-coral-main rounded-full animate-bounce-dots" />
                    <div className="w-3 h-3 bg-coral-main rounded-full animate-bounce-dots-delay-1" />
                    <div className="w-3 h-3 bg-coral-main rounded-full animate-bounce-dots-delay-2" />
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-coral animate-progress-fill" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RESULT STATE - Show only processed image */}
          {resultBlob && (
            <div className="space-y-8 animate-fade-up flex flex-col items-center justify-center w-full">
              <div className="w-full flex justify-center">
                <div 
                  className="relative rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200/60 shadow-xl"
                  style={{
                    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYBCweAB/nwBCgKDBwzQJ4yMowB+jxgF99r31wAAAABJRU5ErkJggg==")',
                    backgroundRepeat: 'repeat',
                  }}
                >
                  <img
                    src={URL.createObjectURL(resultBlob)}
                    alt="Processed Result"
                    className="max-w-full max-h-[70vh] object-contain block"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md pt-4">
                <div className="w-full sm:w-auto flex-1">
                  <DownloadBtn resultBlob={resultBlob} />
                </div>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 border border-gray-200 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Image
                </button>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-up">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Features Row - Only show if no image selected */}
        {!originalUrl && (
          <div
            className={`grid grid-cols-1 md:grid-cols-4 gap-6 transition-all duration-500 ${
              resultBlob
                ? "opacity-50 scale-95"
                : "opacity-100 scale-100 animate-fade-up-delay-3"
            }`}
          >
            {[
              {
                title: "Instant AI",
                desc: "Powered by advanced machine learning",
                icon: "🤖",
              },
              {
                title: "HD Output",
                desc: "Crystal clear results, every time",
                icon: "📸",
              },
              {
                title: "Unlimited",
                desc: "Process unlimited images for free",
                icon: "♾️",
              },
              {
                title: "Private",
                desc: "100% secure, nothing is stored",
                icon: "🔐",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-white card-white-hover p-6 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
