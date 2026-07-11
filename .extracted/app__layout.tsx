import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PortfolioHub — Build Your Portfolio",
  description: "Create a beautiful portfolio website with multiple layouts. Simple, fast, and free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#1e293b", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
          }}
        />
      </body>
    </html>
  );
}
