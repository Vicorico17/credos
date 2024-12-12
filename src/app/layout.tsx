import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rental Income Calculator",
  description: "Calculate your rental property income and expenses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <MicrosoftClarity />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
