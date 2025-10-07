import type { Metadata } from "next";
import "./globals.css";
import FloatingBackground from "@/components/background/floating-background";
import { AuthProvider } from "@/contexts/auth-context";
import { ReactLenis } from "@/utils/lenis";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <body>
          <AuthProvider>
            <FloatingBackground />
            {children}
          </AuthProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </ReactLenis>
    </html>
  );
}
