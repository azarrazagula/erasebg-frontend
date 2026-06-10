"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DropZone from "@/components/DropZone";
import ImagePreview from "@/components/ImagePreview";
import DownloadBtn from "@/components/DownloadBtn";
import BgAnimation from "@/components/BgAnimation";
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

  // Transition & Scan Reveal States
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [tempResultUrl, setTempResultUrl] = useState<string | null>(null);
  const [tempResultBlob, setTempResultBlob] = useState<Blob | null>(null);

  // Reveal wipe animation driver
  useEffect(() => {
    if (!isRevealing || !tempResultBlob || !tempResultUrl) return;

    setRevealProgress(0);
    const step = 2.5; // Controls the sweep speed (faster/smoother)
    const intervalTime = 16; // Roughly 60fps (16ms per frame)
    const timer = setInterval(() => {
      setRevealProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Finalize state: trigger completed view
          setResultBlob(tempResultBlob);
          setResultUrl(tempResultUrl);
          setIsRevealing(false);
          setIsLoading(false);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isRevealing, tempResultBlob, tempResultUrl]);

  const handleExampleSelect = async (url: string, filename: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setOriginalUrl(url);
    setResultBlob(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    if (tempResultUrl) {
      URL.revokeObjectURL(tempResultUrl);
      setTempResultUrl(null);
    }
    setTempResultBlob(null);
    setIsRevealing(false);
    setRevealProgress(0);
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
      const objectUrl = URL.createObjectURL(result);
      
      // Stage the result and start the satisfying single-direction wipe reveal
      setTempResultBlob(result);
      setTempResultUrl(objectUrl);
      setRevealProgress(0);
      setIsRevealing(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process example image";
      setError(errorMessage);
      setResultBlob(null);
      setOriginalUrl(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading || isRevealing) return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        const next = (prev + 1) as LoadingStep;
        return next > 3 ? (0 as LoadingStep) : next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isLoading, isRevealing]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      if (tempResultUrl) {
        URL.revokeObjectURL(tempResultUrl);
      }
    };
  }, [resultUrl, tempResultUrl]);

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
    if (tempResultUrl) {
      URL.revokeObjectURL(tempResultUrl);
      setTempResultUrl(null);
    }
    setTempResultBlob(null);
    setIsRevealing(false);
    setRevealProgress(0);
    setSliderPos(50); // Reset slider

    try {
      const blob = await removeBg(file);
      const objectUrl = URL.createObjectURL(blob);
      
      // Stage the result and start the satisfying single-direction wipe reveal
      setTempResultBlob(blob);
      setTempResultUrl(objectUrl);
      setRevealProgress(0);
      setIsRevealing(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove background";
      setError(errorMessage);
      setResultBlob(null);
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
    if (tempResultUrl) {
      URL.revokeObjectURL(tempResultUrl);
      setTempResultUrl(null);
    }
    setTempResultBlob(null);
    setIsRevealing(false);
    setRevealProgress(0);
    setError(null);
    setLoadingStep(0);
  };

  const isFinished = !!resultUrl && !isRevealing;

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col transition-colors duration-500 ${
      isFinished ? "bg-[#F8FAFC] text-slate-900" : "bg-[#030014] text-slate-100"
    }`}>
      {/* Ambient background glows */}
      {!isFinished ? (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-fuchsia-500/5 blur-[100px] pointer-events-none z-0" />
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none z-0" />
        </>
      )}

      <main className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1 flex flex-col relative z-10 ${originalUrl ? 'justify-center' : ''}`}>
        
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

        {/* IMAGE PREVIEW, SCANNING & RESULT CONTAINER */}
        {originalUrl && (
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
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-60" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-30" />
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
                  url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                  filename: "shoe-example.jpg"
                },
                {
                  label: "Portrait",
                  url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
                  filename: "portrait-example.jpg"
                },
                {
                  label: "Animal",
                  url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
                  filename: "cat-example.jpg"
                },
                {
                  label: "Car",
                  url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
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
                    <Image
                      src={example.url}
                      alt={example.label}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Glassmorphic overlay */}
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-indigo-950/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
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
      </main>
    </div>
  );
}
