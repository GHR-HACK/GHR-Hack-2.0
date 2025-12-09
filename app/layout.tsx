import type { Metadata } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GSAPSetup from "../components/GSAPSetup";
import OptimizedSnakeCursor from "@/components/ui/custom-cursor";
import NavigationBar from "../components/NavigationBar";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GHR Hack 2.0 - Code the Unexplored",
  description: "GHR-HACK, a groundbreaking hackathon by GHRCEM JALGAON, redefines creativity and technology. Join us in the pursuit of innovation, transcending traditional hackathons.",
  keywords: ["hackathon", "GHR", "GHRCEM", "Jalgaon", "technology", "innovation", "coding"],
  authors: [{ name: "GHR Hack Team" }],
  openGraph: {
    title: "GHR Hack 2.0 - Code the Unexplored",
    description: "28-hour offline hackathon at G H Raisoni College of Engineering and Management, Jalgaon",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} overflow-hidden`}
      >
        <GSAPSetup />
        <OptimizedSnakeCursor />
        <NavigationBar />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
