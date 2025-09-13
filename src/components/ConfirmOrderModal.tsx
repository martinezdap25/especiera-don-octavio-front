"use client";

import { FiAlertTriangle } from "react-icons/fi";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmOrderModal({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative border border-amber-200">
        <div className="flex flex-col items-center text-center">
          <FiAlertTriangle className="text-amber-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmar Pedido</h3>
          <p className="text-gray-600 mb-6">
            Serás redirigido a WhatsApp para finalizar tu pedido. Una vez confirmado, el carrito se vaciará.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}