import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OfferBanner from "@/components/layout/OfferBanner";
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
  title: "Aranyak Jewellers | Premium Gold & Diamond Jewellery in Tripura",
  description: "Discover exquisite gold, diamond, and silver jewellery at Aranyak Jewellers. Multiple stores across Tripura offering the finest craftsmanship and authentic astrological stones.",
  keywords: ["Aranyak Jewellers", "Jewellery in Tripura", "Gold Jewellery", "Diamond Rings", "Silver Ornaments", "Astrological Stones", "Bengali Jewellery", "Agartala Jewellery"],
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

async function getGlobalData() {
  const backendUrl = process.env.NODE_ENV === 'production' 
    ? 'http://117.252.16.132:3001/api' 
    : 'http://localhost:3001/api';
  try {
    // 5-second timeout so the build never hangs if VPS is slow/down
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const [catRes, setRes] = await Promise.all([
      fetch(`${backendUrl}/categories`, { next: { revalidate: 3600 }, signal: controller.signal }),
      fetch(`${backendUrl}/settings`, { next: { revalidate: 3600 }, signal: controller.signal })
    ]);
    clearTimeout(timeout);
    const categories = catRes.ok ? await catRes.json() : [];
    const settingsArr = setRes.ok ? await setRes.json() : [];
    const settings: any = {};
    if (Array.isArray(settingsArr)) {
      settingsArr.forEach((s: any) => { settings[s.key] = s.value; });
    }
    return { categories, settings };
  } catch (e) {
    // Return empty - Header will use static CATEGORIES fallback
    return { categories: [], settings: {} };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { categories, settings } = await getGlobalData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorant.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <PageLoader />
        <SmoothScroll>
          <OfferBanner />
          <Header categories={categories} />
          {children}
          <Footer categories={categories} settings={settings} />
        </SmoothScroll>
        <WhatsAppButton />
      </body>
    </html>
  );
}
