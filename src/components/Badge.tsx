// components/DestinationCard.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import React from "react";

type BadgeProps = {
  bgColor?: string;
  textColor?: string;
  title?: string;
};

const Badge: React.FC<BadgeProps> = ({
  bgColor = "bg-gray-500",
  textColor = "text-white",
  title = "Badge",
}) => {
  return (
    <span
      className={`text-xs font-medium me-2 px-2.5 py-2 rounded-sm ${bgColor} ${textColor}`}
    >
      <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-white" /> {title}
    </span>
  );
};

export default Badge;
