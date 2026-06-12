import { CoreConfig } from "@/cores/Core";

/**
 * Executes a network call to the background removal microservice.
 * Packages the target image file into a multipart/form-data payload, registers an AbortSignal,
 * and parses raw blob responses or detailed error payloads.
 * 
 * @param {File} file - The uploaded image file from the dropzone.
 * @param {AbortSignal} [signal] - Optional signal to abort the active HTTP request.
 * @returns {Promise<Blob>} A promise resolving to the transparent PNG output file blob.
 * @throws {Error} If the server returns an error code, empty response, or connection fails.
 */
export async function removeBg(file: File, signal?: AbortSignal): Promise<Blob> {
  const apiUrl = CoreConfig.api.baseUrl;

  // Validate API endpoint base URL configuration setup
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  // Create multipart form payload matching backend schema expectations
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      `${apiUrl}${CoreConfig.api.endpoints.removeBg}`,
      {
        method: "POST",
        body: formData,
        signal,
      },
    );

    // Handle non-200 HTTP response codes
    if (!response.ok) {
      let errorMessage = `Failed to remove background: ${response.status}`;

      try {
        // Attempt parsing JSON detail message from FastAPI backend validation error response schema
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        try {
          // Fallback to text parsing if JSON decoding fails
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        } catch {
          // Use default error string if both text and json parser checks fail
        }
      }

      throw new Error(errorMessage);
    }

    // Capture response as raw binary Blob containing output file
    const blob = await response.blob();

    // Verify response is not empty
    if (blob.size === 0) {
      throw new Error("Received empty response from server");
    }

    return blob;
  } catch (error) {
    // Gracefully propagate abort errors or customize unexpected errors
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while removing background");
  }
}
