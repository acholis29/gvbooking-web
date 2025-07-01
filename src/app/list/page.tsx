"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/Badge";
import Chips from "@/components/Chips";
import Range from "@/components/Range";
import Checkbox from "@/components/Checkbox";
import Search from "@/components/Search";
import SearchWithDropdown from "@/components/SearchWithDropdown";
import ListCard from "@/components/ListCard";
// Params Query
import { useSearchParams } from "next/navigation";
import SkeletonCard from "@/components/SkeletonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faFilter } from "@fortawesome/free-solid-svg-icons";

import { Dropdown, DropdownItem } from "flowbite-react";
// Helper
import { capitalizeWords, truncateText } from "@/helper/helper"; // sesuaikan path

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
  const idx_comp = searchParams.get("id"); //dari idx_comp_alias
  // const state = searchParams.get("state");
  const country = searchParams.get("country");
  const capitalizedCountry = capitalizeWords(country ?? "");

  const [DetailDestination, setDetailDestination] = useState<DestinationItem[]>(
    []
  );

  // Dropdown Search
  const [state, setState] = useState<string | null>(
    capitalizeWords(searchParams.get("state") ?? "")
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
  }, [state]);

  // Dropdown Sorting
  const [selectedSorting, setSelectedSorting] = useState("Sorting");

  const handleSelect = (value: string) => {
    setSelectedSorting(value);
  };

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
          <Chips title="Bali" id="badge1" />
          <Chips title="Lombok" id="badge2" />
          <Chips title="Java" id="badge3" />
          <Range />

          <div className="flex flex-row gap-3 md:flex-col">
            <div>
              <p className="text-sm mb-2 font-semibold">Holiday Type</p>
              <Checkbox title="ADVENTURE" />
              <Checkbox title="BEACH" />
              <Checkbox title="CULTURE AND HISTORY" />
              <Checkbox title="MOUNTAIN" />
              <Checkbox title="NATURE" />
              <Checkbox title="PRIVATE" />
              <Checkbox title="SPECIAL ADDRESS" />
              <Checkbox title="SPORT" />
              <Checkbox title="SUN AND SEA" />
              <Checkbox title="TOUR" />
              <Checkbox title="TRANSFER" />
              <Checkbox title="WELLNESS FOR BODY AND SOUL" />
            </div>
            {/* <div>
              <p className="text-sm mb-2 font-semibold">Size</p>
              <Checkbox title="Label" />
              <Checkbox title="Label" />
              <Checkbox title="Label" />
            </div> */}
          </div>
          <button
            type="button"
            className="mt-4 text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2  focus:outline-none w-full"
          >
            <FontAwesomeIcon
              icon={faFilter}
              className="w-4 h-4 text-gray-100 mr-2"
            />
            Apply
          </button>
        </div>
        {/* Konten Kanan */}
        <div className="md:w-5/6 text-black">
          {/* Baris Search dan Badge */}
          <div className="hidden md:flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Search akan full width di HP */}
            <div className="w-xl">
              {/* <Search /> */}
              <SearchWithDropdown
                country={capitalizedCountry ?? ""}
                idx_comp={idx_comp ?? ""}
                onChange={setState}
                state={state ?? ""}
              />
            </div>

            {/* Badge akan di bawah search di HP, dan di samping saat md */}
            {/* <div className="flex flex-wrap gap-1">
              <Badge title="New" />
              <Badge title="Price Ascending" />
              <Badge title="Price Descending" />
              <Badge title="Rating" />
            </div> */}
            <div className="w-50 flex justify-end">
              <Dropdown
                dismissOnClick={true}
                renderTrigger={() => (
                  <button
                    className="text-sm text-gray-600 bg-transparent border-none shadow-none 
                 hover:bg-transparent focus:ring-0 focus:outline-none 
                 dark:hover:bg-transparent dark:hover:text-inherit"
                  >
                    {selectedSorting}
                    <span className="ml-2">
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="w-3 h-3 text-gray-600"
                      />
                    </span>
                  </button>
                )}
              >
                <DropdownItem
                  onClick={() => handleSelect("Price Ascending")}
                  className="justify-end"
                >
                  Price Ascending
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleSelect("Price Descending")}
                  className="justify-end"
                >
                  Price Descending
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleSelect("Low Price")}
                  className="justify-end"
                >
                  Low Price
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleSelect("High Price")}
                  className="justify-end"
                >
                  High Price
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleSelect("Sorting")}
                  className="justify-end"
                >
                  Reset
                </DropdownItem>
              </Dropdown>
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
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
