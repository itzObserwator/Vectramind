import type { Metadata } from "next";
import "./globals.css";
import "./inner-pages.css";
import "./experience.css";
import "./post-hero.css";
import "./capabilities.css";
import "./ecosystem.css";
import "./platforms.css";
import "./global-reach.css";
import "./landing-palette.css";
export const metadata: Metadata = {
  title: "Vectramind — Transforming Human Experiences",
  description:
    "Adapt & evolve with Vectramind. AI-powered customer engagement, unified patient experiences, and seamlessly connected systems. Discover Synapse and Firstpass.",
  openGraph: {
    title: "Vectramind — Adapt & Evolve",
    description: "Intelligence. Innovation. Technology. With you in mind.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
