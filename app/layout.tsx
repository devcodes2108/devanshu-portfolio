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
  title: "Devanshu Singh | Portfolio",
  description: "Portfolio of Devanshu Singh - product-minded developer and design-led builder.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Devanshu Singh | Portfolio",
    description: "Product-minded full-stack developer and design-led builder.",
    url: "/",
    siteName: "Devanshu Singh",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devanshu Singh | Portfolio",
    description: "Product-minded full-stack developer and design-led builder.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f7f7f3] text-[#121212]">{children}</body>
    </html>
  );
}
