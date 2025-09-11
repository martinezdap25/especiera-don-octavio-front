"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import AddToCartModal from "./AddToCartModal";
import { FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { FaSortAlphaDown } from "react-icons/fa";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  unitType: "grams" | "unit";
  price: string;
};

const products: Product[] = [
  { id: 1, name: "Pimienta Negra", unitType: "grams", price: "150.00" },
  { id: 2, name: "Comino", unitType: "grams", price: "120.00" },
  { id: 3, name: "Miel", unitType: "unit", price: "500.00" },
  { id: 4, name: "Orégano", unitType: "grams", price: "100.00" },
  { id: 5, name: "Pimentón Ahumado", unitType: "grams", price: "200.00" },
  { id: 6, name: "Sal Rosada", unitType: "grams", price: "90.00" },
  { id: 7, name: "Azúcar", unitType: "grams", price: "80.00" },
  { id: 8, name: "Canela en Rama", unitType: "grams", price: "250.00" },
  { id: 9, name: "Aceite de Oliva", unitType: "unit", price: "700.00" },
  { id: 10, name: "Vinagre Balsámico", unitType: "unit", price: "650.00" },
];

export default function ProductList() {
  const { cart, addToCart } = useCart();
  const itemCount = cart.length;
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // animación badge
  const [popBadge, setPopBadge] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setPopBadge(true);
      const timer = setTimeout(() => setPopBadge(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

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
    };
    addToCart(cartItem);
    handleCloseModal();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
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
      <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Listado de productos
        </h2>

        <div className="flex gap-2">
          {/* Escritorio: botones con texto */}
          <div className="hidden sm:flex gap-2">
            <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Filtrar
            </button>
            <button className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition">
              Ordenar
            </button>
          </div>

          {/* Móvil: iconos */}
          <div className="flex sm:hidden gap-2">
            <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center">
              <FiDollarSign size={20} />
            </button>
            <button className="p-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition flex items-center justify-center">
              <FaSortAlphaDown size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <ul className="divide-y divide-amber-100 bg-white rounded-lg shadow border border-amber-200">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          <p className="text-gray-500 text-center p-4">
            No se encontraron productos.
          </p>
        )}
      </ul>

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
                className={`absolute -top-1 -right-1 bg-red-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center transform transition-transform duration-200 ${
                  popBadge ? "scale-110 rotate-3" : "scale-100 rotate-0"
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
