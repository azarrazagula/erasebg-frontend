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
  const [sliderPos, setSliderPos] = useState(50);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleExampleSelect = async (url: string, filename: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setOriginalUrl(url);
    setResultBlob(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    setSliderPos(50);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch example image");
      }
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
      setSelectedFile(file);

      const result = await removeBg(file);
      setResultBlob(result);
      setResultUrl(URL.createObjectURL(result));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process example image";
      setError(errorMessage);
      setResultBlob(null);
      setOriginalUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  const handleFileSelect = async (file: File): Promise<void> => {
    setSelectedFile(file);
    setError(null);

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    setIsLoading(true);
    setLoadingStep(0);
    setResultBlob(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    setSliderPos(50); // Reset slider

    try {
      const blob = await removeBg(file);
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
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
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    setError(null);
    setLoadingStep(0);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 relative overflow-hidden flex flex-col">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-fuchsia-500/5 blur-[100px] pointer-events-none z-0" />

      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1 flex flex-col relative z-10 ${originalUrl ? 'justify-center' : ''}`}>
        
        {/* Main Content Redesign */}
        {!originalUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full py-8 md:py-16 relative z-10">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-left flex flex-col items-start animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs md:text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                AI background remover
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                BACKGROUND <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  REMOVER
                </span>
              </h1>

              {/* Paragraph */}
              <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
                Remove backgrounds from your photos automatically in seconds. Our advanced AI detects the subject instantly and removes the background with pixel-perfect precision—entirely free.
              </p>
            </div>

            {/* Right Upload Column */}
            <div className="lg:col-span-5 w-full animate-fade-up-delay-1">
              <DropZone
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                loadingStep={loadingStep}
                disabled={false}
              />
            </div>
          </div>
        )}

        {/* PROCESSING & PREVIEW STATE */}
        {originalUrl && !resultBlob && (
          <div className="space-y-6 animate-fade-up flex flex-col items-center justify-center min-h-[50vh] w-full relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              Processing your image...
            </h2>

            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-5 w-full max-w-sm">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce-dots" />
                  <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce-dots-delay-1" />
                  <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce-dots-delay-2" />
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress-fill" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULT STATE - Show slider with both images */}
        {resultBlob && originalUrl && (
          <div className="space-y-8 animate-fade-up flex flex-col items-center justify-center w-full relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Background Removed Successfully!
            </h2>
            
            <div className="w-full flex justify-center">
              {/* Interactive Slider Container */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl max-w-full inline-block group">
                
                {/* Theme-matching Checkerboard Background (Bottom Layer) */}
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundColor: '#0F0C1B',
                    backgroundImage: 'linear-gradient(45deg, #1C192E 25%, transparent 25%, transparent 75%, #1C192E 75%, #1C192E), linear-gradient(45deg, #1C192E 25%, transparent 25%, transparent 75%, #1C192E 75%, #1C192E)',
                    backgroundSize: '24px 24px',
                    backgroundPosition: '0 0, 12px 12px'
                  }}
                ></div>

                {/* Processed Result Image (Middle Layer) */}
                <img
                  src={resultUrl || ""}
                  alt="Processed Result"
                  className="relative z-10 max-w-full max-h-[60vh] object-contain block select-none pointer-events-none"
                />

                {/* Original Image (Top Layer with Clip-Path) */}
                <div 
                  className="absolute inset-0 z-20 w-full h-full"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                  <img
                    src={originalUrl}
                    alt="Original Image"
                    className="w-full h-full object-contain block select-none pointer-events-none"
                  />
                </div>

                {/* Slider Control Handle */}
                <div 
                  className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 text-slate-700 transition-transform group-hover:scale-110">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 9l-3 3 3 3m8-6l3 3-3 3"></path>
                    </svg>
                  </div>
                </div>

                {/* Invisible Range Input for Interaction */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 z-40 w-full h-full opacity-0 cursor-ew-resize"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md pt-4">
              <div className="w-full sm:w-auto flex-1">
                <DownloadBtn resultBlob={resultBlob} />
              </div>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto flex-1 px-6 py-3 rounded-full font-semibold text-slate-300 bg-slate-900/60 hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 border border-slate-800 shadow-sm"
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
          <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl animate-fade-up mt-6 relative z-10">
            <p className="text-red-400 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        {/* Examples Section */}
        {!originalUrl && (
          <div className="mt-16 md:mt-24 text-center relative z-10 animate-fade-up-delay-2 w-full">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              No image? Try one of these examples:
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              Click on an image below to see our AI background remover in action instantly.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                {
                  label: "Product",
                  url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
                  filename: "shoe-example.jpg"
                },
                {
                  label: "Portrait",
                  url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                  filename: "portrait-example.jpg"
                },
                {
                  label: "Animal",
                  url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80",
                  filename: "cat-example.jpg"
                },
                {
                  label: "Car",
                  url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80",
                  filename: "car-example.jpg"
                }
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleSelect(example.url, example.filename)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-800/80 hover:border-indigo-500/40 bg-slate-950/40 hover:bg-slate-900/60 p-2 transition-all duration-300 hover:-translate-y-1 focus:outline-none"
                  disabled={isLoading}
                >
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={example.url}
                      alt={example.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Glassmorphic overlay */}
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-indigo-950/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wide shadow-lg">
                        Test AI
                      </span>
                    </div>
                  </div>
                  <div className="py-2.5 px-1.5 flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {example.label}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 group-hover:bg-indigo-950 group-hover:border-indigo-900/50 group-hover:text-indigo-300 transition-colors">
                      Free
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
