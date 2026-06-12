import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Theme Configuration
 * 
 * Configures responsive utility classes, custom fonts, brand color definitions, and
 * rich interactive keyframe animations used across the EraseBG landing page components.
 */
const config: Config = {
  // Define source directories to scan for Tailwind utility classes
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Extended theme palette for brand specific styling
      colors: {
        cream: "#F5F0E8", // Legacy light theme cream color
        coral: {
          light: "#FFB347",
          main: "#FF8B6B",
          dark: "#FF6B4A",
        },
      },
      // Premium typography fonts loaded dynamically via next/font in layout
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Cabin Grotesk", "sans-serif"],
      },
      // Transition & custom visual animation controls
      animation: {
        // Sequenced grid card fade-ups
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-up-delay-1": "fadeUp 0.6s ease-out 0.1s forwards",
        "fade-up-delay-2": "fadeUp 0.6s ease-out 0.2s forwards",
        "fade-up-delay-3": "fadeUp 0.6s ease-out 0.3s forwards",
        "fade-up-delay-4": "fadeUp 0.6s ease-out 0.4s forwards",
        // Bouncing/Bobbing animation for visual indicators
        bob: "bob 2s ease-in-out infinite",
        // Multi-stage loading dot sequences
        "bounce-dots": "bounceDots 1.4s ease-in-out infinite",
        "bounce-dots-delay-1": "bounceDots 1.4s ease-in-out 0.2s infinite",
        "bounce-dots-delay-2": "bounceDots 1.4s ease-in-out 0.4s infinite",
        // Loading horizontal progress bar filling
        "progress-fill": "progressFill 2s ease-in-out infinite",
        // Micro-interaction hover lifts
        "lift-hover": "liftHover 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        // Laser scan looping effect
        "laser-scan": "laserScan 2.5s ease-in-out infinite",
      },
      // Custom keyframes representing core animation transitions
      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        bob: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        bounceDots: {
          "0%, 80%, 100%": {
            transform: "translateY(0)",
            opacity: "0.7",
          },
          "40%": {
            transform: "translateY(-10px)",
            opacity: "1",
          },
        },
        progressFill: {
          "0%": {
            width: "0%",
          },
          "50%": {
            width: "70%",
          },
          "100%": {
            width: "100%",
          },
        },
        liftHover: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-4px)",
          },
        },
        laserScan: {
          "0%, 100%": {
            top: "0%",
          },
          "50%": {
            top: "100%",
          },
        },
      },
      // Premium soft shadows for cards
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 8px 30px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "gradient-coral":
          "linear-gradient(135deg, #FF6B4A 0%, #FF8B6B 50%, #FFB347 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
