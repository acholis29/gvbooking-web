// components/HorizontalWishlistCard.tsx
import React from "react";
// Font Awesome
import { faCartPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// State Global / Context
import { useCart } from "@/context/CartContext";
import { useWish } from "@/context/WishContext";
// Link Href
import Link from "next/link";

type HorizontalWishlistCardProps = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency: string;
  link?: string; // optional
  onDelete?: () => void; // ✅ tambahkan ini
};

const HorizontalWishlistCard: React.FC<HorizontalWishlistCardProps> = ({
  idx_comp,
  idx_excursion,
  image,
  title,
  sub_title,
  price,
  currency,
  link = "#",
  onDelete,
}) => {
  const { addToCart } = useCart();
  const { removeFromWish } = useWish();

  // Data Produk Add To Cart
  const data = {
    idx_comp: idx_comp ?? "",
    idx_excursion: idx_excursion ?? "",
    title: title ?? "",
    sub_title: sub_title ?? "",
    price: price ?? "",
    currency: currency ?? "",
  };

  return (
    <Link
      href={link}
      className="relative flex flex-row items-start bg-white border border-gray-200 rounded-lg shadow-sm md:max-w-3xl hover:bg-gray-100 mb-3"
    >
      {/* ❌ Tombol hapus di pojok kanan atas */}
      <button
        type="button"
        className="absolute top-2 right-2 bg-white border border-gray-300 hover:bg-red-100 text-red-500 p-1 rounded-full shadow transition"
        onClick={(e) => {
          e.preventDefault(); // mencegah redirect karena <a>
          removeFromWish(idx_excursion);
          onDelete?.(); // ✅ panggil fungsi dari parent jika ada
        }}
      >
        <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
      </button>
      <button
        type="button"
        className="absolute top-12 right-2 bg-white border border-gray-300 hover:bg-red-100 text-green-800 p-1 rounded-full shadow transition"
        onClick={(e) => {
          e.preventDefault(); // mencegah redirect karena <a>
          addToCart(data);
          onDelete?.(); // ✅ panggil fungsi dari parent jika ada
        }}
      >
        <FontAwesomeIcon icon={faCartPlus} className="w-3 h-3" />
      </button>
      <img
        className="w-30 h-40 p-2 object-cover rounded-2xl"
        src={image}
        alt={image}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/images/icon/android-chrome-512x512.png";
        }}
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
    </Link>
  );
};

export default HorizontalWishlistCard;
