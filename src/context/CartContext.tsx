// context/CartContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  unitType: "grams" | "unit";
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (itemToAdd: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === itemToAdd.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === itemToAdd.id ? { ...i, quantity: i.quantity + itemToAdd.quantity } : i
        );
      }
      return [...prevCart, itemToAdd];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default useCart;
