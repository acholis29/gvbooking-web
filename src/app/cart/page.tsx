"use client";
import { useEffect, useState } from "react";
import HorizontalCard from "@/components/HorizontalCard";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/Breadcrumb";
import CardAccordion from "@/components/CardAccordion";

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
      <Breadcrumb pageName="Cart" />
      <section className="flex flex-col p-6 bg-white gap-1">
        <CardAccordion />
        <CardAccordion />
      </section>
    </div>
  );
}
