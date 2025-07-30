// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipe data untuk context
type AgentContextType = {
  agent: string;
  setAgent: (value: string) => void;
};

// Inisialisasi context
const AgentContext = createContext<AgentContextType | undefined>(undefined);

// Provider
export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agent, setAgent] = useState(""); // default misalnya IDR

  return (
    <AgentContext.Provider value={{ agent, setAgent }}>
      {children}
    </AgentContext.Provider>
  );
};

// Hook untuk gunakan context
export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent harus digunakan dalam AgentProvider");
  }
  return context;
};
