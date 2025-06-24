// components/DestinationCard.tsx
import React from "react";

type CheckboxProps = {
  title?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ title = "Checkbox" }) => {
  return (
    <div className="flex items-center">
      <input
        // disabled
        // checked
        id="disabled-checked-checkbox"
        type="checkbox"
        value=""
        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-red-500 focus:ring-2 "
      />
      <label
        htmlFor="disabled-checked-checkbox"
        className="ms-2 text-sm font-medium text-gray-600"
      >
        {title}
      </label>
    </div>
  );
};

export default Checkbox;
