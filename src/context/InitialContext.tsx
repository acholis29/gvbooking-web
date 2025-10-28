// context/CurrencyContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type coreType = {
  app_name: string;
  intl: string;
  name: string;
  country: string;
  countryCode: string;
  idx_comp: string;
  idx_comp_alias: string;
  url_img_team: string;
  url_img: string;
  phone_code: string;
  def_curr: string;
  payontour: string;
  min_daypayontour: string;
  status: string;
};

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

type representativeType = {
  representative_id: string;
  representative_code: string;
  representative_name: string;
  biography: string;
  email: string;
  favorite_product: string;
  join_date: string; // format: "YYYY-MM-DD"
  language1: string;
  language2: string;
  mobile1: string;
  mobile2: string;
  photo: string;
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
  coreInitial: coreType[];
  setCoreInitial: (value: coreType[]) => void;
  representative: representativeType[];
  setRepresentative: (value: representativeType[]) => void;
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

  const [coreInitial, setCoreInitial] = useState<coreType[]>([
    {
      app_name: "",
      intl: "",
      name: "",
      country: "",
      countryCode: "",
      idx_comp: "",
      idx_comp_alias: "",
      url_img_team: "",
      url_img: "",
      phone_code: "",
      def_curr: "",
      payontour: "",
      min_daypayontour: "",
      status: "",
    },
  ]);

  const [representative, setRepresentative] = useState<representativeType[]>([
    {
      representative_id: "",
      representative_code: "",
      representative_name: "",
      biography: "",
      email: "",
      favorite_product: "",
      join_date: "", // format: "YYYY-MM-DD"
      language1: "",
      language2: "",
      mobile1: "",
      mobile2: "",
      photo: "",
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
        coreInitial,
        setCoreInitial,
        representative,
        setRepresentative,
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
