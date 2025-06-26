// components/ListCard.tsx
import React from "react";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCartPlus,
  faPerson,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

type ListCardProps = {
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
  link?: string; // optional
};

const ListCard: React.FC<ListCardProps> = ({
  image,
  title,
  sub_title,
  price,
  currency,
  link = "#",
}) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm shrink-0 md:shrink flex flex-col h-full">
      <a href={link}>
        <img
          className="pb-4 rounded-t-lg w-full h-40 md:h-50 object-cover"
          src={image}
          alt={title}
        />
      </a>
      <div className="px-4 pb-4 flex flex-col flex-grow">
        <a href={link}>
          <h5 className="text-md font-semibold tracking-tight text-gray-800 min-h-[40px]">
            {title}
          </h5>
          <p className="text-gray-500 text-wrap text-xs md:text-sm min-h-[36px]">
            {sub_title}
          </p>
        </a>

        {/* Ratings */}
        <div className="flex items-center mt-2.5 mb-2">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            {[...Array(4)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className="w-4 h-4 text-yellow-300"
              />
            ))}
            <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-gray-600" />
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
            5.0
          </span>
        </div>

        {/* Bottom: harga dan tombol */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-md font-bold text-gray-700">
            {currency} {price} /{" "}
            <span className="font-normal text-sm">
              <FontAwesomeIcon
                icon={faUser}
                className="w-4 h-4 text-gray-600"
              />
            </span>
          </span>
          <a
            href={link}
            className="text-white bg-red-gvi hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <FontAwesomeIcon icon={faCartPlus} className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
