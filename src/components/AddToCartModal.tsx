"use client";

import { useState } from "react";

type Product = {
    id: number;
    name: string;
    unitType: "grams" | "unit";
    price: string;
};

type Props = {
    product: Product;
    onClose: () => void;
    onConfirm: (product: Product, quantity: number) => void;
};

export default function AddToCartModal({ product, onClose, onConfirm }: Props) {
    const [quantity, setQuantity] = useState(() => product.unitType === "grams" ? 500 : 1);

    const gramSteps = Array.from({ length: 100 }, (_, i) => 500 + i * 500); // 500g a 50kg

    const handleConfirmClick = () => {
        onConfirm(product, quantity);
    };

    const finalPrice = product.unitType === "grams"
        ? (Number(product.price) * (quantity / 500)).toFixed(2)
        : (Number(product.price) * quantity).toFixed(2);

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-amber-200">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    ✕
                </button>

                <div className="flex items-center mb-2">
                    <h3 className="text-2xl font-bold text-gray-800 mr-4">{product.name}</h3>
                    <span className="text-gray-400 font-medium text-lg">${product.price}</span>
                </div>

                <p className="text-green-700 font-semibold mb-4">
                    Precio final: ${finalPrice}
                </p>

                <label className="block mb-2 font-medium text-gray-700">
                    {product.unitType === "grams" ? "Cantidad" : "Cantidad (unidades)"}
                </label>

                <div className="flex items-center gap-2 mb-4">
                    <button
                        className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-800 font-bold rounded-md transition"
                        onClick={() => {
                            if (product.unitType === "unit") {
                                setQuantity((prev) => Math.max(1, prev - 1));
                            } else {
                                setQuantity((prev) => {
                                    const index = gramSteps.indexOf(prev);
                                    return index > 0 ? gramSteps[index - 1] : prev;
                                });
                            }
                        }}
                    >
                        -
                    </button>

                    <span className="px-4 py-2 border border-amber-200 rounded text-center w-full text-gray-700 font-bold">
                        {product.unitType === "grams"
                            ? quantity >= 1000
                                ? `${(quantity / 1000).toFixed(1)} kg`
                                : `${quantity} g`
                            : quantity}
                    </span>

                    <button
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md transition"
                        onClick={() => {
                            if (product.unitType === "unit") {
                                setQuantity((prev) => Math.min(99, prev + 1));
                            } else {
                                setQuantity((prev) => {
                                    const index = gramSteps.indexOf(prev);
                                    return index < gramSteps.length - 1 ? gramSteps[index + 1] : prev;
                                });
                            }
                        }}
                    >
                        +
                    </button>
                </div>

                <button
                    className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 font-semibold transition"
                    onClick={handleConfirmClick}
                >
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
}