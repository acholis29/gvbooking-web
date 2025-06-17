import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
// import { Theme } from "@radix-ui/themes";
// import "@radix-ui/themes/styles.css";

import "./globals.css";
import { ThemeProvider } from "@/components/General/theme-provider"
import Footer from "@/components/General/footer";
import Navbar from "@/components/General/navbar";
import Header from "@/components/General/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: "GV Bookings",
  description: "Excursion Booking by GoVacation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}  >
            <Header/>
         
          <div className="max-w-7xl mx-auto bg-zinc-950 dark:bg-white">
            <Navbar/>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                
              >
                {children}
              </ThemeProvider>
            <Footer/>

          </div>
      </body>
    </html>
  );
}

