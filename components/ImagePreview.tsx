"use client";

import React from "react";

interface ImagePreviewProps {
  originalUrl: string | null;
  resultBlob: Blob | null;
}

export default function ImagePreview({
  originalUrl,
  resultBlob,
}: ImagePreviewProps): JSX.Element | null {
  const resultUrl = resultBlob ? URL.createObjectURL(resultBlob) : null;

  if (!originalUrl && !resultBlob) {
    return null;
  }

  return (
    <div className="w-full animate-fade-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {originalUrl && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Original
            </h3>
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={originalUrl}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {resultBlob && resultUrl && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Result
            </h3>
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={resultUrl}
                alt="Result"
                className="w-full h-full object-contain bg-red-500 "
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
