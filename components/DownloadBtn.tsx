"use client";

import React from "react";

interface DownloadBtnProps {
  resultBlob: Blob;
}

export default function DownloadBtn({
  resultBlob,
}: DownloadBtnProps): JSX.Element {
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

  return (
    <div className="flex gap-4 justify-center">
      <button onClick={downloadPNG} className="btn-coral btn-coral-hover">
        Download PNG
      </button>
    </div>
  );
}
