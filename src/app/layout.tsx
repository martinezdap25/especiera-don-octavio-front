import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import { Geist } from 'next/font/google'
import { ProductProvider } from "@/context/ProductContext";
import { UserProvider } from "@/context/UserContext";
import LayoutClient from "@/components/LayoutClient";

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
      <body className="flex flex-col min-h-screen">
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <LayoutClient>
                {children}
              </LayoutClient>
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </body>
    </html>
  );
}
