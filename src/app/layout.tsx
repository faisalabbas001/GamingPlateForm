import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import "react-toastify/dist/ReactToastify.css";
// import { MaintenanceProvider } from "@/app/context/MaintenanceProvider";

import LayoutClient from "./LayoutClient";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white`}
      >
        <LayoutClient>
                {children}
              </LayoutClient>
      </body>
    </html>
  );
}
