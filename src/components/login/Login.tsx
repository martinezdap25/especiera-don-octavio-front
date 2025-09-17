"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import Image from "next/image";
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

        const response = await signIn("credentials", {
            email,
            password,
            redirect: false, // No redirigir automáticamente, lo manejaremos nosotros.
        });

        setLoading(false);

        if (response?.error) {
            // El error por defecto es "CredentialsSignin", lo personalizamos.
            setError("Usuario o contraseña incorrectos.");
        } else if (response?.ok) {
            router.push("/dashboard"); // Redirige al panel de dashboard si el login es exitoso.
        }
    };

    return (
        <div className="flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative bg-white rounded-2xl p-8 sm:p-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Image
                            src="https://res.cloudinary.com/dsugc0qfa/image/upload/v1757541902/Logo-Don-Octavio_aal0rw.png"
                            alt="Don Octavio"
                            width={96}
                            height={96}
                            className="drop-shadow-md"
                        />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-amber-900 mt-4">
                        Panel de Administración
                    </h1>
                    <p className="text-green-600 text-sm mt-1">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">
                            Email
                        </label>
                        <div className="flex items-center border-2 border-amber-200 rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
                            <FiUser className="text-amber-600 mr-3" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@donoctavio.com"
                                className="w-full outline-none bg-transparent text-amber-900 placeholder-amber-900 placeholder:opacity-30"
                                required
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">
                            Contraseña
                        </label>
                        <div className="flex items-center border-2 border-amber-200 rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
                            <FiLock className="text-amber-600 mr-3" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="w-full outline-none bg-transparent text-amber-900 placeholder-amber-900 placeholder:opacity-30"
                                required
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600 text-center pt-2">
                            {error}
                        </p>
                    )}

                    {/* Botón */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors duration-300 disabled:bg-green-200 disabled:cursor-not-allowed"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
