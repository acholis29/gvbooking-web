import React from "react";

type CheckboxProps = {
  title?: string;
  checked?: boolean;
  onChange?: (checked: boolean, title: string) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({
  title = "Checkbox",
  checked = false,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked, title);
  };

  return (
    <div className="flex items-center mb-2">
      <input
        id={`checkbox-${title}`}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-red-500 focus:ring-2"
      />
      <label
        htmlFor={`checkbox-${title}`}
        className="ms-2 text-sm font-medium text-gray-600"
      >
        {title}
      </label>
    </div>
  );
};

export default Checkbox;
