"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar/Navbar";

type Props = {
    children: React.ReactNode;
};

export default function LayoutClient({ children }: Props) {
    const pathname = usePathname();

    // Define las rutas donde NO quieres que se muestre el footer
    const noFooterRoutes = ["/dashboard", "/login", "/cart"];

    const showFooter = !noFooterRoutes.includes(pathname);

    return (
        <>
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            {showFooter && <Footer />}
        </>
    );
}