import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import './globals.css'
// fonts.ts (recommended)
// fonts.ts
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/BottomBar";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

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

const GOOGLE_CLIENT_ID = "0981375860-q5ukucpsd99erb6cg06d7ape30urrm5l.apps.googleusercontent.com";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${poppins.className}`} suppressHydrationWarning>
      <head>
        <script
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          async
        ></script>
      </head>
      <body className="font-sans">
        <main className="">
          <GoogleOAuthProvider clientId="60981375860-77ou1knuso3cv50qsn1pmjk0332k220n.apps.googleusercontent.com">
            {children}
          </GoogleOAuthProvider>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid #222",
            },
          }}
        />
      </body>
    </html>

  );
}