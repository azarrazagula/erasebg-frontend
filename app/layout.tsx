import type { Metadata } from "next";
import { Inter, Cabin } from "next/font/google";
import "./globals.css";

// Configure Display Font (Inter is loaded as a proxy configuration for Clash Display font styling)
const clashDisplay = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Configure Body Typography Font (Cabin Grotesk mappings)
const cabinGrotesk = Cabin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/**
 * SEO Best-Practices Metadata Configuration
 * 
 * Defines indexing details, page title summaries, search keywords, author attributions,
 * and OpenGraph objects to allow seamless rich card formatting when sharing links.
 */
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

/**
 * RootLayout Component
 * 
 * The default layout shell surrounding page routes. Injects html metadata properties,
 * binds display/body CSS font variables, preconnects Unsplash domains, and loads SVG favicon tags.
 */
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
        {/* Preconnect to Unsplash CDN to speed up example image fetch connections */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Dynamic inline SVG favicon (coral colored scissors emoji) */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%23FF6B4A'>✂</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
