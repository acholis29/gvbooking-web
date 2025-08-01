// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipe data untuk context
type SeasonContextType = {
  voucherNumber: string;
  setVoucherNumber: (value: string) => void;
  masterFileId: string;
  setMasterFileId: (value: string) => void;
};

// Inisialisasi context
const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

// Provider
export const SeasonProvider = ({ children }: { children: ReactNode }) => {
  const [voucherNumber, setVoucherNumber] = useState("");
  const [masterFileId, setMasterFileId] = useState("");

  return (
    <SeasonContext.Provider
      value={{ voucherNumber, setVoucherNumber, masterFileId, setMasterFileId }}
    >
      {children}
    </SeasonContext.Provider>
  );
};

// Hook untuk gunakan context
export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error("useSeason harus digunakan dalam SeasonProvider");
  }
  return context;
};
