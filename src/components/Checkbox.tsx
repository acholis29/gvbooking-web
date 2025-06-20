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
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor="disabled-checked-checkbox"
        className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500"
      >
        {title}
      </label>
    </div>
  );
};

export default Checkbox;
