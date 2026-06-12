"use client";

import React, { useState, useEffect, useRef } from "react";
import { removeBg } from "@/lib/api";
import { LoadingStep } from "@/types";

/**
 * useBackgroundRemover Custom Hook
 * 
 * Central business logic controller for the background remover workspace.
 * Manages file uploads, example selection downloads, network cancel handles,
 * stage steps interval ticks, sweep animation timers, and object URL memory cleanups.
 */
export function useBackgroundRemover() {
  // --- Core States ---
  /** Active File selected by the user for processing */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  /** Local Object URL representation of the original image, used as preview src */
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  /** Finalized output Blob returned by the background removal backend API */
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  /** Loading flag to toggle spinners and processing overlays */
  const [isLoading, setIsLoading] = useState(false);
  /** Error message string, null if no operations failed */
  const [error, setError] = useState<string | null>(null);
  /** Step representing the active processing label description (0 to 3) */
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(0);
  /** Position percentage of comparison preview slider handle (0 to 100) */
  const [sliderPos, setSliderPos] = useState(50);
  /** Local Object URL of the completed transparent result, used as display src */
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  /** AbortController reference to cancel active fetch connection requests on reset or page unmount */
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- Request Abort Cleanup Effect ---
  // Ensure any ongoing connection fetches are aborted when component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // --- Scan Reveal & Wipe Animation States ---
  /** Flag representing if the wipe sweep transition animation is currently running */
  const [isRevealing, setIsRevealing] = useState(false);
  /** The progress percentage of the wipe scan laser sweep (ranges 0 to 100) */
  const [revealProgress, setRevealProgress] = useState(0);
  /** Temporary Object URL staged while the wipe sweep reveal animation runs */
  const [tempResultUrl, setTempResultUrl] = useState<string | null>(null);
  /** Temporary Blob staged while the wipe sweep reveal animation runs */
  const [tempResultBlob, setTempResultBlob] = useState<Blob | null>(null);

  // --- Wipe Sweep Reveal Driver Effect ---
  // Loops frame-by-frame on a 16ms interval (roughly 60 FPS) to increment sweep progress
  // from 0% to 100%, then commits staged files into permanent display URL states.
  useEffect(() => {
    if (!isRevealing || !tempResultBlob || !tempResultUrl) return;

    // Initialize progress to top (0%)
    setRevealProgress(0);
    const step = 2.5; // Amount to sweep down each frame (controls speed)
    const intervalTime = 16; // Standard monitor frame time reference (16.6ms)
    
    const timer = setInterval(() => {
      setRevealProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Commit temporary states into permanent display slots on sweep end
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

  /**
   * Action handler triggered when clicking a preset gallery example card.
   * Downloads target remote assets, formats into file mocks, submits to API, and triggers the wipe.
   * 
   * @param {string} url - Unsplash target image location url.
   * @param {string} filename - Desired fallback label output.
   */
  const handleExampleSelect = async (url: string, filename: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setOriginalUrl(url);
    setResultBlob(null);
    
    // Revoke previous URLs to avoid memory leaks
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

    // Cancel any current requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Fetch target example image file into memory
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error("Failed to fetch example image");
      }
      const blob = await response.blob();
      // Compile into standard JavaScript File representation
      const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
      setSelectedFile(file);

      // Call API helper to run background subtraction models
      const result = await removeBg(file, controller.signal);
      const objectUrl = URL.createObjectURL(result);
      
      // Stage results in temporary state slots and trigger wipe transition sweep
      setTempResultBlob(result);
      setTempResultUrl(objectUrl);
      setRevealProgress(0);
      setIsRevealing(true);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // Ignore cancellations
      }
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process example image";
      setError(errorMessage);
      setResultBlob(null);
      setOriginalUrl(null);
      setIsLoading(false);
    }
  };

  // --- Processing Steps Interval Loop ---
  // Ticks every 600ms while loading to step through user feedback labels.
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

  // --- Dynamic Object URL Garbage Collector Cleanup Effect ---
  // Cleans references on component destruction to prevent browser memory leaks.
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

  /**
   * Action handler triggered on file select or file drop.
   * Generates display sources, hits model endpoints, and launches reveal sweep.
   * 
   * @param {File} file - Selected image file metadata container.
   */
  const handleFileSelect = async (file: File): Promise<void> => {
    setSelectedFile(file);
    setError(null);

    // Create a local display source object URL representation of original image
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
    setSliderPos(50); // Reset comparison handle

    // Cancel existing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Execute background subtraction request
      const blob = await removeBg(file, controller.signal);
      const objectUrl = URL.createObjectURL(blob);
      
      // Stage results in temporary state slots and trigger wipe transition sweep
      setTempResultBlob(blob);
      setTempResultUrl(objectUrl);
      setRevealProgress(0);
      setIsRevealing(true);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // Ignore cancellations
      }
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove background";
      setError(errorMessage);
      setResultBlob(null);
      setIsLoading(false);
    }
  };

  /**
   * Action handler triggered when clicking "New Image" or back buttons.
   * Resets hook variables to default empty states and aborts active network calls.
   */
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

  // Helper boolean representing background subtraction completion
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
