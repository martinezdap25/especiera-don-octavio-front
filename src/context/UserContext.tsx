/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProviderContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const token = (session?.user as any)?.access_token ?? null;

  useEffect(() => {
    console.log("[UserContext] Status changed:", status, "Session:", session);
    if (status === "authenticated" && token) {
      localStorage.setItem("token", token);
    }
    if (status === "unauthenticated") {
      localStorage.removeItem("token");
    }
  }, [session, status, token]);

  const login = async (email: string, password: string) => {
    console.log("[UserContext] 1. Iniciando login para:", email);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("[UserContext] 2. Resultado de signIn:", result);

    if (result?.ok && !result.error) {
      console.log("[UserContext] 3. Login exitoso. Redirigiendo a /dashboard...");
      router.push("/dashboard");
    } else {
      console.error("[UserContext] 3. Falló el login:", result?.error);
      throw new Error(result?.error || "Error al iniciar sesión");
    }
  };

  const logout = () => {
    console.log("[UserContext] Iniciando logout...");
    localStorage.removeItem("token");
    signOut({ callbackUrl: "/" });
  };

  return (
    <UserContext.Provider value={{ token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <UserProviderContent>{children}</UserProviderContent>
    </SessionProvider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};
