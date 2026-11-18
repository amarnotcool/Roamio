import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Instrument_Serif, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roamio — Luxury AI Travel Planner",
  description: "Wander smarter, not harder. Verified itineraries, luxury curation, and budget precision.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${instrumentSerif.variable} ${plusJakartaSans.variable} ${spaceMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f5f5] font-sans selection:bg-[#d4a574]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
