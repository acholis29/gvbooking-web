// context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type FormData = {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
};
// Tipe data untuk context
type ProfileContextType = {
  profile: FormData;
  setProfile: (value: FormData) => void;
};

// Inisialisasi context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<FormData>({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
  }); // default misalnya IDR

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook untuk gunakan context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile harus digunakan dalam ProfileProvider");
  }
  return context;
};
