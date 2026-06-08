/**
 * Core Configuration
 * Handles environment-specific API URLs for development and production
 */

const getApiUrl = (): string => {
  // Check if we have an explicit environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Development environment (localhost)
  if (
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost")
  ) {
    return "http://localhost:8000";
  }

  // Production environment (Vercel or hosted)
  return "https://api.erasebg.com"; // Replace with your actual API endpoint
};

export const API_BASE_URL = getApiUrl();

/**
 * Configuration object for the application
 */
export const CoreConfig = {
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      removeBg: "/remove-bg",
    },
  },
  app: {
    name: "EraseBG",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  },
};

export default CoreConfig;
