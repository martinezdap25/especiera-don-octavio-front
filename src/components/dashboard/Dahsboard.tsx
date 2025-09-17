"use client";
import { useEffect, useState } from "react";
import { useProducts, Product } from "@/context/ProductContext";
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import Image from "next/image";
import Pagination from "@/components/ui/Pagination";

const ProductSkeleton = () => (
    <div className="animate-pulse flex items-center justify-between p-3 sm:p-4 border-b border-amber-200 sm:border rounded-sm sm:rounded-lg bg-white">
        <div className="flex flex-col flex-grow min-w-0">
            <div className="h-5 bg-amber-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-amber-200 rounded w-1/2"></div>
        </div>
        <div className="flex gap-1 ml-2">
            <div className="w-8 h-8 bg-amber-200 rounded-full"></div>
            <div className="w-8 h-8 bg-amber-200 rounded-full"></div>
        </div>
    </div>
);

const Dashboard = () => {
    const { products, page, lastPage, total, loading, error, fetchProducts } = useProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('name_asc');
    const [showFilters, setShowFilters] = useState(false);

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

    const handleSelectFilter = (filter: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc') => {
        setSortOrder(filter);
        setShowFilters(false);
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
                    className="mb-2 sm:w-24 sm:h-24 w-24 h-24"
                />
                <h1 className="text-2xl sm:text-4xl font-bold text-amber-800 text-center">
                    Dashboard Don Octavio
                </h1>
                <p className="text-green-700 text-center text-sm sm:text-base">
                    Gestión de productos y ventas
                </p>
            </div>

            {/* Buscador y filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                {/* Buscador */}
                <form onSubmit={handleSearch} className="w-full sm:flex-grow">
                    <div className="relative w-full">
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

                {/* Botones filtros / añadir */}
                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Botón Crear Producto */}
                    <button
                        onClick={handleCreate}
                        className="h-10 flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FiPlusCircle size={20} />
                        <span className="sm:hidden">Añadir</span>
                        <span className="hidden sm:inline">Crear</span>
                    </button>

                    {/* Dropdown de sort */}
                    <div className="relative flex-grow sm:flex-grow-0">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="h-10 w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-amber-300 rounded-md bg-white text-gray-900 hover:bg-amber-100 transition-colors"
                        >
                            <span className="hidden sm:inline">Filtros</span>
                            <FaFilter className="sm:hidden" />
                            <FiChevronDown className={`hidden sm:inline transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                        <div
                            className={`absolute right-0 top-full mt-2 w-48 bg-white border border-amber-200 rounded-lg shadow-lg z-10
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <ul className="divide-y divide-gray-200">
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-600"
                                        onClick={() => handleSelectFilter("name_asc")}
                                    >
                                        Nombre (A → Z)
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-600"
                                        onClick={() => handleSelectFilter("name_desc")}
                                    >
                                        Nombre (Z → A)
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-600"
                                        onClick={() => handleSelectFilter("price_asc")}
                                    >
                                        Precio (menor a mayor)
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-600"
                                        onClick={() => handleSelectFilter("price_desc")}
                                    >
                                        Precio (mayor a menor)
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de productos */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <ProductSkeleton key={idx} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center p-4 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between p-3 sm:p-4 border-b border-amber-200 sm:border rounded-sm sm:rounded-lg bg-white"
                        >
                            {/* Información principal */}
                            <div className="flex flex-col flex-grow min-w-0">
                                <h2 className="font-semibold text-base text-amber-800 truncate">
                                    {product.name}
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{product.unitType === "grams" ? "500g" : "unidad"}</span>
                                    <span className="text-green-700 font-semibold">${product.price}</span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-1 ml-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition-colors flex items-center justify-center"
                                >
                                    <FiEdit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Paginación */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-4 gap-4 sm:gap-0">
                {/* Información de productos */}
                <p className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
                    Mostrando {products.length} de {total} productos
                </p>

                {/* Contenedor de la paginación */}
                <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                    <Pagination currentPage={page} totalPages={lastPage} onPageChange={handlePageChange} />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
