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
import { CartApiProvider } from "@/context/CartApiContext";
import { WishProvider } from "@/context/WishContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ModalProvider } from "@/context/ModalContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { DateProvider } from "@/context/DateContext";
import { ReviewBookingProvider } from "@/context/ReviewBookingContext";
import { InitialProvider } from "@/context/InitialContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { SelectModalProvider } from "@/context/SelectModalContext";
import { SeasonProvider } from "@/context/SeasonContext";
import Providers from "./providers";
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
      <head>
        {/* Google Tag Manager Script */}
        {/* <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W45QJVFH');`}
        </script> */}

        {/* <!-- Cloudflare Web Analytics --> */}
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "17fc6778b6a24cf3a6a9ec6e0f2d5934"}'></script>
      {/* <!-- End Cloudflare Web Analytics --> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* GTM NoScript — wajib tepat setelah <body> buka */}
        {/* <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W45QJVFH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript> */}

        <CartProvider>
          <CartApiProvider>
            <WishProvider>
              <CurrencyProvider>
                <ModalProvider>
                  <LanguageProvider>
                    <DateProvider>
                      <ReviewBookingProvider>
                        <InitialProvider>
                          <ProfileProvider>
                            <SelectModalProvider>
                              <SeasonProvider>
                                <Providers>
                                  <Navbar />
                                  {/* Providers Next-Auth */}
                                  {children}
                                  <Toaster position="top-center" />
                                  {/* Footer */}
                                  <FooterComponent />
                                </Providers>
                              </SeasonProvider>
                            </SelectModalProvider>
                          </ProfileProvider>
                        </InitialProvider>
                      </ReviewBookingProvider>
                    </DateProvider>
                  </LanguageProvider>
                </ModalProvider>
              </CurrencyProvider>
            </WishProvider>
          </CartApiProvider>
        </CartProvider>
      </body>
    </html>
  );
}
