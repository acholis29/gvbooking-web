// components/DestinationCard.tsx
import React from "react";

type RangeProps = {
  min?: String;
  max?: String;
};

const Range: React.FC<RangeProps> = ({ min = "0", max = "100" }) => {
  return (
    <div>
      <div className="flex justify-between mb-2 pt-3">
        <label
          htmlFor="minmax-range"
          className="text-sm font-medium text-gray-800 font-semibold"
        >
          Price
        </label>
        <label
          htmlFor="minmax-range"
          className="text-sm font-medium text-gray-700"
        >
          $0–100
        </label>
      </div>
      <input
        id="minmax-range"
        type="range"
        min="0"
        max="100"
        // value="5"
        className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer "
      />
    </div>
  );
};

export default Range;
