// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipe data untuk context
type CurrencyContextType = {
  currency: string;
  setCurrency: (value: string) => void;
};

// Inisialisasi context
const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// Provider
export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState("IDR"); // default misalnya IDR

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Hook untuk gunakan context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency harus digunakan dalam CurrencyProvider");
  }
  return context;
};
