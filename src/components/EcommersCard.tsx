// components/EcommersCard.tsx
import React from "react";
import { useEffect, useState } from "react";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faHeart,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// State Global / Context
import { useCart } from "@/context/CartContext";
import { useWish } from "@/context/WishContext";

type EcommersCardProps = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
  link?: string;
  colorWish?: boolean;
};

const EcommersCard: React.FC<EcommersCardProps> = ({
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
  // Data Produk Untuk Add To Cart
  const data = {
    idx_comp: idx_comp ?? "",
    idx_excursion: idx_excursion ?? "",
    title: title ?? "",
    sub_title: sub_title ?? "",
    price: price ?? "",
    currency: currency ?? "",
  };

  const { addToCart } = useCart();
  const { addToWish, removeFromWish } = useWish();

  // State Data Loading
  const [isWish, setIsWish] = useState(colorWish);

  useEffect(() => {
    setIsWish(colorWish);
  }, [colorWish]); // ← penting: hanya update ketika colorWish berubah
  console.log("isWish :" + isWish);

  return (
    <div className="relative w-72 md:w-auto max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm shrink-0 md:shrink flex flex-col h-full">
      <a href={link} className="relative block overflow-hidden rounded-t-lg">
        <img
          className="w-full h-65 object-cover transition-transform duration-300 ease-in-out hover:scale-150"
          src={image}
          alt={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/images/icon/android-chrome-512x512.png";
          }}
        />
      </a>
      {colorWish.toString()}
      {/* Wishlist button - posisi atas kanan gambar */}
      <button
        type="button"
        onClick={() => {
          if (!isWish) {
            addToWish(data);
            setIsWish(!isWish);
          } else {
            removeFromWish(idx_excursion);
            setIsWish(!isWish);
          }
        }}
        className={`absolute top-2 right-2 ${
          isWish ? "text-red-500" : "text-white"
        } hover:text-red-500 hover:border-red-500 p-2 rounded-full transition`}
        aria-label="Add to wishlist"
      >
        <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
      </button>

      <div className="px-4 py-4 flex flex-col flex-grow">
        <a href={link}>
          <h5
            className="text-md font-semibold tracking-tight text-gray-800 min-h-[30px] truncate"
            title={title}
          >
            {title}
          </h5>
          <p className="text-gray-500 text-wrap text-xs min-h-[36px]">
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
                className="w-4 h-4 text-yellow-300"
              />
            ))}
            <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-gray-600" />
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
            5.0
          </span>
        </div> */}

        {/* Harga dan Tombol */}
        {/* <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-gray-700">
            Rp {price} / <span className="font-normal text-sm">Person</span>
          </span>
          <a
            href={link}
            className="text-white bg-red-gvi hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center"
          >
            <FontAwesomeIcon icon={faCartPlus} className="w-4 h-4 text-white" />
          </a>
        </div> */}
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

export default EcommersCard;
