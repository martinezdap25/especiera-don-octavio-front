"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // manejamos el error aquí
        });

        if (result?.error) {
            setError("Usuario o contraseña incorrectos.");
        } else if (result?.ok) {
            router.push("/dashboard");
        }

        setLoading(false); // ✅
    };

    return (
        <div className="flex items-center justify-center w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-md"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Image
                            src="https://res.cloudinary.com/dsugc0qfa/image/upload/v1757541902/Logo-Don-Octavio_aal0rw.png"
                            alt="Don Octavio"
                            width={72}
                            height={72}
                            className="drop-shadow-md"
                        />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-amber-900 mt-3 text-center">
                        Panel de Administración
                    </h1>
                    <p className="text-green-600 text-sm mt-1 text-center">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-amber-800 mb-1">
                            Email
                        </label>
                        <div className="flex items-center border-2 border-amber-200 rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
                            <FiUser className="text-amber-600 mr-2" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@donoctavio.com"
                                className="w-full outline-none bg-transparent text-amber-900 text-base placeholder-amber-900 placeholder:opacity-40"
                                required
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-amber-800 mb-1">
                            Contraseña
                        </label>
                        <div className="flex items-center border-2 border-amber-200 rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
                            <FiLock className="text-amber-600 mr-2" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="w-full outline-none bg-transparent text-amber-900 text-base placeholder-amber-900 placeholder:opacity-40"
                                required
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600 text-center pt-1">{error}</p>
                    )}

                    {/* Botón */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors duration-300 disabled:bg-green-200 disabled:cursor-not-allowed text-base"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
