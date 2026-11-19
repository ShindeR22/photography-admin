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
  title: "Pimpri-Chinchwad Photography Association | Admin",
  description:
    "Admin dashboard for Pune Camera Photography Association members, workshops, registrations and accounts.",
  openGraph: {
    title: "Pimpri-Chinchwad Photography Association",
    description:
      "Photography workshops, community and member registrations in Pimpri-Chinchwad.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pimpri-Chinchwad Photography Association",
    description:
      "Photography workshops, community and member registrations in Pimpri-Chinchwad.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
