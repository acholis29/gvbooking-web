// components/EcommersCard.tsx
import React from "react";
import { useEffect, useState } from "react";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

// State Global / Context
import { useCart } from "@/context/CartContext";
import { useWish } from "@/context/WishContext";
// Toast
import toast from "react-hot-toast";
// Link Href
import Link from "next/link";
// Path
import { usePathname } from "next/navigation";
import Image from "next/image";
import { safeSrc, sanitizeImage } from "@/helper/helper";

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
    link: link ?? "#",
    image: image ?? "/images/icon/android-chrome-512x512.png",
  };

  const { addToCart } = useCart();
  const { addToWish, removeFromWish } = useWish();

  // State Data Loading
  const [isWish, setIsWish] = useState(colorWish);
  // Image
  const [imgSrc, setImgSrc] = useState(sanitizeImage(safeSrc(image)));
  const [hasError, setHasError] = useState(false);
  // Hide
  const pathname = usePathname();
  const hidePrice = pathname === "/" || pathname === "/home";

  useEffect(() => {
    setIsWish(colorWish);
  }, [colorWish]); // ← penting: hanya update ketika colorWish berubah

  return (
    <div className="relative w-72 md:w-auto max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm shrink-0 md:shrink flex flex-col h-full">
      <Link href={link} className="relative block overflow-hidden rounded-t-lg">
        <div className="relative w-full h-56">
          <Image
            className="object-cover transition-transform duration-300 ease-in-out hover:scale-150"
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 260px, 25vw"
            // unoptimized
            // onError={(e) => {
            //   const target = e.target as HTMLImageElement;
            //   target.onerror = null;
            //   target.src = "/images/icon/android-chrome-512x512.png";
            // }}
            onError={() => {
              if (!hasError) {
                setHasError(true);
                setImgSrc("/images/icon/android-chrome-512x512.png");
              }
            }}
          />
        </div>
      </Link>
      {/* {colorWish.toString()} */}
      {/* Wishlist button - posisi atas kanan gambar */}
      <button
        type="button"
        onClick={() => {
          if (!isWish) {
            addToWish(data);
            setIsWish(!isWish);
            toast.success("Save to wishlist");
          } else {
            removeFromWish(idx_excursion);
            setIsWish(!isWish);
            toast.success("Delete from wishlist!");
          }
        }}
        className={`absolute top-2 right-2 ${
          isWish ? "text-red-500" : "text-white"
        } hover:text-red-500 hover:border-red-500 p-2 rounded-full transition`}
        aria-label="Add to wishlist"
      >
        {/* <FontAwesomeIcon icon={faHeart} className="w-4 h-4" /> */}
        <div className="relative inline-flex items-center justify-center">
          {/* Layer bawah (border merah, lebih besar) */}
          <FontAwesomeIcon
            icon={faHeart}
            size="1x"
            className={`absolute inset-0 ${
              isWish ? "text-red-500" : "text-gray-400"
            }  scale-110 top-40`}
          />

          {/* Layer atas (heart putih) */}
          <FontAwesomeIcon
            icon={faHeart}
            size="1x"
            className={`${
              isWish ? "text-red-500" : "text-white hover:text-red-500"
            } z-10`}
          />
        </div>
      </button>

      <div className="px-4 py-4 flex flex-col flex-grow">
        <Link href={link}>
          <h5
            className="text-md font-semibold tracking-tight text-gray-800 min-h-[30px] truncate"
            title={title}
          >
            {title}
          </h5>
          <p className="text-gray-500 text-wrap text-xs min-h-[36px]">
            {sub_title}
          </p>
        </Link>

        {!hidePrice && (
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-md font-bold text-gray-700">
                {" "}
                {currency} {price}{" "}
              </span>

              <span className="text-sm  text-gray-700">per person</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommersCard;
