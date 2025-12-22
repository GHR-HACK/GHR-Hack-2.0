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
  title: "Raisoni Hackathon 2025 | GHR Hack 2.0 - Code to Career | GHRCEM Jalgaon",
  description: "Join Raisoni Hackathon - GHR Hack 2.0, a 30-hour offline hackathon at G H Raisoni College of Engineering and Management, Jalgaon. Code to Career - Transform your coding skills into professional opportunities. Registration open for students and innovators.",
  keywords: [
    "Raisoni hackathon",
    "Raisoni hackathon 2025",
    "GHR hackathon",
    "G H Raisoni hackathon",
    "Raisoni college hackathon",
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
    "GHRCEM tech event",
    "Raisoni tech event",
    "Jalgaon hackathon"
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
    title: "Raisoni Hackathon 2025 | GHR Hack 2.0 - Code to Career",
    description: "Join Raisoni Hackathon - the ultimate 30-hour offline hackathon at G H Raisoni College of Engineering and Management, Jalgaon. Transform your coding skills into career opportunities.",
    type: "website",
    locale: "en_IN",
    siteName: "GHR Hack 2.0 - Raisoni Hackathon",
    url: "https://www.ghrhack.tech/",
    images: [
      {
        url: "https://www.ghrhack.tech/logo.png",
        width: 1200,
        height: 630,
        alt: "Raisoni Hackathon - GHR Hack 2.0 - Code to Career",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raisoni Hackathon 2025 | GHR Hack 2.0",
    description: "Join the ultimate 30-hour Raisoni Hackathon at GHRCEM Jalgaon. Register now!",
    images: ["https://www.ghrhack.tech/logo.png"],
  },
  alternates: {
    canonical: "https://www.ghrhack.tech/", 
  },
  category: "Technology",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/logo.png",
      },
    ],
  },
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