/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface UserContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  const token = (session?.user as any)?.access_token ?? null;

  const login = async (email: string, password: string) => {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <UserContext.Provider value={{ token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};
