import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrimSetGo - Smart Salon Management System",
  description:
    "TrimSetGo is a modern salon, spa & beauty parlour management system — automated bookings, real-time queue, multi-service appointments, staff management & complete business insights.",
  keywords: [
    "salon management",
    "beauty parlour software",
    "spa management",
    "salon booking app",
    "queue management system",
    "barber shop software",
    "salon CRM",
    "salon POS",
  ],
  icons: {
    icon: "/logo.svg", // Favicon path
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  metadataBase: new URL("https://trimsetgo.in"), // Replace with your actual domain

  alternates: {
    canonical: "https://trimsetgo.in",
  },

  openGraph: {
    title: "TrimSetGo - Smart Salon Management System",
    description:
      "Automate your salon with TrimSetGo: bookings, queue system, multi-service appointments, staff management & growth insights.",
    url: "https://trimsetgo.in",
    siteName: "TrimSetGo",
    images: [
      {
        url: "/logo.svg",
        width: 600,
        height: 600,
        alt: "TrimSetGo Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TrimSetGo - Smart Salon Management System",
    description:
      "An all-in-one booking & queue automation system for salons, spas & beauty parlours.",
    images: ["/logo.png"],
  },

  themeColor: "#6C4EFF",
  applicationName: "TrimSetGo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
