import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Fontawesome
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import "@/lib/fontawesome.ts"; // ← Ini penting agar ikon tersedia
// Flowbite
import "flowbite";

// Components
import Navbar from "@/components/Navbar";
import FooterComponent from "@/components/Footer";
// State Global / Context
import { CartProvider } from "@/context/CartContext";
import { WishProvider } from "@/context/WishContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ModalProvider } from "@/context/ModalContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { DateProvider } from "@/context/DateContext";
// Toast
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoVacation",
  description: "GoVacation Indonesia, GoVacation Thailand, GoVacation Vietnam",
  icons: {
    icon: "/images/icon/icon-gvi.ico", // pastikan sesuai dengan nama file di public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <WishProvider>
            <CurrencyProvider>
              <ModalProvider>
                <LanguageProvider>
                  <DateProvider>
                    <Navbar />
                    {children}
                    <Toaster position="top-center" />
                    {/* Footer */}
                    <FooterComponent />
                  </DateProvider>
                </LanguageProvider>
              </ModalProvider>
            </CurrencyProvider>
          </WishProvider>
        </CartProvider>
      </body>
    </html>
  );
}
