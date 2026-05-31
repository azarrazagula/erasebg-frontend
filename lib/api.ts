export async function removeBg(file: File): Promise<Blob> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${apiUrl}/remove-bg`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `Failed to remove background: ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        try {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        } catch {
          // Use default error message
        }
      }

      throw new Error(errorMessage);
    }

    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error("Received empty response from server");
    }

    return blob;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while removing background");
  }
}
