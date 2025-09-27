import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para añadir el token a las peticiones
instance.interceptors.request.use(
    (config) => {
        // Solo se ejecuta en el cliente
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación (401, 403)
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            // En lugar de una redirección forzada, disparamos un evento personalizado.
            // El UserContext escuchará este evento para cerrar la sesión de forma controlada.
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                window.dispatchEvent(new CustomEvent('auth-error', { detail: { status: error.response.status } }));
            }
        }
        return Promise.reject(error);
    }
);

export default instance;