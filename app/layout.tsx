import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

const googleSans = localFont({
  src: [
    { path: '../Google_Sans/static/GoogleSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../Google_Sans/static/GoogleSans-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../Google_Sans/static/GoogleSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../Google_Sans/static/GoogleSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../Google_Sans/static/GoogleSans-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../Google_Sans/static/GoogleSans-BoldItalic.ttf', weight: '700', style: 'italic' },
  ],
  variable: '--font-google-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Innonsh Salonza | Smart Salon Management Platform",
  description:
    "Innonsh Salonza is the intelligent platform that runs your entire salon: appointments, billing, inventory, staff, marketing, and analytics from one unified dashboard.",
  keywords: [
    "salon software",
    "salon management",
    "salon POS",
    "appointment booking",
    "salon CRM",
    "salon analytics",
    "salon inventory",
  ],
  icons: {
    icon: "/logo.svg", // Favicon path
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  metadataBase: new URL("https://trimsetgo.in"), // Assuming domain remains same or update if needed

  alternates: {
    canonical: "https://trimsetgo.in",
  },

  openGraph: {
    title: "Innonsh Salonza | Smart Salon Management Platform",
    description:
      "Automate appointments, billing, inventory, staff, and customer engagement from one intelligent dashboard.",
    url: "https://trimsetgo.in",
    siteName: "Innonsh Salonza",
    images: [
      {
        url: "/logo.svg",
        width: 600,
        height: 600,
        alt: "Innonsh Salonza Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Innonsh Salonza | Smart Salon Management Platform",
    description:
      "An all-in-one booking & queue automation system for salons, spas & beauty parlours.",
    images: ["/logo.png"],
  },

  applicationName: "Innonsh Salonza",
};

// Viewport configuration (Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#6C4EFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${googleSans.className} antialiased`}>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
