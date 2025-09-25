"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthComponent = (props: P) => {
    const { token, logout } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!token) {
        router.replace("/login");
        setIsLoading(false); // Detener la carga si no hay token
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
          logout();
          router.replace("/login");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
        router.replace("/login");
      }
    }, [token, logout, router]);

    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-5rem)] bg-gray-100">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-amber-800">
            Cargando...
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;