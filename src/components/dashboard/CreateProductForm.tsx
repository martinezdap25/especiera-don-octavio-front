"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiTag, FiDollarSign, FiType, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { productService } from "@/services/productService";
import { useProducts } from "@/context/ProductContext";

const CreateProductForm = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [unitType, setUnitType] = useState<"grams" | "unit">("grams");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { fetchProducts } = useProducts();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Aquí iría la lógica para llamar al servicio y crear el producto
        try {
            await productService.create({
                name,
                price: parseFloat(price),
                unitType,
            });

            // Si la llamada es exitosa:
            await fetchProducts(); // Refrescar la lista de productos
            router.push("/dashboard");

        } catch (err) {
            setError("Hubo un error al crear el producto. Inténtalo de nuevo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-6">
                <Link href="/dashboard" className="text-amber-600 hover:text-amber-800 transition-colors p-2 rounded-full -ml-2">
                    <FiArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-amber-800 ml-2">Crear Nuevo Producto</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre del Producto */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Producto
                    </label>
                    <div className="relative">
                        <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Orégano"
                            required
                            className="w-full p-3 pl-10 rounded-lg border border-amber-200 bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-500 text-gray-900"
                        />
                    </div>
                </div>

                {/* Precio */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (por 500g o por unidad)
                    </label>
                    <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Ej: 1500.50"
                            step="0.01"
                            required
                            className="w-full p-3 pl-10 rounded-lg border border-amber-200 bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-500 text-gray-900"
                        />
                    </div>
                </div>

                {/* Tipo de Unidad */}
                <div>
                    <label htmlFor="unitType" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Unidad
                    </label>
                    <div className="relative">
                        <FiType className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                        <select
                            id="unitType"
                            value={unitType}
                            onChange={(e) => setUnitType(e.target.value as "grams" | "unit")}
                            required
                            className="w-full p-3 pl-10 rounded-lg border border-amber-200 bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none transition-all text-gray-900"
                        >
                            <option value="grams">Gramos (se vende por peso)</option>
                            <option value="unit">Unidad (se vende por unidad)</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-green-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                    <FiSave />
                    {loading ? "Guardando..." : "Guardar Producto"}
                </button>
            </form>
        </div>
    );
};

export default CreateProductForm;