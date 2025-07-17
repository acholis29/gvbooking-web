import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import AsyncSelect from "react-select/async";

// Styling custom Tailwind
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#f3f4f6",
    borderRadius: "1.5rem",
    borderColor: "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.5)" : "none",
    "&:hover": {
      borderColor: "#d1d5db",
    },
    padding: "0.25rem",
    minHeight: "2.5rem",
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: "0.875rem",
    color: "#111827",
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
    backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
    color: "#111827",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "0.875rem",
  }),
  input: (base: any) => ({
    ...base,
    fontSize: "0.875rem",
    outline: "none",
    boxShadow: "none",
    border: "none",
    caretColor: "#111827",
    "input:focus": {
      boxShadow: "none", //hilangin border biru
    },
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem",
    color: "#9ca3af",
  }),
};

type OptionType = {
  value: string;
  label: string;
  data?: any;
  icon?: any;
};

type SelectCustomProps = {
  placeholder?: string;
  idx_comp?: string;
  id_excursion?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
};

export default function SelectCustomAsyn({
  placeholder = "Search",
  idx_comp = "",
  id_excursion = "",
  value,
  onChange,
  onBlur,
  name,
  error,
}: SelectCustomProps) {
  const [options, setOptions] = useState<OptionType[]>([]);

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return options;
    const formBody = new URLSearchParams({
      shared_key: idx_comp,
      xml: "false",
      id_excursion: id_excursion,
      keyword: inputValue,
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

      const fetchedOptions = json.msg.map((item: any) => ({
        value: item.location_id,
        label: item.location_name,
        data: item,
        icon: faLocationDot,
      }));

      setOptions(fetchedOptions);
      return fetchedOptions;
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  return (
    <div className="w-full max-w-xs">
      <AsyncSelect
        cacheOptions
        defaultOptions
        isClearable
        loadOptions={loadOptions}
        value={options.find((opt) => opt.value === value) || null}
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
          const selectedOption = selected as OptionType | null;
          onChange?.(selectedOption?.value ?? null);
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        styles={customStyles}
        name={name}
      />
      {error && (
        <div className="h-8">
          <span className="text-red-500 text-xs italic pl-3">{error}</span>
        </div>
      )}
    </div>
  );
}
