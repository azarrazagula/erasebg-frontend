"use client";

import React from "react";
import Image from "next/image";
import { ExampleImage } from "@/types";

/**
 * Static sample preset images array.
 * Sourced from Unsplash with size/quality query optimization parameters.
 */
const EXAMPLES: ExampleImage[] = [
  {
    label: "Product",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    filename: "shoe-example.jpg",
  },
  {
    label: "Portrait",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    filename: "portrait-example.jpg",
  },
  {
    label: "Animal",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
    filename: "cat-example.jpg",
  },
  {
    label: "Car",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    filename: "car-example.jpg",
  },
];

/**
 * Props expected by the ExampleCards component.
 */
interface ExampleCardsProps {
  /** Callback triggered when clicking on a preset test image */
  handleExampleSelect: (url: string, filename: string) => Promise<void>;
  /** Disables buttons while API processes images */
  isLoading: boolean;
}

/**
 * ExampleCards Component
 * 
 * Renders a row of sample image cards below the upload dropzone. Clicking a card
 * automatically fetches the corresponding remote resource and submits it to the background remover API.
 * Uses Next.js dynamic image optimization for responsive thumbnail rendering.
 */
export default function ExampleCards({
  handleExampleSelect,
  isLoading,
}: ExampleCardsProps): JSX.Element {
  return (
    <div className="mt-16 md:mt-24 text-center relative z-10 animate-fade-up-delay-2 w-full">
      {/* Visual Section Header */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
        No image? Try one of these examples:
      </h2>
      <p className="text-slate-400 text-sm mb-8">
        Click on an image below to see our AI background remover in action instantly.
      </p>
      
      {/* 4-Column Grid layout of preset button cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {EXAMPLES.map((example, index) => (
          <button
            key={index}
            onClick={() => handleExampleSelect(example.url, example.filename)}
            className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-800/80 hover:border-indigo-500/40 bg-slate-950/40 hover:bg-slate-900/60 p-2 transition-all duration-300 hover:-translate-y-1 focus:outline-none"
            disabled={isLoading}
          >
            {/* Aspect Ratio Container for responsive layouts */}
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900">
              <Image
                src={example.url}
                alt={example.label}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Glassmorphic hover visual overlay button */}
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-indigo-950/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wide shadow-lg">
                  Test AI
                </span>
              </div>
            </div>
            {/* Label and Badge Metadata Footer */}
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
  );
}
