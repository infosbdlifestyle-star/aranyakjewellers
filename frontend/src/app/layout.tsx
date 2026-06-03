import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoldRateBar from "@/components/layout/GoldRateBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <GoldRateBar />
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
