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
  title: "Axio Market",
  description: "Trade smarter. Move faster. Win consistently.",
  icons: { icon: "/img/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${poppins.className}`} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="pb-24">{children}</main> {/* pb-24 adds space for BottomBar */}
          <BottomBar />
        </ThemeProvider>
      </body>
    </html>

  );
}