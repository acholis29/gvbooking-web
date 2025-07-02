// components/HorizontalCard.tsx
import React from "react";
type HorizontalCardProps = {
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency: string;
  link?: string; // optional
};

const HorizontalCard: React.FC<HorizontalCardProps> = ({
  image,
  title,
  sub_title,
  price,
  currency,
  link = "#",
}) => {
  return (
    <a
      href={link}
      className="flex flex-row items-start bg-white border border-gray-200 rounded-lg shadow-sm md:max-w-3xl hover:bg-gray-100 mb-3"
    >
      <img
        className="w-30 h-40 p-2 object-cover rounded-2xl"
        src={image}
        alt={image}
      />
      <div className="flex flex-col w-full p-2 leading-normal">
        <h5 className="mb-2 text-sm md:text-md md:text-1xl font-bold tracking-tight text-gray-900">
          {title}
        </h5>
        <p className="text-xs md:text-sm text-gray-700">{sub_title}</p>
        <p className="text-xs md:text-sm text-gray-700">
          Thursday, July 10, 2025・13:30
        </p>
        <p className="text-xs md:text-sm text-gray-700">2 Adult</p>
        <p className="text-xs md:text-sm text-gray-700">Language: English</p>
        <p className="text-md md:text-2xl font-bold text-gray-700 text-right pr-2">
          {currency} {price}
        </p>
      </div>
    </a>
  );
};

export default HorizontalCard;
