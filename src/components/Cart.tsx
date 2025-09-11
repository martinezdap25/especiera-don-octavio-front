"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const total = cart
        .reduce((acc, item) => {
            const itemPrice =
                item.unitType === "grams"
                    ? Number(item.price) * (item.quantity / 500) // precio por 500g
                    : Number(item.price) * item.quantity;
            return acc + itemPrice;
        }, 0)
        .toFixed(2);

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity > 0) {
            updateQuantity(productId, newQuantity);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-green-700 hover:text-green-800 transition"
                >
                    <FiArrowLeft size={20} />
                    <span className="font-semibold">Seguir comprando</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-amber-800">
                    Tu Carrito
                </h1>
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
                    <p className="text-gray-500 mt-2">
                        ¡Añade algunos productos para empezar!
                    </p>
                </div>
            ) : (
                <>
                    {/* Lista de productos */}
                    <ul className="divide-y divide-amber-100 bg-white rounded-lg shadow border border-amber-200 mb-6">
                        {cart.map((item) => (
                            <li
                                key={item.id}
                                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Precio: ${item.price} /{" "}
                                        {item.unitType === "grams" ? "500gr" : "unidad"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(item.id, parseInt(e.target.value))
                                        }
                                        className="w-20 p-1 border border-gray-300 rounded-md text-center"
                                    />
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition"
                                        aria-label="Eliminar producto"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Resumen */}
                    <div className="bg-white rounded-lg shadow border border-amber-200 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Total del Pedido
                            </h2>
                            <span className="text-2xl font-bold text-green-700">
                                ${total}
                            </span>
                        </div>
                        <button
                            onClick={() =>
                                alert("Funcionalidad para finalizar la compra no implementada.")
                            }
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
