import type { Metadata } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono, Red_Hat_Display } from "next/font/google";
import "./globals.css";
import GSAPSetup from "../components/GSAPSetup";
import NavigationBar from "../components/NavigationBar";
import { Providers } from "../lib/providers";
import { Toaster } from "sonner";

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

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GHR Hack 2.0 - Code to Career | 30-Hour Hackathon at GHRCEM Jalgaon",
  description: "Join GHR Hack 2.0, a 30-hour offline hackathon at G H Raisoni College of Engineering and Management, Jalgaon. Code to Career - Transform your coding skills into professional opportunities. Registration open for students and innovators.",
  keywords: [
    "GHR Hack 2.0",
    "Code to Career",
    "30 hour hackathon",
    "GHRCEM Jalgaon hackathon",
    "offline hackathon India",
    "G H Raisoni College hackathon",
    "coding competition Jalgaon",
    "Maharashtra hackathon 2025",
    "student hackathon",
    "tech event Jalgaon",
    "hackathon registration",
    "innovation challenge",
    "programming competition",
    "career development hackathon",
    "GHRCEM tech event"
  ],
  authors: [{ name: "GHR Hack 2.0 Team" }],
  creator: "G H Raisoni College of Engineering and Management, Jalgaon",
  publisher: "GHRCEM Jalgaon",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "GHR Hack 2.0 - Code to Career | 30-Hour Hackathon",
    description: "Join the ultimate 30-hour offline hackathon at G H Raisoni College of Engineering and Management, Jalgaon. Transform your coding skills into career opportunities.",
    type: "website",
    locale: "en_IN",
    siteName: "GHR Hack 2.0",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GHR Hack 2.0 - Code to Career Hackathon",
      },
    ],
  }, 
  alternates: {
    canonical: "https://www.ghrhack.tech/", 
  },
  category: "Technology", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />       
        <link rel="icon" href="/logo.png" sizes="any" />              
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "GHR Hack 2.0 - Code to Career",
              "description": "30-hour offline hackathon at G H Raisoni College of Engineering and Management, Jalgaon",          
              "location": {
                "@type": "Place",
                "name": "G H Raisoni College of Engineering and Management",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Jalgaon",
                  "addressLocality": "Jalgaon",
                  "addressRegion": "Maharashtra",
                  "addressCountry": "IN"
                }
              },
              "organizer": {
                "@type": "Organization",
                "name": "G H Raisoni College of Engineering and Management, Jalgaon",
                "url": "https://www.ghrhack.tech/"
              },             
            })
          }}
        />
      </head>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} ${redHatDisplay.variable} overflow-hidden`}
        suppressHydrationWarning
      >
         <GSAPSetup />
         <NavigationBar />
         <Providers>
           <div id="smooth-wrapper">
            <div id="smooth-content">
              {children}
            </div>
          </div>
         </Providers>
         <Toaster position="top-right" richColors />
       
        {/* {children} */}
      </body>
    </html>
  );
}