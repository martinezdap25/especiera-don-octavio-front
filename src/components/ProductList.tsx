"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import { useProducts, Product } from "@/context/ProductContext";
import AddToCartModal from "./AddToCartModal";
import { FiShoppingBag } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import Pagination from "./ui/Pagination";
import ProductSkeleton from "./ProductSkeleton";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { useSession } from "next-auth/react";

export default function ProductList() {

  const { cart, addToCart } = useCart();
  const { products, loading, error, page, lastPage, fetchProducts } =
    useProducts();

  const itemCount = cart.length;
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // animación badge
  const [popBadge, setPopBadge] = useState(false);

  // dropdown filtros
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('name_asc');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (itemCount > 0) {
      setPopBadge(true);
      const timer = setTimeout(() => setPopBadge(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  useEffect(() => {
    fetchProducts(1, debouncedSearch, sort);
  }, [debouncedSearch, sort, fetchProducts]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleConfirmAddToCart = (product: Product, quantity: number) => {
    const cartItem: CartItem = {
      ...product,
      quantity,
      price: product.price.toString(), // 👈 en cart tenés price como string
    };
    addToCart(cartItem);
    handleCloseModal();
  };

  const handleSelectFilter = (filter: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc') => {
    setSort(filter);
    setShowFilters(false);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, debouncedSearch, sort);
  };

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  console.log("Session: ", session);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-gray-50 rounded-lg">
      {/* Logo y nombre */}
      <div className="flex flex-col items-center mb-6">
        <Image
          src="https://res.cloudinary.com/dsugc0qfa/image/upload/v1757541902/Logo-Don-Octavio_aal0rw.png"
          alt="Logo Don Octavio"
          width={120}
          height={120}
          className="mb-2 sm:w-28 sm:h-28 w-24 h-24"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-800 text-center">
          Especiera Don Octavio
        </h1>
        <p className="text-green-700 text-center text-sm sm:text-base">
          Condimentos frescos y de calidad
        </p>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2 border border-amber-200 focus-within:ring-2 focus-within:ring-green-500 transition mb-4">
        <svg
          className="w-5 h-5 text-amber-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar condimento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Encabezado listado con filtros */}
      <div className="flex justify-between items-center mb-4 px-2 sm:px-0 relative">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Listado de productos
        </h2>

        <div className="flex gap-2">
          {/* Escritorio: botón con dropdown */}
          <div className="hidden sm:flex gap-2 relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
            >
              Filtros
            </button>
            <div
              className={`absolute right-0 top-10 w-48 bg-white border border-amber-200 rounded-lg shadow-lg z-10
          overflow-hidden transition-all duration-300 ease-in-out
          ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <ul className="divide-y divide-gray-200">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-600"
                    onClick={() => handleSelectFilter("price_asc")}
                  >
                    Precio más bajo primero
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-600"
                    onClick={() => handleSelectFilter("price_desc")}
                  >
                    Precio más alto primero
                  </button>
                </li>
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
              </ul>
            </div>
          </div>

          {/* Móvil: icono embudo */}
          <div className="flex sm:hidden gap-2 relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition flex items-center justify-center"
            >
              <FaFilter size={20} />
            </button>
            <div
              className={`absolute right-2 top-12 w-48 bg-white border border-amber-200 rounded-lg shadow-lg z-10
          overflow-hidden transition-all duration-300 ease-in-out
          ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <ul className="divide-y divide-gray-200">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-600"
                    onClick={() => handleSelectFilter("price_asc")}
                  >
                    Precio más bajo primero
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-600"
                    onClick={() => handleSelectFilter("price_desc")}
                  >
                    Precio más alto primero
                  </button>
                </li>
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
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <ul className="divide-y divide-amber-100 bg-white rounded-lg shadow border border-amber-200">
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}

        {error && <p className="text-red-500 text-center p-4">{error}</p>}

        {!loading && !error && products.length > 0 ? (
          products.map((product) => (
            <li
              key={product.id}
              className="p-4 hover:bg-amber-50 flex justify-between items-center transition"
            >
              <span className="font-medium text-gray-800">{product.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold">
                  ${product.price}
                </span>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  onClick={() => handleSelectProduct(product)}
                >
                  Añadir
                </button>
              </div>
            </li>
          ))
        ) : (
          !loading &&
          !error && (
            <div className="flex flex-col items-center justify-center p-6 text-gray-500">
              <span className="text-3xl mb-2">🔎</span>
              <p className="text-center text-lg font-medium">
                No se encontraron productos
              </p>
              <p className="text-sm text-gray-400">
                Probá con otra búsqueda o filtros
              </p>
            </div>
          )
        )}
      </ul>

      {/* Paginación */}
      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Botón flotante SOLO en móvil */}
      {cart.length > 0 && (
        <div className="flex sm:hidden fixed bottom-6 right-6">
          <Link
            href="/cart"
            className="relative bg-amber-500 text-white p-4 rounded-full shadow-lg hover:bg-amber-600 transition-transform transform hover:scale-110 flex items-center justify-center"
          >
            <FiShoppingBag size={24} />
            {itemCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 bg-red-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center transform transition-transform duration-200 ${popBadge ? "scale-110 rotate-3" : "scale-100 rotate-0"
                  }`}
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onConfirm={handleConfirmAddToCart}
        />
      )}
    </div>
  );
}
