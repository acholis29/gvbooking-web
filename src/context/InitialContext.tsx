// context/CurrencyContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type resourceType = {
  url_bo: string;
  url_fo: string;
  url_b2c: string;
  url_payment: string;
  url_img_team: string;
  agent_id: string;
  company_code: string;
  app_string: string;
  app_demo: string;
};

type profileType = {
  idx_mf: string;
  email: string;
  phone: string;
  voucher: string;
};

// Tipe data untuk context
type InitialContextType = {
  agent: string;
  setAgent: (value: string) => void;
  repCode: string;
  setRepCode: (value: string) => void;
  resourceInitial: resourceType;
  setResourceInitial: (value: resourceType) => void;
  profileInitial: profileType[];
  setProfileInitial: (value: profileType[]) => void;
};

// Inisialisasi context
const InitialContext = createContext<InitialContextType | undefined>(undefined);

// Provider
export const InitialProvider = ({ children }: { children: ReactNode }) => {
  const [agent, setAgent] = useState(""); // default misalnya IDR
  const [repCode, setRepCode] = useState(""); // default misalnya IDR
  const [resourceInitial, setResourceInitial] = useState<resourceType>({
    url_bo: "",
    url_fo: "",
    url_b2c: "",
    url_payment: "",
    url_img_team: "",
    agent_id: "",
    company_code: "",
    app_string: "",
    app_demo: "",
  });

  const [profileInitial, setProfileInitial] = useState<profileType[]>([
    {
      idx_mf: "",
      email: "",
      phone: "",
      voucher: "",
    },
  ]);

  return (
    <InitialContext.Provider
      value={{
        agent,
        setAgent,
        repCode,
        setRepCode,
        resourceInitial,
        setResourceInitial,
        profileInitial,
        setProfileInitial,
      }}
    >
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
