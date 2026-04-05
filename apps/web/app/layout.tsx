import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RscBoundaryProvider } from "rsc-boundary";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
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
    default: "RSC Boundary",
    template: "%s · RSC Boundary",
  },
  description:
    "Visualize React Server Component boundaries in Next.js (App Router).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <RscBoundaryProvider enabled>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </RscBoundaryProvider>
      </body>
    </html>
  );
}
