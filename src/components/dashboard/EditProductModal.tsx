"use client";

import { useState, useEffect, FormEvent } from "react";
import { FiSave, FiTag, FiDollarSign, FiType, FiChevronDown, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { productService } from "@/services/productService";
import { Product } from "@/context/ProductContext";

type EditProductModalProps = {
    product: Product;
    onClose: () => void;
    onSuccess: () => void;
};

const EditProductModal = ({ product, onClose, onSuccess }: EditProductModalProps) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [unitType, setUnitType] = useState<"grams" | "unit">(product.unitType);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Pre-llenar el formulario cuando el producto cambie
        setName(product.name);
        setPrice(product.price.toString());
        setUnitType(product.unitType);
    }, [product]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name || !price) {
            setError("El nombre y el precio no pueden estar vacíos.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await productService.update(product.id, {
                name,
                price: parseFloat(price),
                unitType,
            });

            toast.success("Producto actualizado exitosamente.");
            onSuccess(); // Llama a la función onSuccess para refrescar y cerrar

        } catch (err) {
            setError("Hubo un error al actualizar el producto.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"
                    aria-label="Cerrar modal"
                >
                    <FiX size={24} />
                </button>
                <h1 className="text-2xl font-bold text-amber-800 mb-6">Editar Producto</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre del Producto */}
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Producto
                        </label>
                        <div className="relative">
                            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                            <input
                                id="edit-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-3 pl-10 rounded-lg border border-amber-200 bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Precio */}
                    <div>
                        <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                            Precio
                        </label>
                        <div className="relative">
                            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                            <input
                                id="edit-price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                step="0.01"
                                required
                                className="w-full p-3 pl-10 rounded-lg border border-amber-200 bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Tipo de Unidad */}
                    <div>
                        <label htmlFor="edit-unitType" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Unidad
                        </label>
                        <div className="relative">
                            <FiType className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                            <select
                                id="edit-unitType"
                                value={unitType}
                                onChange={(e) => setUnitType(e.target.value as "grams" | "unit")}
                                required
                                className="w-full p-3 pl-10 rounded-lg border border-amber-200 bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none text-gray-900"
                            >
                                <option value="grams">Gramos</option>
                                <option value="unit">Unidad</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-green-400 disabled:cursor-not-allowed">
                        <FiSave />
                        {loading ? "Guardando Cambios..." : "Guardar Cambios"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;