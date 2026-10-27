import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { PageLoader } from "@/components/ui/PageLoader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aranyakjewellers.com'),
  title: "Aranyak Jewellers | Premium Gold & Diamond Jewellery in Tripura",
  description: "Discover exquisite gold, diamond, and silver jewellery at Aranyak Jewellers. Multiple stores across Tripura offering the finest craftsmanship and authentic jewellery.",
  keywords: ["Aranyak Jewellers", "Jewellery in Tripura", "Gold Jewellery", "Diamond Rings", "Silver Ornaments", "Bengali Jewellery", "Agartala Jewellery"],
  openGraph: {
    title: "Aranyak Jewellers | Premium Gold & Diamond Jewellery",
    description: "Legacy of Excellence Since 1995. Handcrafted masterpieces and certified purity.",
    url: "https://aranyakjewellers.com",
    siteName: "Aranyak Jewellers",
    images: [{ url: "/hero-banner.png", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aranyak Jewellers | Tripura's Finest",
    description: "Curating timeless treasures with master craftsmanship.",
    images: ["/hero-banner.png"],
  },
};

import { api } from '@/lib/api';

async function getGlobalData() {
  try {
    const [categories, settings] = await Promise.all([
      api.getCategories(),
      api.getSettings()
    ]);
    return { categories: categories || [], settings: settings || {} };
  } catch {
    return { categories: [], settings: {} };
  }
}

import { AuthProvider } from "@/context/AuthContext";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgressBar } from "@/components/animations/LuxuryMotion";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { categories, settings } = await getGlobalData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorant.variable} antialiased lg:cursor-none`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <ScrollProgressBar />
        <CustomCursor />
        <AuthProvider>
          <PageLoader />
          <SmoothScroll>
            <Header categories={categories} />
            {children}
            <Footer categories={categories} settings={settings} />
          </SmoothScroll>
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
