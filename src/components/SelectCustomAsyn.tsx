import { log } from "console";
import React, { useState } from "react";
import AsyncSelect from "react-select/async";

const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#f3f4f6", // Tailwind: bg-gray-100
    borderRadius: "1.5rem", // Tailwind: rounded-2xl
    borderColor: state.isFocused ? "#d1d5db" : "#d1d5db", // Tailwind: blue-500 / gray-300
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.5)" : "none", // ring
    "&:hover": {
      borderColor: "#d1d5db",
    },
    padding: "0.25rem",
    minHeight: "2.5rem",
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: "0.875rem", // Tailwind: text-sm
    color: "#111827", // Tailwind: text-gray-900
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.75rem",
    padding: "0.25rem",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#e5e7eb" : "#fff", // hover: bg-gray-200
    color: "#111827", // Tailwind: text-gray-900
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "0.875rem", // Tailwind: text-sm (14px)
  }),
  input: (base: any) => ({
    ...base,
    fontSize: "0.875rem",
    outline: "none", // ⛔ hilangkan blue box
    boxShadow: "none", // ⛔ hilangkan shadow
    border: "none",
    caretColor: "#111827", // ✅ warna cursor (opsional, Tailwind: text-gray-900)
    "input:focus": {
      boxShadow: "none",
    },
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem", // Tailwind: text-sm
    color: "#9ca3af", // Tailwind: text-gray-400
  }),
};

type SelectCustomProps = {
  placeholder?: string;
  idx_comp?: string;
  id_excursion?: string;
  onSelect?: (value: string) => void;
};

type OptionType = {
  value: string;
  label: string;
  data?: any; // kalau kamu tambahkan info pickup extra
};

// Select Asyncronus Pickup Area
export default function SelectCustomAsyn({
  placeholder = "Search",
  idx_comp = "",
  id_excursion = "",
  onSelect,
}: SelectCustomProps) {
  const [options, setOptions] = useState<OptionType[]>([]);
  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return options; // gunakan opsi terakhir jika input kosong
    const formBody = new URLSearchParams({
      shared_key: idx_comp,
      xml: "false",
      id_excursion: id_excursion,
      keyword: inputValue, // diketik user
    });

    try {
      const res = await fetch(
        "https://api.govacation.biz/excursion.asmx/v2_product_pickup_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody.toString(),
        }
      );

      const json = await res.json();

      // Ubah ke format react-select
      return json.msg.map((item: any) => ({
        value: item.location_id,
        label: item.location_name,
        data: item, // bisa kamu pakai nanti
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  return (
    <div className="w-72">
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={(selected) => {
          const selectedOption = selected as OptionType;
          console.log("Selected:", selectedOption.value, selectedOption.label);
          onSelect?.(selectedOption.value); // ← kirim ke parent (form)
        }}
        placeholder={placeholder}
        styles={customStyles}
      />
    </div>
  );
}
