import type { Metadata } from "next";
import { Inter, Cabin } from "next/font/google";
import "./globals.css";

const clashDisplay = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const cabinGrotesk = Cabin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EraseBG - AI Background Remover",
  description:
    "Remove background from images instantly with AI. Free, unlimited, and private.",
  keywords: "background removal, AI, image editor, remove background",
  authors: [{ name: "EraseBG" }],
  openGraph: {
    title: "EraseBG - AI Background Remover",
    description: "Remove background from images instantly with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${cabinGrotesk.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%23FF6B4A'>✂</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
