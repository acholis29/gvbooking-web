import React from "react";
import Select from "react-select";

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

type Option = {
  value: string;
  label: string;
};

type SelectCustomProps = {
  placeholder?: string;
  options: Option[];
  onSelect?: (value: string) => void;
};

export default function SelectCustom({
  placeholder,
  options,
  onSelect,
}: SelectCustomProps) {
  return (
    <div className="w-72">
      <Select
        options={options}
        styles={customStyles}
        placeholder={placeholder}
      />
    </div>
  );
}
