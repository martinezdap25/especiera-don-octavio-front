"use client";

import { useState } from "react";
import { FiAlertTriangle, FiHome, FiShoppingBag, FiMapPin } from "react-icons/fi";

type Props = {
  onClose: () => void;
  onConfirm: (deliveryMethod: "pickup" | "delivery", address: string) => void;
};

export default function ConfirmOrderModal({ onClose, onConfirm }: Props) {
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");

  const handleConfirm = () => {
    if (deliveryMethod === "delivery" && !address.trim()) {
      alert("Por favor, ingresá tu dirección para el envío.");
      return;
    }
    onConfirm(deliveryMethod, address);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative border border-amber-200">
        <div className="flex flex-col items-center text-center mb-6">
          <FiAlertTriangle className="text-amber-500 mb-3" size={40} />
          <h3 className="text-xl font-bold text-gray-800">Confirmar Pedido</h3>
        </div>

        {/* 🔹 Métodos de entrega */}
        <div className="mb-4 text-left">
          <h3 className="text-base font-semibold text-gray-700 mb-3 text-center">
            Primero, elegí el método de entrega
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {/* Retiro en el local */}
            <label
              className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${deliveryMethod === "pickup"
                ? "border-amber-600 bg-amber-50 shadow-inner"
                : "border-gray-200 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
            >
              <input
                type="radio"
                value="pickup"
                checked={deliveryMethod === "pickup"}
                onChange={() => setDeliveryMethod("pickup")}
                className="sr-only"
              />
              <FiShoppingBag className="text-xl text-amber-700" />
              <span className="text-sm font-medium text-gray-700">
                Retiro en el local
              </span>
            </label>

            {/* Envío a domicilio */}
            <label
              className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${deliveryMethod === "delivery"
                ? "border-amber-600 bg-amber-50 shadow-inner"
                : "border-gray-200 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
            >
              <input
                type="radio"
                value="delivery"
                checked={deliveryMethod === "delivery"}
                onChange={() => setDeliveryMethod("delivery")}
                className="sr-only"
              />
              <FiHome className="text-xl text-amber-700" />
              <span className="text-sm font-medium text-gray-700">
                Envío a domicilio
              </span>
            </label>
          </div>

          {deliveryMethod === "delivery" && (
            <div className="mt-3 relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
              <input
                type="text"
                placeholder="Ingresá tu dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl pl-12 pr-4 py-2 text-base text-gray-600
  bg-amber-50 border border-amber-200
  focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:border-amber-500
  placeholder-gray-400 transition shadow-sm"
                autoFocus
              />
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mb-6">
          Serás redirigido a WhatsApp. Una vez confirmado, el carrito se vaciará.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}