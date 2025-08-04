"use client";
// Hooks
import { useEffect, useState } from "react";
// Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faInbox } from "@fortawesome/free-solid-svg-icons";
// component
import Breadcrumb from "@/components/Breadcrumb";
import CardAccordion from "@/components/CardAccordion";
import HorizontalCard from "@/components/HorizontalCard";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
// Context global
import { useCartApi } from "@/context/CartApiContext";

type DetailPax = {
  charge_type: string;
  quantity: string;
  age: string;
  currency: string;
  price_per_item: string;
  price_total: string;
};

type DetailSurcharge = {
  surcharge: string;
  currency: string;
  price_total: string;
};

type CartApiItem = {
  master_file_id: string;
  transaction_id: string;
  market_id: string;
  client_id: string;
  company_id: string;
  supplier_id: string;
  voucher_number: string;
  excursion_id: string;
  excursion_sub_id: string;
  excursion_name: string;
  pickup_date: string;
  pickup_time: string;
  location_id: string;
  location_name: string;
  location_detail: string;
  pax_adult: number;
  pax_child: number;
  pax_infant: number;
  pax_total: number;
  currency_id: string;
  currency: string;
  price: string;
  price_in_format: string;
  priceori: string;
  priceori_in_format: string;
  disc: string;
  disc_in_format: string;
  promo_value: string;
  currency_local_id: string;
  currency_local: string;
  price_local: string;
  price_local_in_format: string;
  remark_to_internal: string;
  remark_to_supplier: string;
  picture: string;
  picture_small: string;
  create_by: string;
  create_date: string;
  modified_by: string;
  modified_date: string;
  detail_pax: DetailPax[];
  detail_surcharge: DetailSurcharge[];
};

export default function Cart() {
  // State Data Detail Destination
  const [ListCart, setCart] = useState<CartApiItem[]>([]);

  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);
  const { cartApiItems } = useCartApi();
  const [isOpenAccordion, setAccordion] = useState(false);

  useEffect(() => {
    loadCart();
  }, [cartApiItems]); // tetap kosong, agar hanya dijalankan sekali saat mount

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart_api") || "[]");
    console.log(cart);
    setCart(cart);
    setIsLoading(false);
  }

  return (
    // Cart Page
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="Cart" />
      <div className="flex flex-col md:flex-row">
        {/* Kontent Kiri */}
        <div className="w-[100%] md:w-[60%]">
          {" "}
          <section className="flex flex-col py-6 md:p-6 bg-white gap-1">
            {ListCart.map((item, index) => {
              return (
                <CardAccordion key={`cardAccordion-${index}`} item={item} />
              );
            })}
            <div className="block md:hidden mt-100"></div>
          </section>
        </div>
        {/* Kontent Kanan */}
        <div className="w-[100%] md:w-[40%] md:p-6">
          {/* Desktop */}
          <div className="hidden md:block max-w-xl p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-sm ">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Order Summary
            </h5>

            <div className="flex flex-col mt-6">
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 ">Aristocat Katamaran</p>
                <p className="text-sm text-gray-700">EUR 20</p>
              </div>
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 ">Aristocat Katamaran</p>
                <p className="text-sm text-gray-700">EUR 20</p>
              </div>
            </div>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <div className="flex flex-row justify-between mb-2">
              <p className="text-sm text-gray-700 font-bold">Subtotal</p>
              <p className="text-sm text-gray-700 font-semibold">EUR 40</p>
            </div>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <div className="flex flex-row justify-between mb-2">
              <p className="text-sm text-gray-700 font-semibold">Disc</p>
              <p className="text-sm text-gray-700 font-semibold">EUR 5</p>
            </div>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <div className="flex flex-row justify-between mb-2">
              <p className="text-gray-700 font-semibold">Grand Total</p>
              <p className="text-gray-700 font-semibold">EUR 35</p>
            </div>
            <button
              type="button"
              className="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Payment
            </button>
          </div>
          {/* Mobile */}
          <div className="block md:hidden max-w-xl p-6 fixed bottom-0 left-0 w-full z-50 bg-gray-100 border border-gray-200 rounded-lg shadow-sm ">
            <div
              className="flex flex-row justify-between mb-2"
              onClick={() => {
                setAccordion(!isOpenAccordion);
              }}
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                Order Summary
              </h5>
              <h5>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="w-10 h-10 text-gray-500"
                  size="lg"
                />
              </h5>
            </div>

            {isOpenAccordion && (
              <>
                {" "}
                <div className="flex flex-col mt-6">
                  <div className="flex flex-row justify-between mb-2">
                    <p className="text-sm text-gray-700 ">
                      Aristocat Katamaran
                    </p>
                    <p className="text-sm text-gray-700">EUR 20</p>
                  </div>
                  <div className="flex flex-row justify-between mb-2">
                    <p className="text-sm text-gray-700 ">
                      Aristocat Katamaran
                    </p>
                    <p className="text-sm text-gray-700">EUR 20</p>
                  </div>
                </div>
                <hr className="my-2 border border-gray-400 opacity-50" />
              </>
            )}

            <div className="flex flex-row justify-between mb-2">
              <p className="text-sm text-gray-700 font-bold">Subtotal</p>
              <p className="text-sm text-gray-700 font-semibold">EUR 40</p>
            </div>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <div className="flex flex-row justify-between mb-2">
              <p className="text-sm text-gray-700 font-semibold">Disc</p>
              <p className="text-sm text-gray-700 font-semibold">EUR 5</p>
            </div>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <div className="flex flex-row justify-between mb-2">
              <p className="text-gray-700 font-semibold">Grand Total</p>
              <p className="text-gray-700 font-semibold">EUR 35</p>
            </div>
            <button
              type="button"
              className="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
