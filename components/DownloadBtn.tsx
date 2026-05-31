"use client";

import React, { useState } from "react";

interface DownloadBtnProps {
  resultBlob: Blob;
}

export default function DownloadBtn({
  resultBlob,
}: DownloadBtnProps): JSX.Element {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPNG = (): void => {
    const url = URL.createObjectURL(resultBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "removed-bg.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadJPG = async (): Promise<void> => {
    try {
      setIsDownloading(true);

      const imageUrl = URL.createObjectURL(resultBlob);
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = imageUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      URL.revokeObjectURL(imageUrl);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Failed to convert canvas to blob");
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "removed-bg.jpg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsDownloading(false);
        },
        "image/jpeg",
        0.95,
      );
    } catch (error) {
      console.error("Error downloading JPG:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={downloadPNG}
        disabled={isDownloading}
        className="btn-coral btn-coral-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? "Downloading..." : "Download PNG"}
      </button>
      <button
        onClick={downloadJPG}
        disabled={isDownloading}
        className="btn-coral btn-coral-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? "Downloading..." : "Download JPG"}
      </button>
    </div>
  );
}
