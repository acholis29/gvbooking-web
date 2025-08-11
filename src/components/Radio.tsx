import React from "react";

type RadioProps = {
  title?: string;
  checked?: boolean;
  value?: string;
  onChange?: (checked: boolean, title: string, value: string) => void;
};

const Radio: React.FC<RadioProps> = ({
  title = "Radio",
  checked = false,
  value = "",
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked, title, value);
  };

  return (
    <div className="flex items-center mb-2">
      <input
        id={`radio-${title}`}
        name="radioHolidayType"
        type="radio"
        onChange={handleChange}
        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-red-500 focus:ring-2"
      />
      <label
        htmlFor={`radio-${title}`}
        className="ms-2 text-sm font-medium text-gray-600"
      >
        {title}
      </label>
    </div>
  );
};

export default Radio;
