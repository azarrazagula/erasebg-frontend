"use client";

import React from "react";

/**
 * Props expected by the Footer component.
 */
interface FooterProps {
  /** Flag representing if the page is currently in light theme mode */
  isLightTheme: boolean;
}

/**
 * Footer Component
 *
 * Renders a premium, responsive 3-column footer that dynamically adapts its text,
 * borders, and link colors to match the active light or dark page theme.
 */
export default function Footer({ isLightTheme }: FooterProps): JSX.Element {
  return (
    <footer
      className={`w-full py-8 mt-auto border-t transition-colors duration-500 relative z-10 ${
        isLightTheme
          ? "border-slate-200/80 bg-white/20 backdrop-blur-sm text-slate-600"
          : "border-slate-800/40 bg-black/10 backdrop-blur-sm text-slate-400"
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Column 1: Brand Info */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-lg font-bold tracking-tight font-display text-indigo-500">
                EraseBG
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0.0
              </span>
            </div>
            <p className="text-xs max-w-xs leading-relaxed">
              Remove backgrounds from your images instantly with pixel-perfect
              AI precision. Free and private.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold">
            <a
              href="#features"
              onClick={(e) => e.preventDefault()}
              className={`transition-colors duration-300 ${
                isLightTheme ? "hover:text-indigo-600" : "hover:text-white"
              }`}>
              Features
            </a>
            <a
              href="#examples"
              onClick={(e) => e.preventDefault()}
              className={`transition-colors duration-300 ${
                isLightTheme ? "hover:text-indigo-600" : "hover:text-white"
              }`}>
              Examples
            </a>
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className={`transition-colors duration-300 ${
                isLightTheme ? "hover:text-indigo-600" : "hover:text-white"
              }`}>
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className={`transition-colors duration-300 ${
                isLightTheme ? "hover:text-indigo-600" : "hover:text-white"
              }`}>
              Terms of Use
            </a>
          </div>

          {/* Column 3: Credits & Copyright */}
          <div className="space-y-1.5 md:text-right text-xs">
            <a
              href="https://github.com/azarrazagula"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold text-[11px] uppercase tracking-wider transition-colors duration-300 block ${
                isLightTheme ? "text-slate-500 hover:text-indigo-600" : "text-slate-400 hover:text-white"
              }`}
            >
              Built with by AzarIbrahim
            </a>
            <p className="text-[11px] opacity-80">
              &copy; {new Date().getFullYear()} EraseBG. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
