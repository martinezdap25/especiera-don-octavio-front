"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useSession, signOut, SessionProvider } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProviderContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const user = session?.user ?? null;
  const token = session?.accessToken ?? null;

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    signOut({ callbackUrl: "/login" });
  }, []);

  useEffect(() => {
    if (status === "authenticated" && token) {
      localStorage.setItem("token", token);
    } else if (status === "unauthenticated") {
      localStorage.removeItem("token");
    }
  }, [status, token]);

  // Listener para errores de autenticación desde Axios
  useEffect(() => {
    const handleAuthError = () => {
      console.error("❌ Evento 'auth-error' capturado → cerrando sesión");
      if (isAuthenticated) {
        logout();
      }
    };
    window.addEventListener("auth-error", handleAuthError);
    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, [isAuthenticated, logout]);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        status,
        isAuthenticated,
        isLoading,
        logout,
      }}
    >
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
