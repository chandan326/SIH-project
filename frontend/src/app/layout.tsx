import "./globals.css";
import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { BhoomiAssistantWidget } from "@/components/assistant/bhoomi-assistant";
import { ThemeProvider } from "@/context/theme-context";
import { LanguageProvider } from "@/context/language-context";

export const metadata = {
  title: "BhoomiVerify — Land Verification & Parcel Intelligence Platform Prototype",
  description: "Mapping Land. Connecting Records. Improving Transparency. An interactive demonstration platform for land parcel visualization and record consistency intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          async
        ></script>
      </head>
      <body className="flex flex-col min-h-screen">
        <LanguageProvider>
          <ThemeProvider>
            <DisclaimerBanner />
            <Navbar />
            <main className="flex-1">{children}</main>
            <BhoomiAssistantWidget />
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
