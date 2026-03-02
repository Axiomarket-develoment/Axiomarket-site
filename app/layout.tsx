import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import './globals.css'
// fonts.ts (recommended)
// fonts.ts
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/BottomBar";

export const poppins = Poppins({
  weight: ["400"], // or specify the weights you need, e.g. ["400", "700"]
  subsets: ["latin"],
  display: "swap",
});


// Inter → for body text
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AxioMarket | On-Chain Prediction Markets",
  description: "AxioMarket is an Avalanche-native outcome market protocol. Resolve predictions transparently with structured rules and measurable outcomes. $AXM coming soon on TheArena.",
  icons: { icon: "/img/logo.png" },
  keywords: [
    "AxioMarket",
    "Avalanche",
    "prediction markets",
    "crypto predictions",
    "outcome markets",
    "on-chain",
    "$AXM"
  ],
  openGraph: {
    title: "AxioMarket | On-Chain Prediction Markets",
    description: "Resolve crypto predictions transparently with AxioMarket — structured on-chain outcome markets on Avalanche.",
    url: "https://axiomarket.xyz",
    siteName: "AxioMarket",
    images: [
      {
        url: "https://axiomarket.xyz/img/social-preview.png",
        width: 1200,
        height: 630,
        alt: "AxioMarket on Avalanche"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AxioMarket | On-Chain Prediction Markets",
    description: "Resolve crypto predictions transparently with AxioMarket — structured on-chain outcome markets on Avalanche.",
    site: "@Axio_Market",
    creator: "@Axio_Market",
    images: ["https://axiomarket.xyz/img/social-preview.png"],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${poppins.className}`} suppressHydrationWarning>
      <body className="font-sans">
        <main className="">{children}</main> {/* pb-24 adds space for BottomBar */}

      </body>
    </html>

  );
}