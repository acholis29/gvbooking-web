"use client";
import { useEffect, useState } from "react";
import HorizontalWishlistCard from "@/components/HorizontalWishlistCard";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faCartPlus,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";

// State Global / Context
import { useCart } from "@/context/CartContext";
// Toast
import toast from "react-hot-toast";
import Breadcrumb from "@/components/Breadcrumb";

type WishItem = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
  link?: string; // optional
};

export default function Wishlist() {
  // State Data Detail Destination
  const [ListWishlist, setWishlist] = useState<WishItem[]>([]);

  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWish();
  }, []); // tetap kosong, agar hanya dijalankan sekali saat mount

  function loadWish() {
    const wish = JSON.parse(localStorage.getItem("wish") || "[]");
    setWishlist(wish);
    setIsLoading(false);
  }

  const { addManyToCart } = useCart();
  function addAllToCart() {
    addManyToCart(ListWishlist);
    toast.success("Add to cart!");
  }

  return (
    // Cart Page
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="Wishlist" />
      {ListWishlist.length > 0 ? (
        <section className="flex flex-col md:flex-row p-6 bg-white gap-1">
          {/* Konten Kiri */}
          <div className="md:w-4/6 text-gray-700">
            {isLoading ? (
              <>
                <SkeletonCardHorizontal />
              </>
            ) : ListWishlist.length > 0 ? (
              ListWishlist.map((item, index) => (
                <HorizontalWishlistCard
                  key={index}
                  idx_comp={item.idx_comp}
                  idx_excursion={item.idx_excursion}
                  image={
                    item.image ?? "/images/icon/android-chrome-512x512.png"
                  }
                  title={item.title}
                  sub_title={item.sub_title}
                  link={item.link ?? "#"}
                  currency={`${item.currency}`}
                  price={`${item.price}`}
                  onDelete={loadWish} // ✅ ini dikirim ke anak
                />
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500 py-10">
                <FontAwesomeIcon
                  icon={faInbox}
                  className="w-4 h-4 text-gray-600 mr-2"
                />
                Data tidak ditemukan...
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className="col-span-4 text-center text-gray-500 py-10 my-30">
          <FontAwesomeIcon
            icon={faInbox}
            className="w-4 h-4 text-gray-600 mr-2"
          />
          Wishlist is empty
        </div>
      )}
    </div>
  );
}
