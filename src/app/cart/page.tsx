"use client";
import { useEffect, useState } from "react";
import HorizontalCard from "@/components/HorizontalCard";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/Breadcrumb";
import CardAccordion from "@/components/CardAccordion";

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

  useEffect(() => {
    loadCart();
  }, []); // tetap kosong, agar hanya dijalankan sekali saat mount

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
      <section className="flex flex-col py-6 md:p-6 bg-white gap-1">
        {ListCart.map((item, index) => {
          return <CardAccordion key={`cardAccordion-${index}`} item={item} />;
        })}
      </section>
    </div>
  );
}
