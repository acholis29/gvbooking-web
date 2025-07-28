// components/ClientAsyncSelect.tsx
"use client";

import AsyncSelect from "react-select/async";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_HOSTS } from "@/lib/apihost";
// Params
import { useSearchParams } from "next/navigation";
// Path
import { usePathname } from "next/navigation";
import { log } from "console";
// Font Awesome
import {
  faCameraRetro,
  faGlobe,
  faLocationDot,
  faMapMarked,
  faSuitcaseRolling,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Helper
import { capitalizeWords, toLowerCaseAll } from "@/helper/helper";
// Context State Global
import { useDate } from "@/context/DateContext";
import { useLanguage } from "@/context/LanguageContext";

export default function NavbarClientAsyncSelect(props: any) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "home"; //ini dari idx_comp_alias
  const router = useRouter(); // ✅ ini sekarang valid

  const pathname = usePathname();
  const homePage = pathname === "/" || pathname === "/home";

  type OptionType = {
    value: string;
    label: string;
    country?: string;
    state?: string;
    data?: any;
    icon?: any;
  };

  const [idx_comp, setIdxComp] = useState<string>("");
  const [options, setOptions] = useState<OptionType[]>([]);

  // Date
  const { date, setDate } = useDate();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (!id) return;
    setIdxComp(id);
  }, [searchParams, homePage]);

  const loadOptions = async (inputValue: string) => {
    if (homePage) {
      try {
        const res = await fetch(
          `/api/excursion/attr/search?keyword=${inputValue}`, // gunakan '' untuk mendapatkan semua rekomendasi
          {
            cache: "no-store", // ⛔ jangan ambil dari cache
          }
        );

        const json = await res.json();

        const fetchedOptions = json.map((item: any) => ({
          value: item.Idx_excursion,
          label: item.Name_excursion,
          country: item.Country,
          state: item.State,
          data: item,
          icon: faSuitcaseRolling,
        }));

        setOptions(fetchedOptions);
        return fetchedOptions;
      } catch (error) {}
    } else {
      let fetchedOptions = [];
      if (!idx_comp) return [];

      const formBody = new URLSearchParams({
        shared_key:
          idx_comp != "" ? idx_comp : "4D340942-88D3-44DD-A52C-EAF00EACADE8",
        xml: "false",
        date: date, //2025-07-15
        code_of_language: language, //DE, EN
        keyword: inputValue,
        promo_code: "R-BC",
      });

      try {
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_product_search_assist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        const json = await res.json();

        fetchedOptions = json.msg.map((item: any) => ({
          value: item.excursion_id,
          label: item.search_name,
          country: item.location_country,
          state: item.location_state,
          data: item,
          icon:
            item.category == "Country"
              ? faGlobe
              : item.category == "Destination"
              ? faMapMarked
              : item.category == "Most Selling Excursion"
              ? faSuitcaseRolling
              : item.category == "Recommendation"
              ? faCameraRetro
              : faLocationDot,
        }));

        setOptions(fetchedOptions);
        return fetchedOptions;
      } catch (err) {
        console.error("Fetch error:", err);
        return [];
      }
    }
  };
  return (
    <AsyncSelect<OptionType>
      key={idx_comp}
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      placeholder="Find destination"
      isClearable
      formatOptionLabel={(option, { context }) =>
        context === "menu" ? (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={option.icon}
              className="text-gray-600 w-4 h-4 bg-gray-100 rounded-xl p-3"
            />
            <div>
              <span className="font-semibold text-xs block">
                {capitalizeWords(option.label ?? "")}
              </span>
              <span className="text-xs block">
                In {capitalizeWords(option.state ?? "")},{" "}
                {capitalizeWords(option.country ?? "")}
              </span>
            </div>
          </div>
        ) : (
          // Saat selected, tampilkan hanya teks (tanpa icon)
          <div className="text-sm">{capitalizeWords(option.label ?? "")}</div>
        )
      }
      onChange={(selectedOption) => {
        if (homePage) {
          const country = selectedOption?.data.Country;
          const idx_comp_alias = selectedOption?.data.idx_comp;
          const state = selectedOption?.data.State;
          const excursion_id = selectedOption?.data.Idx_excursion;
          if (selectedOption) {
            if (excursion_id) {
              router.push(
                `/destination/detail/${country}?id=${idx_comp_alias}&country=${country}&state=${state}&exc=${excursion_id}`
              );
            } else {
              router.push(
                `/list?id=${idx_comp}&country=${toLowerCaseAll(
                  country
                )}&state=${state}`
              );
            }
          }
        } else {
          const country = selectedOption?.data.location_country;
          const idx_comp_alias = idx_comp;
          const state = selectedOption?.data.location_state;
          const excursion_id = selectedOption?.data.excursion_id;
          // Data untuk ke detail masih salah
          if (selectedOption) {
            if (excursion_id) {
              router.push(
                `/destination/detail/${country}?id=${idx_comp_alias}&country=${country}&state=${state}&exc=${excursion_id}`
              );
            } else {
              router.push(
                `/list?id=${idx_comp}&country=${toLowerCaseAll(
                  country
                )}&state=${state}`
              );
            }
          }
        }
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
        singleValue: (base: any) => ({
          ...base,
          display: "block", // Atur agar icon tidak tampil
          fontSize: "0.875rem",
          color: "#111827",
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
