"use client";

import React from "react";

/**
 * Props expected by the DownloadBtn component.
 */
interface DownloadBtnProps {
  /** The processed PNG binary Blob object */
  resultBlob: Blob;
}

/**
 * DownloadBtn Component
 * 
 * Provides an action button to save the background-removed PNG image file.
 * Simulates client-side click downloads by creating a virtual anchor element,
 * appending it temporarily, routing it to a created Blob object URL, and cleaning up references.
 */
export default function DownloadBtn({
  resultBlob,
}: DownloadBtnProps): JSX.Element {
  /**
   * Instantiates the download pipeline using programmatic click sequence tricks.
   */
  const downloadPNG = (): void => {
    // Generate a temporary browser URL referencing the binary Blob data structure
    const url = URL.createObjectURL(resultBlob);
    
    // Create an offline mock anchor tag element
    const link = document.createElement("a");
    link.href = url;
    link.download = "removed-bg.png"; // Specify the client-side download filename
    
    // Append tag to document body to enable click actions inside firefox/safari constraints
    document.body.appendChild(link);
    link.click();
    
    // Clean up DOM node and revoke object URL to prevent resource memory leaks
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4 justify-center">
      <button onClick={downloadPNG} className="btn-coral btn-coral-hover">
        Download PNG
      </button>
    </div>
  );
}
