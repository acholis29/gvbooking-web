"use client";
import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  idx_comp: string;
  idx_excursion: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  addManyToCart: (items: CartItem[]) => void;
  removeFromCart: (idx_excursion: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
  };

  const addToCart = (item: CartItem) => {
    const updated = [item, ...cartItems];
    saveCart(updated);
  };

  const addManyToCart = (items: CartItem[]) => {
    const storedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as CartItem[];
    const updated = [...items, ...storedCart];
    saveCart(updated);
  };

  const removeFromCart = (idx_excursion: string) => {
    const updated = cartItems.filter((i) => i.idx_excursion !== idx_excursion);
    saveCart(updated);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        addToCart,
        addManyToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook biar gampang akses context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
