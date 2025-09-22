/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

interface UserContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProviderContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const token = (session?.user as any)?.access_token ?? null;

  useEffect(() => {
    if (status === "authenticated" && token) {
      localStorage.setItem("token", token);
    }
    if (status === "unauthenticated") {
      localStorage.removeItem("token");
    }
  }, [session, status, token]);

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok && !result.error) {
      window.location.href = "/dashboard";
    }
  };

  const logout = () => {
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
