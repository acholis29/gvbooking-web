// components/ClientAsyncSelect.tsx
"use client";

import AsyncSelect from "react-select/async";
import React, { useState } from "react";

export default function NavbarClientAsyncSelect(props: any) {
  // const destinations = [
  //   { label: "San Diego", value: "san-diego" },
  //   { label: "San Francisco", value: "san-francisco" },
  //   { label: "Santa Monica", value: "santa-monica" },
  //   { label: "Seattle", value: "seattle" },
  //   { label: "Sacramento", value: "sacramento" },
  //   { label: "Santiago", value: "santiago" },
  //   { label: "Sandakan", value: "sandakan" },
  // ];

  // const loadOptions = (
  //   inputValue: string,
  //   callback: (options: any[]) => void
  // ) => {
  //   setTimeout(() => {
  //     const filtered = destinations.filter((item) =>
  //       item.label.toLowerCase().includes(inputValue.toLowerCase())
  //     );
  //     callback(filtered);
  //   }, 500); // Simulasi async
  // };

  type OptionType = {
    value: string;
    label: string;
    data?: any;
  };
  const [options, setOptions] = useState<OptionType[]>([]);
  const loadOptions = async (inputValue: string) => {
    // if (!inputValue) return options;
    const formBody = new URLSearchParams({
      shared_key: "4D340942-88D3-44DD-A52C-EAF00EACADE8",
      xml: "false",
      date: "2025-07-15",
      code_of_language: "DE",
      keyword: inputValue,
      promo_code: "R-BC",
    });

    try {
      const res = await fetch(
        "https://api.govacation.biz/excursion.asmx//v2_product_search_assist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody.toString(),
        }
      );

      const json = await res.json();

      const fetchedOptions = json.msg.map((item: any) => ({
        value: item.excursion_id,
        label: item.search_name,
        data: item,
      }));

      setOptions(fetchedOptions);
      return fetchedOptions;
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };
  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      placeholder="Search your destinations..."
      isClearable
      onChange={(selectedOption) => {
        console.log("Selected:", selectedOption);
      }}
      styles={{
        control: (base: any, state: any) => ({
          ...base,
          borderTopRightRadius: "0.5rem", // sama dengan Tailwind: rounded-tr-lg
          borderBottomRightRadius: "0.5rem", // Tailwind: rounded-br-lg
          borderTopLeftRadius: "0", // hilangkan radius kiri
          borderBottomLeftRadius: "0",
          borderColor: state.isFocused ? "#d1d5db" : "#d1d5db", // Tailwind: blue-500 / gray-300
          boxShadow: state.isFocused
            ? "0 0 0 2px rgba(59,130,246,0.5)"
            : "none", // ring
          "&:hover": {
            borderColor: "#d1d5db",
          },
          padding: "2px",
          backgroundColor: "#f3f4f6", // Tailwind: bg-gray-100
          // borderColor: "#d1d5db", // Tailwind: border-gray-300
        }),
        menu: (base: any) => ({
          ...base,
          zIndex: 50, // atau 9999 untuk pastikan di atas semua
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
      }}
    />
  );
}
