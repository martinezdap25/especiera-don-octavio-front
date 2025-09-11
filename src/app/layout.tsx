import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Geist } from 'next/font/google'
import Navbar from "@/components/Navbar/Navbar";

const geist = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Especiera Don Octavio",
  description: "Condimentos frescos y de calidad"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
