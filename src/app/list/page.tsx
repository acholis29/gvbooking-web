"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/Badge";
import Chips from "@/components/Chips";
import Range from "@/components/Range";
import Checkbox from "@/components/Checkbox";
import Search from "@/components/Search";
import ListCard from "@/components/ListCard";
// Params Query
import { useSearchParams } from "next/navigation";
import SkeletonImage from "@/components/SkeletonImage";

type DestinationItem = {
  idx_comp: string;
  Country: string;
  State: string;
  Name_excursion: string;
  Duration_Type: string;
  Holiday_Type: string;
  Currency: string;
  PriceFrom: string;
};

export default function List() {
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("idx-comp-alias");
  const state = searchParams.get("state");

  const [DetailDestination, setDetailDestination] = useState<DestinationItem[]>(
    []
  );

  useEffect(() => {
    fetch(
      `/api/excursion/local_destination/detail?idx-comp-alias=${idx_comp}&state=${state}`,
      {
        cache: "no-store", // ⛔ jangan ambil dari cache
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("EXCUR:", data); // ← ini langsung array
        setDetailDestination(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    // List Page
    <div className="max-w-screen-xl mx-auto">
      <section className="flex flex-col md:flex-row px-6 pb-6 bg-white gap-6">
        {/* Search List Mobile  */}
        <div className="md:hidden flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Search akan full width di HP */}
          <div className="">
            <Search />
          </div>

          {/* Badge akan di bawah search di HP, dan di samping saat md */}
          <div className="flex flex-wrap gap-1">
            <Badge title="New" />
            <Badge title="Price Ascending" />
            <Badge title="Price Descending" />
            <Badge title="Rating" />
          </div>
        </div>
        {/* Konten Kiri */}
        <div className="md:w-1/6 text-gray-700">
          <p className="text-sm mb-2 font-semibold">Keywords</p>
          <Chips title="Spring" id="badge1" />
          <Chips title="Smart" id="badge2" />
          <Chips title="Modern" id="badge3" />
          <Range />

          <div className="flex flex-row gap-3 md:flex-col">
            <div>
              <p className="text-sm mb-2 font-semibold">Color</p>
              <Checkbox title="Label" />
              <Checkbox title="Label" />
              <Checkbox title="Label" />
            </div>
            <div>
              <p className="text-sm mb-2 font-semibold">Size</p>
              <Checkbox title="Label" />
              <Checkbox title="Label" />
              <Checkbox title="Label" />
            </div>
          </div>
        </div>
        {/* Konten Kanan */}
        <div className="md:w-5/6 text-black">
          {/* Baris Search dan Badge */}
          <div className="hidden md:flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Search akan full width di HP */}
            <div className="w-md">
              <Search />
            </div>

            {/* Badge akan di bawah search di HP, dan di samping saat md */}
            <div className="flex flex-wrap gap-1">
              <Badge title="New" />
              <Badge title="Price Ascending" />
              <Badge title="Price Descending" />
              <Badge title="Rating" />
            </div>
          </div>

          {/* Baris Card */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {DetailDestination.length > 0 ? (
              DetailDestination.map((item, index) => (
                <ListCard
                  key={index}
                  image={`https://picsum.photos/800/600?random=${index}`}
                  title={item.Name_excursion}
                  sub_title="10 hours • Skip the line • Pickup availables"
                  price={item.PriceFrom ?? 0}
                  currency={item.Currency ?? "Rp"}
                />
              ))
            ) : (
              <>
                <SkeletonImage />
                <SkeletonImage />
                <SkeletonImage />
                <SkeletonImage />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
