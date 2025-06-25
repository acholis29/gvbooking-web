// components/EcommersCard.tsx
import React from "react";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCartPlus,
  faChevronDown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

type EcommersCardProps = {
  image: string;
  title: string;
  sub_title: string;
  price: string;
  link?: string;
};

const EcommersCard: React.FC<EcommersCardProps> = ({
  image,
  title,
  sub_title,
  price,
  link = "#",
}) => {
  return (
    <div className="w-72 max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm shrink-0 md:shrink">
      <a href={link} className="block overflow-hidden rounded-t-lg">
        <img
          className="w-full h-65 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          src={image}
          alt={title}
        />
      </a>

      <div className="px-4 py-4">
        <a href={link}>
          <h5 className="text-lg font-semibold tracking-tight text-gray-800 ">
            {title}
          </h5>
          <p className="text-gray-500 text-wrap text-sm">{sub_title}</p>
        </a>
        {/* Ratings */}
        <div className="flex items-center mt-2.5 mb-2">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <FontAwesomeIcon
              icon={faStar}
              className="w-4 h-4 text-yellow-300"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-4 h-4 text-yellow-300"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-4 h-4 text-yellow-300"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-4 h-4 text-yellow-300"
            />
            <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-gray-600" />
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
            5.0
          </span>
        </div>
        <div className="flex items-center justify-between">
          {/* Price */}
          <span className="text-lg font-bold text-gray-700 ">
            Rp {price} / <span className="font-normal text-sm">Person</span>
          </span>
          <a
            href={link}
            className="text-white bg-red-gvi hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            <FontAwesomeIcon icon={faCartPlus} className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default EcommersCard;
