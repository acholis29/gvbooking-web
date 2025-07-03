"use client";
import { createContext, useContext, useEffect, useState } from "react";

type WishItem = {
  idx_comp: string;
  idx_excursion: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
};

type WishContextType = {
  wishItems: WishItem[];
  wishCount: number;
  addToWish: (item: WishItem) => void;
  removeFromWish: (idx_excursion: string) => void;
};

const WishContext = createContext<WishContextType | undefined>(undefined);

export function WishProvider({ children }: { children: React.ReactNode }) {
  const [wishItems, setWishItems] = useState<WishItem[]>([]);

  useEffect(() => {
    const storedWish = JSON.parse(localStorage.getItem("wish") || "[]");
    setWishItems(storedWish);
  }, []);

  const saveWish = (items: WishItem[]) => {
    localStorage.setItem("wish", JSON.stringify(items));
    setWishItems(items);
  };

  const addToWish = (item: WishItem) => {
    const updated = [item, ...wishItems];
    saveWish(updated);
  };

  const removeFromWish = (idx_excursion: string) => {
    const updated = wishItems.filter((i) => i.idx_excursion !== idx_excursion);
    saveWish(updated);
  };

  return (
    <WishContext.Provider
      value={{
        wishItems,
        wishCount: wishItems.length,
        addToWish,
        removeFromWish,
      }}
    >
      {children}
    </WishContext.Provider>
  );
}

// Custom hook biar gampang akses context
export function useWish() {
  const context = useContext(WishContext);
  if (!context) {
    throw new Error("useWish must be used within a WishProvider");
  }
  return context;
}
