import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "My Portfolio",
  description: "Welcome to my professional portfolio showcasing my work and skills",
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
        <nav className="w-full flex justify-center py-6 bg-black text-white mb-8 border-b border-red-500">
          <ul className="flex gap-8 text-lg font-semibold">
            <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-red-500 transition-colors">About</Link></li>
            <li><Link href="/projects" className="hover:text-red-500 transition-colors">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-red-500 transition-colors">Contact Me</Link></li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
