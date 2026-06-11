"use client";

import React, { useState, useEffect, useRef } from "react";
import { removeBg } from "@/lib/api";
import { LoadingStep } from "@/types";

export function useBackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up any ongoing request on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error("Failed to fetch example image");
      }
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
      setSelectedFile(file);

      const result = await removeBg(file, controller.signal);
      const objectUrl = URL.createObjectURL(result);
      
      // Stage the result and start the satisfying single-direction wipe reveal
      setTempResultBlob(result);
      setTempResultUrl(objectUrl);
      setRevealProgress(0);
      setIsRevealing(true);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const blob = await removeBg(file, controller.signal);
      const objectUrl = URL.createObjectURL(blob);
      
      // Stage the result and start the satisfying single-direction wipe reveal
      setTempResultBlob(blob);
      setTempResultUrl(objectUrl);
      setRevealProgress(0);
      setIsRevealing(true);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove background";
      setError(errorMessage);
      setResultBlob(null);
      setIsLoading(false);
    }
  };

  const handleReset = (): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

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

  return {
    selectedFile,
    originalUrl,
    resultBlob,
    isLoading,
    error,
    loadingStep,
    sliderPos,
    resultUrl,
    isRevealing,
    revealProgress,
    tempResultUrl,
    tempResultBlob,
    isFinished,
    handleExampleSelect,
    handleFileSelect,
    handleReset,
    setSliderPos,
  };
}
