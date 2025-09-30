"use client";
import { useEffect, useState, useRef } from "react";
import { Product, useProducts } from "@/context/ProductContext";
import { Toaster, toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch, FiChevronDown, FiXCircle } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import EditProductModal from "./EditProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Importamos el nuevo modal
import { productService } from "@/services/productService";

const ProductSkeleton = () => (
    <div className="animate-pulse flex items-center justify-between p-3 sm:p-4 border border-amber-200 rounded-lg bg-white">
        {/* Esqueleto de la información del producto */}
        <div className="flex-grow min-w-0">
            <div className="h-5 bg-amber-200 rounded-md w-3/4 mb-2"></div>
            <div className="flex items-center gap-2">
                <div className="h-4 bg-amber-100 rounded-md w-12"></div>
                <div className="h-4 bg-green-100 rounded-md w-16"></div>
            </div>
        </div>
        {/* Esqueleto de los botones */}
        <div className="flex gap-2 ml-2 flex-shrink-0">
            <div className="w-8 h-8 bg-amber-200 rounded-full"></div>
            <div className="w-8 h-8 bg-red-200 rounded-full"></div>
        </div>
    </div>
);

const Dashboard = () => {
    const { products, page, lastPage, total, loading, error, fetchProducts, invalidateCache } = useProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'createdAt_desc'>('createdAt_desc');
    const [showFilters, setShowFilters] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null); // Estado para el producto a eliminar
    const [isDeleting, setIsDeleting] = useState(false); // Estado de carga para la eliminación
    const debouncedSearch = useDebounce(searchTerm, 500);
    const filtersDropdownRef = useRef<HTMLDivElement>(null); // Ref para el dropdown

    useEffect(() => {
        fetchProducts(1, debouncedSearch, sortOrder);
    }, [debouncedSearch, sortOrder, fetchProducts]);

    // Efecto para cerrar el dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filtersDropdownRef.current &&
                !filtersDropdownRef.current.contains(event.target as Node)
            ) {
                setShowFilters(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= lastPage) {
            fetchProducts(newPage, searchTerm, sortOrder);
        }
    };

    // Abre el modal de confirmación de eliminación
    const handleDelete = (product: Product) => {
        setDeletingProduct(product);
    };

    // Ejecuta la eliminación después de la confirmación
    const confirmDelete = async () => {
        if (!deletingProduct) return;

        setIsDeleting(true);
        try {
            await productService.delete(deletingProduct.id);
            invalidateCache(); // Limpiamos el caché
            setDeletingProduct(null); // Cierra el modal
            await fetchProducts(page, debouncedSearch, sortOrder); // Refresca la lista
            toast.success("Producto eliminado exitosamente.");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            toast.error("Hubo un error al eliminar el producto.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
    };

    const handleSelectFilter = (filter: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'createdAt_desc') => {
        setSortOrder(filter);
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSortOrder('createdAt_desc');
        setShowFilters(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
            <Toaster position="bottom-right" />
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
                <form onSubmit={(e) => e.preventDefault()} className="w-full sm:flex-grow">
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
                <div className="flex gap-2 w-full sm:w-auto items-center">
                    {/* Botón Crear Producto */}
                    <Link
                        href="/dashboard/products/new"
                        className="h-10 flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FiPlusCircle size={20} />
                        <span className="sm:hidden">Añadir</span>
                        <span className="hidden sm:inline">Crear</span>
                    </Link>

                    {/* Dropdown de sort */}
                    <div className="relative" ref={filtersDropdownRef}>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="h-10 w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-amber-300 rounded-md bg-white text-gray-900 hover:bg-amber-100 transition-colors"
                            >
                                <span className="hidden sm:inline">Filtros</span>
                                <FaFilter className="sm:hidden text-amber-700" />
                                <FiChevronDown className={`hidden sm:inline transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                            {/* Badge para limpiar filtros */}
                            {(debouncedSearch || sortOrder !== 'createdAt_desc') && (
                                <button
                                    onClick={handleClearFilters}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-transform transform hover:scale-110"
                                    title="Limpiar filtros y búsqueda"
                                >
                                    <FiXCircle size={14} />
                                </button>
                            )}
                        </div>
                        <div
                            className={`absolute right-0 top-full mt-2 w-48 bg-white border border-amber-200 rounded-lg shadow-lg z-10
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <ul className="divide-y divide-amber-100">
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
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between p-3 sm:p-4 border border-amber-200 rounded-lg bg-white"
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
                                    onClick={() => handleDelete(product)}
                                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : debouncedSearch ? ( // 3. Si no hay productos y se está buscando algo
                <div className="col-span-full flex flex-col items-center justify-center p-10 text-center text-gray-500 bg-amber-50/50 rounded-lg border-2 border-dashed border-amber-200">
                    <FiSearch size={40} className="mb-4 text-amber-500" />
                    <h3 className="text-xl font-semibold text-amber-800">No se encontraron resultados</h3>
                    <p className="text-sm text-gray-500 mt-1">Intenta con otro término de búsqueda.</p>
                </div>
            ) : ( // 4. Si no hay productos y no se está buscando nada
                <div className="col-span-full flex flex-col items-center justify-center p-10 text-center text-gray-500 bg-amber-50/50 rounded-lg border-2 border-dashed border-amber-200">
                    <FiPlusCircle size={40} className="mb-4 text-green-600" />
                    <h3 className="text-xl font-semibold text-amber-800">¡Aún no hay productos!</h3>
                    <p className="text-sm text-gray-500 mt-1">Haz clic en Crear para añadir tu primer producto.</p>
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

            {/* Modal de Edición */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSuccess={() => {
                        invalidateCache(); // Limpiamos el caché
                        setEditingProduct(null);
                        fetchProducts(page, debouncedSearch, sortOrder); // Refrescar la lista
                    }}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            {deletingProduct && (
                <DeleteConfirmationModal
                    productName={deletingProduct.name}
                    onClose={() => setDeletingProduct(null)}
                    onConfirm={confirmDelete}
                    loading={isDeleting}
                />
            )}
        </div>
    );
};

export default Dashboard;
