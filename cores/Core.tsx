/**
 * Core Configuration Setup
 * 
 * Manages environment-specific API endpoints to route background removal requests
 * dynamically to localhost during development or remote cloud gateways in production.
 */

/**
 * Resolves the absolute backend API URL based on environment checks.
 * Checks for user overrides (NEXT_PUBLIC_API_URL), development flags, or falls back to production endpoints.
 * 
 * @returns {string} The active backend API Base URL.
 */
const getApiUrl = (): string => {
  // Check if a custom server configuration variable is explicitly set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Detect local development mode or localhost loops
  if (
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost")
  ) {
    return "http://localhost:8000";
  }

  // Production fallback API endpoint running on Render cloud environment
  return "https://erasebg-backend.onrender.com";
};

// Export the resolved API Base URL
export const API_BASE_URL = getApiUrl();

/**
 * Application config object mappings.
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
