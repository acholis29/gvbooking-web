import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { capitalizeWords } from "@/helper/helper";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

// Styling custom Tailwind
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderRadius: "0.8rem",
    borderColor: "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.5)" : "none",
    "&:hover": {
      borderColor: "#d1d5db",
    },
    padding: "0.15rem",
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
  // onChange?: (value: string | null) => void;
  onChange?: (value: OptionType | null) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
};

export default function SelectCustomAsynNew({
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
      console.log("JSON = ", json);
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
    <div className="relative w-full max-w-xl">
      <AsyncSelect
        cacheOptions={false} // <- ini kunci
        defaultOptions={true}
        isClearable
        loadOptions={loadOptions}
        value={options.find((opt) => opt.value === value) || null}
        formatOptionLabel={(option) => (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={option.icon}
              className="text-gray-600 w-4 h-4 bg-gray-100 rounded-xl p-3"
            />
            <span className="font-semibold text-xs block">
              {capitalizeWords(option.label ?? "")}
            </span>
          </div>
        )}
        onChange={(selected) => {
          const selectedOption = selected as OptionType | null;
          // onChange?.(selectedOption?.value ?? null);
          onChange?.(selectedOption);
          // Toast Untuk No Service Pickup Avilable
          if (selected?.value == "NA") {
            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } relative max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  {/* Close button */}
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>

                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-blue-500 text-xl">ℹ️</span>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Your pickup area isn’t listed.
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          It looks like we don’t cover this area in our regular
                          pickup service. Please continue your booking and enter
                          your pickup details in the designated field. Once
                          received, our team will reach out to confirm if pickup
                          is possible and let you know if extra charges apply.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ),
              { duration: 8000 } // masih auto close setelah 8 detik
            );
          } else {
            // Tutup semua toast yang masih aktif
            toast.dismiss();
          }
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        styles={customStyles}
        name={name}
      />
      {error && (
        <span className="absolute -bottom-5 left-2 text-red-500 text-xs italic">
          {error}
        </span>
      )}
    </div>
  );
}
