import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WatchlistProvider } from "@/components/providers/WatchlistProvider";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Flux Core",
  description: "Real-time crypto currency aggregator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WatchlistProvider>
          <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <div className="flex-1">
              {children}
            </div>
          </main>
        </WatchlistProvider>
      </body>
    </html>
  );
}
