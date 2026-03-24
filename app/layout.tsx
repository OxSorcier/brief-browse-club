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
  title: "Browse Club — Pre-call Brief",
  description: "Quelques questions avant notre appel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} h-full`}
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-full bg-white text-[#0A0A0A] antialiased">
        {children}
      </body>
    </html>
  );
}
