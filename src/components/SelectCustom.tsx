import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toLowerCaseAll } from "@/helper/helper";
import { log } from "console";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChild, faBaby } from "@fortawesome/free-solid-svg-icons";

const customStyles = {
  container: (base: any) => ({
    ...base,
    width: "100%",
  }),
  control: (base: any, state: any) => ({
    ...base,
    width: "100%",
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

type Option = {
  value: string;
  label: string;
};

type SelectCustomProps = {
  placeholder?: string;
  max_pax?: number;
  age_from?: number;
  age_to?: number;
  onSelect?: (value: string) => void;
};

export default function SelectCustom({
  placeholder = "",
  max_pax = 1,
  age_from = 1,
  age_to = 1,
  onSelect,
}: SelectCustomProps) {
  const [selectedPerson, setSelectedPerson] = useState<number>(0);
  const [ages, setAges] = useState<(string | null)[]>([]);

  const options = Array.from({ length: max_pax }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1} ${i + 1 > 1 ? placeholder + "s" : placeholder}`,
    icon:
      placeholder.toLowerCase() === "adult"
        ? faUser
        : placeholder.toLowerCase() === "child"
        ? faChild
        : faBaby,
  }));

  useEffect(() => {
    if (toLowerCaseAll(placeholder) == "child") {
      onSelect?.("0");
    }

    if (toLowerCaseAll(placeholder) == "infant") {
      onSelect?.("0");
    }

    if (toLowerCaseAll(placeholder) == "adult") {
      onSelect?.("1");
    }
  }, []);

  useEffect(() => {
    if (selectedPerson > 0) {
      const defaultAges = Array.from(
        { length: selectedPerson },
        () => `${age_to}`
      );
      setAges(defaultAges);

      // langsung panggil onSelect juga
      onSelect?.(
        JSON.stringify({
          count: selectedPerson,
          ages: defaultAges,
        })
      );
    }
  }, [selectedPerson]);

  return (
    <div className="w-full md:w-44 mb-2">
      {toLowerCaseAll(placeholder) == "adult" && (
        <Select
          defaultValue={options.find((opt) => opt.value === "1")}
          options={options}
          styles={customStyles}
          placeholder={placeholder}
          // isClearable
          formatOptionLabel={(option) => (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={option.icon}
                className="text-gray-600 w-2 h-2 px-1"
              />
              <span>{option.label}</span>
            </div>
          )}
          onChange={(selected) => {
            if (selected) {
              const val = selected.value;
              onSelect?.(val);
            } else {
              onSelect?.("0");
            }
          }}
        />
      )}

      {toLowerCaseAll(placeholder) == "child" && (
        <Select
          options={options}
          styles={customStyles}
          placeholder={placeholder}
          isClearable
          formatOptionLabel={(option) => (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={option.icon}
                className="text-gray-600 w-4 h-4"
              />
              <span>{option.label}</span>
            </div>
          )}
          onChange={(selected) => {
            if (selected) {
              const val = parseInt(selected.value);
              setSelectedPerson(val);
              setAges(Array(val).fill(null)); // reset umur sesuai jumlah anak
              onSelect?.(JSON.stringify({ count: val, ages: [] })); // optional: kirim awal
            } else {
              setSelectedPerson(0);
              setAges([]);
              onSelect?.(JSON.stringify({ count: 0, ages: [] }));
            }
          }}
        />
      )}

      {toLowerCaseAll(placeholder) == "infant" && (
        <Select
          options={options}
          styles={customStyles}
          placeholder={placeholder}
          isClearable
          onChange={(selected) => {
            if (selected) {
              const val = selected.value;
              onSelect?.(val);
            } else {
              onSelect?.("");
            }
          }}
        />
      )}

      {/* Select Umur (muncul setelah memilih jumlah orang) */}
      {selectedPerson != 0 &&
        Array.from({ length: selectedPerson }, (_, index) => (
          <Select
            key={index}
            className="mt-2"
            styles={customStyles}
            placeholder={`Age child ${index + 1}`}
            options={Array.from({ length: age_to - age_from + 1 }, (_, i) => ({
              value: `${i + age_from}`,
              label: `${i + age_from} Years`,
            }))}
            value={
              ages[index]
                ? { value: ages[index], label: `${ages[index]} Years` }
                : { value: `${age_to}`, label: `${age_to} Years` }
            }
            // isClearable
            onChange={(selected) => {
              const updated = [...ages];
              updated[index] = selected?.value ?? null;
              setAges(updated);
              onSelect?.(
                JSON.stringify({
                  count: selectedPerson,
                  ages: updated.filter(Boolean),
                })
              );
            }}
          />
        ))}
    </div>
  );
}
