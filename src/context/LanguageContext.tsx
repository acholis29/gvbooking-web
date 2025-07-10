// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipe data untuk context
type LanguageContextType = {
  language: string;
  setLanguage: (value: string) => void;
};

// Inisialisasi context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Provider
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("ID"); // default misalnya IDR

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook untuk gunakan context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage harus digunakan dalam LanguageProvider");
  }
  return context;
};
