// components/Cart.tsx
"use client";

import { useCart, type CartItem } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiArrowLeft, FiMinus, FiPlus, FiX } from "react-icons/fi";

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const total = cart
        .reduce((acc: number, item: CartItem) => {
            const price = Number(item.price) || 0;
            const itemPrice =
                item.unitType === "grams"
                    ? price * (item.quantity / 500) // precio por 500g
                    : price * item.quantity;
            return acc + itemPrice;
        }, 0)
        .toFixed(2);

    const handleIncrement = (item: CartItem) => {
        const step = item.unitType === "grams" ? 500 : 1;
        updateQuantity(item.id, item.quantity + step);
    };

    const handleDecrement = (item: CartItem) => {
        const step = item.unitType === "grams" ? 500 : 1;
        const newQty = item.quantity - step;
        if (newQty > 0) updateQuantity(item.id, newQty);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen rounded-lg">
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-green-700 hover:text-green-800 transition"
                >
                    <FiArrowLeft size={20} />
                    <span className="font-semibold">Seguir comprando</span>
                </Link>
                <h1 className="text-xl sm:text-3xl font-bold text-amber-800">Tu Carrito</h1>
            </div>

            {cart.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow border border-amber-200">
                    <Image
                        src="https://res.cloudinary.com/dsugc0qfa/image/upload/v1757541902/Logo-Don-Octavio_aal0rw.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-600 text-lg">Tu carrito está vacío.</p>
                    <p className="text-gray-500 mt-2">¡Añade algunos productos para empezar!</p>
                </div>
            ) : (
                <>
                    {/* Lista de productos */}
                    <ul className="bg-white rounded-lg shadow border border-amber-200 mb-6">
                        {cart.map((item: CartItem, index) => {
                            const price = Number(item.price) || 0;
                            const subtotal =
                                item.unitType === "grams" ? price * (item.quantity / 500) : price * item.quantity;

                            return (
                                <li
                                    key={item.id}
                                    className={`relative p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${index !== cart.length - 1 ? "border-b border-amber-100" : ""
                                        }`}
                                >
                                    {/* Botón eliminar arriba a la derecha (solo móvil) */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md bg-red-500/80 text-white hover:bg-red-600/90 transition sm:hidden"
                                        aria-label="Eliminar producto"
                                    >
                                        <FiX size={18} />
                                    </button>

                                    {/* Info producto */}
                                    <div className="flex flex-col flex-grow pr-8 sm:pr-0">
                                        <div className="flex justify-between items-center gap-2">
                                            <p className="font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-xs">
                                                {item.name} -{" "}
                                                <span className="text-sm text-gray-500 flex-shrink-0">${item.price}</span>
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1 font-medium">
                                            Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
                                        </p>
                                    </div>

                                    {/* Controles */}
                                    <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-start justify-between">
                                        <button
                                            onClick={() => handleDecrement(item)}
                                            className="p-2 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition flex-shrink-0"
                                            aria-label="Disminuir cantidad"
                                        >
                                            <FiMinus size={16} />
                                        </button>

                                        {/* Cantidad con ancho fijo */}
                                        <span className="w-16 text-center font-semibold text-gray-700 truncate">
                                            {item.unitType === "grams" ? `${item.quantity}g` : item.quantity}
                                        </span>

                                        <button
                                            onClick={() => handleIncrement(item)}
                                            className="p-2 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition flex-shrink-0"
                                            aria-label="Aumentar cantidad"
                                        >
                                            <FiPlus size={16} />
                                        </button>

                                        {/* Botón eliminar (solo desktop) */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="hidden sm:flex p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition"
                                            aria-label="Eliminar producto"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Spacer para mobile */}
                    <div className="h-28 sm:hidden" />

                    {/* Resumen */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-200 shadow-inner p-4 sm:static sm:rounded-lg sm:shadow sm:border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Total del Pedido</h2>
                            <span className="text-2xl font-bold text-green-700">${total}</span>
                        </div>
                        <button
                            onClick={() => alert("Funcionalidad para finalizar la compra no implementada.")}
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md"
                        >
                            Finalizar Compra
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full mt-2 text-sm text-red-600 hover:underline"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
