/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useProducts, Product } from "@/context/ProductContext";
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch } from "react-icons/fi";
import Image from "next/image";
import Pagination from "@/components/ui/Pagination";

const ProductSkeleton = () => (
    <div className="animate-pulse bg-amber-100 rounded-lg p-4 h-32 flex flex-col justify-between">
        <div className="h-6 bg-amber-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-amber-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-amber-200 rounded w-1/3"></div>
    </div>
);

const Dashboard = () => {
    const { products, page, lastPage, total, loading, error, fetchProducts } = useProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('name_asc');

    useEffect(() => {
        fetchProducts(1, searchTerm, sortOrder);
    }, [searchTerm, sortOrder, fetchProducts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(1, searchTerm, sortOrder);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= lastPage) {
            fetchProducts(newPage, searchTerm, sortOrder);
        }
    };

    const handleDelete = (productId: number) => {
        alert(`Eliminar producto con ID: ${productId}`);
    };

    const handleEdit = (product: Product) => {
        alert(`Editar producto: ${product.name}`);
    };

    const handleCreate = () => {
        alert("Crear nuevo producto");
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
            {/* Logo y título */}
            <div className="flex flex-col items-center mb-6">
                <Image
                    src="https://res.cloudinary.com/dsugc0qfa/image/upload/v1757541902/Logo-Don-Octavio_aal0rw.png"
                    alt="Logo Don Octavio"
                    width={120}
                    height={120}
                    className="mb-2 sm:w-28 sm:h-28 w-24 h-24"
                />
                <h1 className="text-3xl sm:text-4xl font-bold text-amber-800 text-center">
                    Dashboard Don Octavio
                </h1>
                <p className="text-green-700 text-center text-sm sm:text-base">
                    Gestión de productos y ventas
                </p>
            </div>

            {/* Buscador y filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-4 bg-amber-50 rounded-lg shadow border border-amber-200">
                <form onSubmit={handleSearch} className="flex-grow w-full sm:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre..."
                            className="w-full p-2 pl-10 rounded-md border border-amber-300 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 bg-white placeholder-gray-500"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
                    </div>
                </form>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500 w-full sm:w-auto bg-white text-gray-900"
                >
                    <option value="name_asc">Nombre (A-Z)</option>
                    <option value="name_desc">Nombre (Z-A)</option>
                    <option value="price_asc">Precio (Menor a Mayor)</option>
                    <option value="price_desc">Precio (Mayor a Menor)</option>
                </select>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
                >
                    <FiPlusCircle size={20} />
                    <span className="hidden sm:inline">Crear Producto</span>
                </button>
            </div>

            {/* Lista de productos */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <ProductSkeleton key={idx} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center p-8 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="p-4 rounded-lg shadow-md flex flex-col justify-between border border-amber-300 hover:shadow-lg transition-shadow bg-white"
                        >
                            {/* Información del producto */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-bold text-lg text-amber-800 truncate">{product.name}</h2>
                                    <span className="text-sm font-medium text-gray-500">{product.unitType === "grams" ? "500g" : "unidad"}</span>
                                </div>

                                <p className="text-green-700 font-semibold">Precio: ${product.price}</p>
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition-colors flex items-center justify-center"
                                >
                                    <FiEdit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Paginación */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                {/* Información de productos */}
                <p className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
                    Mostrando {products.length} de {total} productos
                </p>

                {/* Contenedor de la paginación */}
                <div className="w-full sm:w-auto flex justify-between sm:mt-0">
                    <Pagination currentPage={page} totalPages={lastPage} onPageChange={handlePageChange} />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
