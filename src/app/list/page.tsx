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
import {
  faChevronDown,
  faFilter,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";

import { Dropdown, DropdownItem } from "flowbite-react";
// Helper
import { capitalizeWords, truncateText } from "@/helper/helper"; // sesuaikan path
// Global State
import { useWish } from "@/context/WishContext";

type DestinationItem = {
  idx_comp: string;
  Idx_excursion: string;
  Country: string;
  State: string;
  Name_excursion: string;
  Duration_Type: string;
  Holiday_Type: string;
  Currency: string;
  PriceFrom: string;
};

const holidayTypes = [
  "ADVENTURE",
  "BEACH",
  "CULTURE AND HISTORY",
  "MOUNTAIN",
  "NATURE",
  "PRIVATE",
  "SPECIAL ADDRESS",
  "SPORT",
  "SUN AND SEA",
  "TOUR",
  "TRANSFER",
  "WELLNESS FOR BODY AND SOUL",
];

type WishItem = {
  idx_comp: string;
  idx_excursion: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
};

export default function List() {
  // Query Params
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //dari idx_comp_alias
  const country = searchParams.get("country");
  const capitalizedCountry = capitalizeWords(country ?? "");

  // Wish Counter
  const { wishItems } = useWish();

  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);

  // State Data Detail Destination
  const [DetailDestination, setDetailDestination] = useState<DestinationItem[]>(
    []
  );

  // State Data State Dari Dropdown Search
  const [state, setState] = useState<string | null>(
    capitalizeWords(searchParams.get("state") ?? "")
  );

  // State Data Holiday Checkbox Yang Sudah Concat | To String
  const [holidayState, setHolidayState] = useState("");

  // State Data Range Price
  const [price, setPrice] = useState<number>(10000);

  // State Data Button Apply
  const [apply, setApply] = useState<number>(0);

  // State Data Sorting Dropdown
  const [selectedSorting, setSelectedSorting] = useState("Sorting");

  // State Data Checkbox Array
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // State Data WistList
  const [ListWist, setWish] = useState<WishItem[]>([]);

  const handleSelect = (value: string) => {
    setSelectedSorting(value);
  };

  // Function Hanlde Checkbox
  const handleCheckboxChange = (checked: boolean, title: string) => {
    if (checked) {
      setSelectedTypes((prev) => [...prev, title]);
    } else {
      setSelectedTypes((prev) => prev.filter((t) => t !== title));
    }
  };

  // Function Handle Apply Filter
  const handleApply = () => {
    const result = selectedTypes.join("|");
    setHolidayState(result);
    setApply(apply + 1); // untuk trigger apply filter
  };

  useEffect(() => {
    fetch(
      `/api/excursion/local_destination/detail?idx-comp-alias=${idx_comp}&state=${state}&holiday-type=${holidayState}&price-min=0&price-max=${price}`,
      {
        cache: "no-store", // ⛔ jangan ambil dari cache
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("EXCUR:", data); // ← ini langsung array
        setDetailDestination(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoading(false); // ✅ Loading selesai
      });
  }, [state, holidayState, apply, JSON.stringify(wishItems)]);

  useEffect(() => {
    loadWishlish();
  }, []); // tetap kosong, agar hanya dijalankan sekali saat mount

  function loadWishlish() {
    const wish = JSON.parse(localStorage.getItem("wish") || "[]");
    setWish(wish);
    setIsLoading(false);
  }

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
          <Range min="0" max="10000" value={price} onChange={setPrice} />

          <div className="flex flex-row gap-3 md:flex-col">
            <div>
              <p className="text-sm mb-2 font-semibold">Holiday Type</p>
              {holidayTypes.map((type) => (
                <Checkbox
                  key={type}
                  title={type}
                  checked={selectedTypes.includes(type)}
                  onChange={handleCheckboxChange}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleApply}
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
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : DetailDestination.length > 0 ? (
              DetailDestination.map((item, index) => (
                <ListCard
                  key={index}
                  idx_comp={item.idx_comp}
                  idx_excursion={item.Idx_excursion}
                  image={`https://picsum.photos/800/600?random=${index}`}
                  title={item.Name_excursion}
                  sub_title="10 hours • Skip the line • Pickup availables"
                  price={item.PriceFrom ?? 0}
                  currency={item.Currency ?? "Rp"}
                  colorWish={
                    ListWist.some(
                      (wish) => wish.idx_excursion === item.Idx_excursion
                    )
                      ? true
                      : false
                  }
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
        </div>
      </section>
    </div>
  );
}
