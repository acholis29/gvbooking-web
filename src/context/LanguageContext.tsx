// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type masterLanguage = {
  MSLanguage: string;
};

// Tipe data untuk context
type LanguageContextType = {
  language: string;
  setLanguage: (value: string) => void;
  masterLanguage: masterLanguage[];
  setMasterLanguage: (value: masterLanguage[]) => void;
};

// Inisialisasi context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Provider
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("EN"); // default misalnya IDR
  const [masterLanguage, setMasterLanguage] = useState<masterLanguage[]>([
    { MSLanguage: "EN" },
    { MSLanguage: "DE" },
  ]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, masterLanguage, setMasterLanguage }}
    >
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
