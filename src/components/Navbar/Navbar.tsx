"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation"; // 👈 para saber la ruta actual
import { FiShoppingCart, FiMenu, FiX, FiUser } from "react-icons/fi";

export default function Navbar() {
    const { cart } = useCart();
    const { token, logout } = useUser();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const totalItems = cart.length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-amber-400 sticky top-0 z-50">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="https://res.cloudinary.com/dsugc0qfa/image/upload/v1757541902/Logo-Don-Octavio_aal0rw.png"
                                alt="Logo Don Octavio"
                                width={50}
                                height={50}
                                className="h-12 w-auto drop-shadow"
                            />
                            <span className="hidden sm:block font-bold text-xl text-amber-900">
                                Don Octavio
                            </span>
                        </Link>
                    </div>

                    {/* Menú de escritorio */}
                    <div className="hidden md:flex items-center space-x-6 relative">
                        {/* Carrito solo si NO hay dueño logueado */}
                        {!token && (
                            <Link
                                href="/cart"
                                className={`relative p-2 rounded-full transition-all duration-300 ease-in-out ${pathname === "/cart"
                                    ? "bg-amber-500 text-white"
                                    : "text-amber-900 hover:text-white hover:bg-amber-500"
                                    }`}
                            >
                                <FiShoppingCart size={26} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-3 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Icono de usuario */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className={`p-2 rounded-full transition-all duration-300 ease-in-out ${isUserDropdownOpen
                                    ? "bg-amber-500 text-white"
                                    : "text-amber-900 hover:text-white hover:bg-amber-500"
                                    }`}
                            >
                                <FiUser size={26} />
                            </button>

                            {/* Dropdown */}
                            <div
                                className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-amber-200 z-10 transform origin-top-right transition-all duration-200 ${isUserDropdownOpen
                                    ? "scale-100 opacity-100"
                                    : "scale-95 opacity-0 pointer-events-none"
                                    }`}
                            >
                                {token ? (
                                    <>
                                        {/* Mostrar email arriba */}
                                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-amber-100">
                                            {JSON.parse(atob(token.split(".")[1])).email}
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsUserDropdownOpen(false)}
                                            className="block px-4 py-2 text-amber-900 hover:bg-amber-100 hover:text-amber-950 transition-colors duration-200"
                                        >
                                            Mi perfil
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsUserDropdownOpen(false)}
                                            className="block px-4 py-2 text-amber-900 hover:bg-amber-100 hover:text-amber-950 transition-colors duration-200"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsUserDropdownOpen(false);
                                            }}
                                            className="w-full text-left block px-4 py-2 text-red-600 font-medium hover:bg-red-100 transition-colors duration-200"
                                        >
                                            ⎋ Cerrar sesión
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                        className="block px-4 py-2 text-amber-900 hover:bg-amber-100 hover:text-amber-950 transition-colors duration-200"
                                    >
                                        ¿Eres admin?
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón menú móvil */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-amber-900 hover:text-white hover:bg-amber-500 transition-all duration-300"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel de menú móvil con animación */}
            <div
                className={`md:hidden bg-amber-100 border-t border-amber-200 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {token ? (
                        <>
                            {/* Email en mobile también */}
                            <div className="px-3 py-2 text-sm text-gray-500 border-b border-amber-200">
                                {JSON.parse(atob(token.split(".")[1])).email}
                            </div>
                            <Link
                                href="/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium text-amber-900 hover:bg-amber-200 hover:text-amber-950 transition-colors duration-200"
                            >
                                Mi perfil
                            </Link>
                            <Link
                                href="/dashboard"
                                className="block px-3 py-2 rounded-md text-base font-medium text-amber-900 hover:bg-amber-200 hover:text-amber-950 transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100 transition-colors duration-200"
                            >
                                ⎋ Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="block px-3 py-2 rounded-md text-base font-medium text-amber-900 hover:bg-amber-200 hover:text-amber-950 transition-colors duration-200"
                        >
                            ¿Eres admin?
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
