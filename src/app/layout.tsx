import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingBackground from "@/components/background/floating-background";
import { AuthProvider } from "@/contexts/auth-context";

import { ReactLenis } from "@/utils/lenis";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swede Wedding",
  description: "A beautiful wedding website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactLenis root>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <AuthProvider>
            <FloatingBackground />
            {children}
          </AuthProvider>
        </body>
      </ReactLenis>
    </html>
  );
}
