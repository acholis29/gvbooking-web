// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipe data untuk context
type DateContextType = {
  date: string;
  setDate: (value: string) => void;
};

// Inisialisasi context
const DateContext = createContext<DateContextType | undefined>(undefined);

// Provider
export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useState(""); // default misalnya IDR

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};

// Hook untuk gunakan context
export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate harus digunakan dalam DateProvider");
  }
  return context;
};
