import React from "react";

type ChipsProps = {
  id?: string;
  bgColor?: string;
  textColor?: string;
  title?: string;
};

const Chips: React.FC<ChipsProps> = ({
  id,
  bgColor = "bg-gray-300",
  textColor = "text-black",
  title = "Badge",
}) => {
  const chipId = id || `badge-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <span
      id={chipId}
      className={`inline-flex items-center mt-2 px-2 py-1 me-2 text-sm font-medium rounded-sm ${bgColor} ${textColor}`}
    >
      {title}
      <button
        type="button"
        className="inline-flex items-center p-1 ms-2 text-sm text-gray-400 bg-transparent rounded-xs hover:bg-gray-200 hover:text-gray-900 "
        data-dismiss-target={`#${chipId}`}
        aria-label="Remove"
      >
        <svg
          className="w-2 h-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Remove badge</span>
      </button>
    </span>
  );
};

export default Chips;
