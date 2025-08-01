// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipe data untuk context
type SelectModalContextType = {
  selectModal: string;
  setSelectModal: (value: string) => void;
};

// Inisialisasi context
const SelectModalContext = createContext<SelectModalContextType | undefined>(
  undefined
);

// Provider
export const SelectModalProvider = ({ children }: { children: ReactNode }) => {
  const [selectModal, setSelectModal] = useState(""); // default misalnya

  return (
    <SelectModalContext.Provider value={{ selectModal, setSelectModal }}>
      {children}
    </SelectModalContext.Provider>
  );
};

// Hook untuk gunakan context
export const useSelectModal = () => {
  const context = useContext(SelectModalContext);
  if (!context) {
    throw new Error("useSelectModal harus digunakan dalam SelectModalProvider");
  }
  return context;
};
