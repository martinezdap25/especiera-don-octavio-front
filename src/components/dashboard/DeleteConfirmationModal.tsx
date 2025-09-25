"use client";

import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";

type DeleteConfirmationModalProps = {
    productName: string;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
};

const DeleteConfirmationModal = ({ productName, onClose, onConfirm, loading }: DeleteConfirmationModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl text-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4">
                        <FiAlertTriangle className="text-red-600" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">¿Confirmas la eliminación?</h2>
                    <p className="text-gray-600 mb-1">
                        Estás a punto de eliminar el producto:
                    </p>
                    <p className="font-semibold text-amber-800 text-lg mb-4 break-words">
                        {productName}
                    </p>
                    <p className="text-sm text-red-700 font-medium">
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2 disabled:bg-red-400 disabled:cursor-wait"
                    >
                        <FiTrash2 />
                        {loading ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;