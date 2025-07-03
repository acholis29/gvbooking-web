"use client";
import { useEffect, useState } from "react";
import HorizontalCard from "@/components/HorizontalCard";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

type CartItem = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
  link?: string; // optional
};

export default function Cart() {
  // State Data Detail Destination
  const [ListCart, setCart] = useState<CartItem[]>([]);

  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);

  // Total

  useEffect(() => {
    loadCart();
  }, []); // tetap kosong, agar hanya dijalankan sekali saat mount

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cart);
    setIsLoading(false);
  }

  return (
    // Cart Page
    <div className="max-w-screen-xl mx-auto">
      {ListCart.length > 0 ? (
        <section className="flex flex-col md:flex-row p-6 bg-white gap-1">
          {/* Konten Kiri */}
          <div className="md:w-4/6 text-gray-700">
            {isLoading ? (
              <>
                <SkeletonCardHorizontal />
              </>
            ) : ListCart.length > 0 ? (
              ListCart.map((item, index) => (
                <HorizontalCard
                  key={index}
                  idx_comp={item.idx_comp}
                  idx_excursion={item.idx_excursion}
                  image="/images/destination/tanah-lot/tanah-lot6.jpg"
                  title={item.title}
                  sub_title={item.sub_title}
                  link="/cart"
                  currency={`${item.currency}`}
                  price={`${item.price}`}
                  onDelete={loadCart} // ✅ ini dikirim ke anak
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
          {/* Konten Kanan */}
          <div className="md:w-2/6 text-black">
            <div className="border p-3 rounded-2xl bg-gray-600">
              <div className="flex flex-row justify-between">
                <div className="">
                  <p className="font-bold text-lg  text-white">
                    Total Item ( {ListCart.length} )
                  </p>
                </div>
                <div className="">
                  <p className="font-bold text-lg  text-white">
                    {/* Total */}
                    {ListCart[0].currency}{" "}
                    {ListCart.reduce(
                      (total, item) => total + Number(item.price),
                      0
                    ).toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm  text-white">
                    *include tax and service
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mt-3 md:mt-10 w-full text-white bg-red-gvi hover:bg-red-900 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                PAYMENT
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="col-span-4 text-center text-gray-500 py-10 my-30">
          <FontAwesomeIcon
            icon={faInbox}
            className="w-4 h-4 text-gray-600 mr-2"
          />
          Data tidak ditemukan...
        </div>
      )}
    </div>
  );
}
