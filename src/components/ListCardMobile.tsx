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
import { useWish } from "@/context/WishContext";
// Toast
import toast from "react-hot-toast";
import Link from "next/link";

type ListCardMobileProps = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
  link?: string; // optional
  colorWish?: boolean;
};

const ListCardMobile: React.FC<ListCardMobileProps> = ({
  idx_comp,
  idx_excursion,
  image,
  title,
  sub_title,
  price,
  currency,
  link = "#",
  colorWish = false,
}) => {
  // Data Produk Add To Cart
  const data = {
    idx_comp: idx_comp ?? "",
    idx_excursion: idx_excursion ?? "",
    title: title ?? "",
    sub_title: sub_title ?? "",
    price: price ?? "",
    currency: currency ?? "",
    link: link ?? "#",
    image: image ?? "/images/icon/android-chrome-512x512.png",
  };

  const { addToCart } = useCart();
  const { addToWish, removeFromWish } = useWish();

  // State Data Loading
  const [isWish, setIsWish] = useState(false);

  useEffect(() => {
    setIsWish(colorWish);
  }, []);

  return (
    <div className="w-full h-45 bg-gray-100 shadow-md flex hover:bg-gray-200">
      <div className="w-[40%] h-50">
        <div className="p-2 relative">
          <Link
            href={link}
            className="relative block overflow-hidden rounded-sm"
          >
            <img
              className="object-cover w-full rounded-sm h-40 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg transition-transform duration-300 ease-in-out hover:scale-115"
              src={image}
              alt={title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/images/icon/android-chrome-512x512.png";
              }}
            />
          </Link>
          {/* Wishlist button - posisi atas kanan gambar */}
          <button
            type="button"
            onClick={() => {
              if (!isWish) {
                addToWish(data);
                setIsWish(!isWish);
                toast.success("Save to wishlist!");
              } else {
                removeFromWish(idx_excursion);
                setIsWish(!isWish);
                toast.success("Save to wishlist!");
              }
            }}
            className={`absolute top-1 right-1 cursor-pointer ${
              isWish ? "text-red-500" : "text-white"
            } hover:text-red-500 hover:border-red-500 p-2 rounded-full transition`}
            aria-label="Add to wishlist"
          >
            <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="w-[60%] h-50 py-2 px-2">
        <Link href={link}>
          <h5 className="mb-2 text-md font-bold tracking-tight text-gray-700 ">
            {title}
          </h5>
          <p className="mb-3 text-xs text-gray-700 pr-4">{sub_title}</p>
          <p className="text-xs text-gray-500">From</p>
          <p className="text-gray-700">
            <span className="font-bold text-md">
              {currency} {price}
            </span>
            <span className="font-semibold text-xs"> / per person</span>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ListCardMobile;
