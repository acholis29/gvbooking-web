// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipe data untuk context
type InitialContextType = {
  agent: string;
  setAgent: (value: string) => void;
  repCode: string;
  setRepCode: (value: string) => void;
};

// Inisialisasi context
const InitialContext = createContext<InitialContextType | undefined>(undefined);

// Provider
export const InitialProvider = ({ children }: { children: ReactNode }) => {
  const [agent, setAgent] = useState(""); // default misalnya IDR
  const [repCode, setRepCode] = useState(""); // default misalnya IDR

  return (
    <InitialContext.Provider value={{ agent, setAgent, repCode, setRepCode }}>
      {children}
    </InitialContext.Provider>
  );
};

// Hook untuk gunakan context
export const useInitial = () => {
  const context = useContext(InitialContext);
  if (!context) {
    throw new Error("useInitial harus digunakan dalam InitialProvider");
  }
  return context;
};
