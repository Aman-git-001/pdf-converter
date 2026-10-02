import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PDF Converter – Convert PDF, Word, Excel & PPT Online",
    template: "%s | PDF Converter",
  },

  description:
    "Convert PDF, Word, Excel, PowerPoint, images and other documents online. Fast, simple and mobile-friendly file conversion.",

  applicationName: "PDF Converter",

  keywords: [
    "PDF converter",
    "online PDF converter",
    "PDF to Word",
    "PDF to JPG",
    "PDF to PNG",
    "Word to PDF",
    "Excel to PDF",
    "PowerPoint to PDF",
    "image to PDF",
    "document converter",
  ],

  authors: [{ name: "PDF Converter" }],

  creator: "PDF Converter",
  publisher: "PDF Converter",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    title: "PDF Converter – Convert Files Online",
    description:
      "Convert PDF, Word, Excel, PowerPoint and images online with a simple, fast and mobile-friendly converter.",
    siteName: "PDF Converter",
  },

  twitter: {
    card: "summary",
    title: "PDF Converter – Convert Files Online",
    description:
      "Convert PDF, Word, Excel, PowerPoint and images online.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}