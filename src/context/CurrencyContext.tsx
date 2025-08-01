// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type masterCurrency = {
  Currency: string;
};

// Tipe data untuk context
type CurrencyContextType = {
  currency: string;
  setCurrency: (value: string) => void;
  masterCurrency: masterCurrency[];
  setMasterCurrency: (value: masterCurrency[]) => void;
};

// Inisialisasi context
const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// Provider
export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState("EUR"); // default misalnya EUR
  const [masterCurrency, setMasterCurrency] = useState<masterCurrency[]>([
    { Currency: "USD" },
    { Currency: "EUR" },
  ]);

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, masterCurrency, setMasterCurrency }}
    >
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
