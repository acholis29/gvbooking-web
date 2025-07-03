// components/ListCard.tsx
"use client"; // jika kamu pakai app directory

import { useEffect, useState } from "react";
import React from "react";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCartPlus,
  faHeart,
  faPerson,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// State Global / Context
import { useCart } from "@/context/CartContext";

type ListCardProps = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
  link?: string; // optional
};

const ListCard: React.FC<ListCardProps> = ({
  idx_comp,
  idx_excursion,
  image,
  title,
  sub_title,
  price,
  currency,
  link = "#",
}) => {
  // Data Produk Add To Cart
  const data = {
    idx_comp: idx_comp ?? "",
    idx_excursion: idx_excursion ?? "",
    title: title ?? "",
    sub_title: sub_title ?? "",
    price: price ?? "",
    currency: currency ?? "",
  };

  const { addToCart, removeFromCart } = useCart();

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm shrink-0 md:shrink flex flex-col h-full">
      <a href={link} className="relative block overflow-hidden rounded-t-lg">
        <img
          className="w-full h-40 md:h-50 object-cover transition-transform duration-300 ease-in-out hover:scale-150"
          src={image}
          alt={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/images/icon/android-chrome-512x512.png";
          }}
        />

        {/* Wishlist button - posisi atas kanan gambar */}
        <button
          type="button"
          className="absolute top-2 right-2 text-white hover:text-red-500 hover:border-red-500 p-2 rounded-full transition"
          aria-label="Add to wishlist"
        >
          <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
        </button>
      </a>

      <div className="px-4 pb-4 flex flex-col flex-grow mt-3">
        <a href={link}>
          <h5
            className="text-sm md:text-sm font-semibold tracking-tight text-gray-800 min-h-[30px] truncate"
            title={title}
          >
            {title}
          </h5>

          <p className="text-gray-500 text-wrap text-xs md:text-xs min-h-[36px]">
            {sub_title}
          </p>
        </a>

        {/* Ratings */}
        {/* <div className="flex items-center mt-2.5 mb-2">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            {[...Array(4)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className="inline-block !w-3 !h-3 md:!w-4 md:!h-4 text-yellow-300"
              />
            ))}
            <FontAwesomeIcon
              icon={faStar}
              className="inline-block !w-3 !h-3 md:!w-4 md:!h-4 text-gray-600"
            />
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
            5.0
          </span>
        </div> */}

        {/* Bottom: harga dan tombol */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-auto">
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
            onClick={() => addToCart(data)} // ✅ benar: hanya dipanggil saat diklik
            className="w-full md:w-auto text-white bg-red-gvi hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center"
          >
            <FontAwesomeIcon icon={faCartPlus} className="w-4 h-4 text-white" />{" "}
            <span className="md:hidden">Add</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
