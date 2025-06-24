// components/ListCard.tsx
import React from "react";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCartPlus, faStar } from "@fortawesome/free-solid-svg-icons";

type ListCardProps = {
  image: string;
  title: string;
  sub_title: string;
  price: number;
  link?: string; // optional
};

const ListCard: React.FC<ListCardProps> = ({
  image,
  title,
  sub_title,
  price,
  link = "#",
}) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm shrink-0 md:shrink">
      <a href={link}>
        <img
          className="pb-4 rounded-t-lg w-full h-40 md:h-50 object-cover"
          src={image}
          alt={title}
        />
      </a>
      <div className="px-4 pb-4">
        <a href={link}>
          <h5 className="md:text-xl font-semibold tracking-tight text-gray-800 ">
            {title}
          </h5>
          <p className="text-gray-500 text-wrap text-xs md:text-sm">
            {sub_title}
          </p>
        </a>
        {/* Ratings */}
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <FontAwesomeIcon
              icon={faStar}
              className="w-3 h-3 md:w-3 md:h-4  text-yellow-300"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-3 h-3 md:w-3 md:h-4 text-yellow-300"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-3 h-3 md:w-3 md:h-4 text-yellow-300"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-3 h-3 md:w-3 md:h-4 text-yellow-300"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-3 h-3 md:w-3 md:h-4 text-gray-600"
            />
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
            5.0
          </span>
        </div>
        <div className="flex items-center justify-between">
          {/* Price */}
          <span className="text-2xl font-bold text-gray-700 ">${price}</span>
          <a
            href={link}
            className="hidden md:block text-white bg-red-gvi hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center "
          >
            Add to cart
          </a>
          <a
            href={link}
            className="block md:hidden text-white bg-red-gvi hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center "
          >
            <FontAwesomeIcon icon={faCartPlus} className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
