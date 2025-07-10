// components/DestinationCard.tsx
import React, { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
type RangeProps = {
  min?: String;
  max?: String;
  value: number;
  onChange: (value: number) => void;
};

const Range: React.FC<RangeProps> = ({
  min = "0",
  max = "100",
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const { currency } = useCurrency();

  return (
    <div className="mb-3">
      <div className="flex justify-between mb-2 pt-3">
        <label
          htmlFor="minmax-range"
          className="text-sm text-gray-800 font-semibold"
        >
          Price{" "}
          <span className="font-normal text-xs">
            ({currency} {" - "}
            {currency == "EUR" ? "€" : currency == "USD" ? "$" : "Rp"})
          </span>
        </label>
        <label
          htmlFor="minmax-range"
          className="text-sm font-medium text-gray-700"
        >
          {value == 0 ? `0` : `0 - ${value}`}
        </label>
      </div>
      <input
        id="minmax-range"
        type="range"
        min={`${min}`}
        max={`${max}`}
        value={`${value}`}
        className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer "
        onChange={handleChange}
      />
    </div>
  );
};

export default Range;
