"use client";

import { useEffect, useLayoutEffect, useState } from "react";
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
  faDollarSign,
  faEur,
  faRupiahSign,
  faHeart,
  faSliders,
  faCancel,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { Dropdown, DropdownItem } from "flowbite-react";
// Helper
import { capitalizeWords } from "@/helper/helper"; // sesuaikan path
// Global State
import { useWish } from "@/context/WishContext";
import { useCurrency } from "@/context/CurrencyContext";
// Host Imgae
import { API_HOSTS } from "@/lib/apihost";
import ListCardMobile from "@/components/ListCardMobile";
import SkeletonCardList from "@/components/SkeletonCardList";

type DestinationItem = {
  idx_comp: string;
  Idx_excursion: string;
  code_exc: string;
  Country: string;
  State: string;
  Name_excursion: string;
  Duration_Type: string;
  Holiday_Type: string;
  Currency: string;
  PriceFrom: string;
  Gbr: string;
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

type HolidayType = {
  holiday_type: string;
  qty: number;
};

export default function ListClient() {
  // Query Params
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //dari idx_comp_alias
  const country = searchParams.get("country");
  const state_ = searchParams.get("state");
  const capitalizedCountry = capitalizeWords(country ?? "");
  const host_img =
    country == "indonesia"
      ? API_HOSTS.img_indo
      : country == "thailand"
      ? API_HOSTS.img_thai
      : country == "vietnam"
      ? API_HOSTS.img_viet
      : country == "cambodia"
      ? API_HOSTS.img_camb
      : "";
  // Wish Counter
  const { wishItems } = useWish();
  // Curency
  const { currency } = useCurrency();

  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);

  // State Data Detail Destination
  const [DetailDestination, setDetailDestination] = useState<DestinationItem[]>(
    []
  );

  // State Data State Dari Dropdown Search
  const [state, setState] = useState<string | null>(
    capitalizeWords(state_ ?? "")
  );

  // State Data Badge Dari Dropdown Search
  const [BadgeState, setBadgeState] = useState<string[]>([]);

  // State Data Holiday Checkbox Yang Sudah Concat | To String
  const [holidayState, setHolidayState] = useState("");
  // State Master Holiday State
  const [masterHoliday, setMasterHoliday] = useState<HolidayType[]>([]);

  // State Data Range Price
  const [price, setPrice] = useState<number>(10000000);

  // State Data Button Apply
  const [apply, setApply] = useState<number>(0);

  // State Data Sorting Dropdown
  const [selectedSorting, setSelectedSorting] = useState("Sorting");

  // State Data Checkbox Array
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // State Data WistList
  const [ListWist, setWish] = useState<WishItem[]>([]);

  // State Handle Warna Filter Badge
  const [SelectBadgeFilterMobile, setSelectBadgeFilterMobile] =
    useState<string>("");

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

  // Function Handle Apply Filter Desktop
  const handleApply = () => {
    const result = selectedTypes.join("|");
    console.log(result);
    setHolidayState(result);
    setApply(apply + 1); // untuk trigger apply filter
  };

  // Function Handle Apply Filter Mobile
  const handleApplyMobile = (keyword: string) => {
    setHolidayState(keyword);
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
        setDetailDestination(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoading(false); // ✅ Loading selesai
      });
  }, [state, holidayState, apply, JSON.stringify(wishItems)]);

  useEffect(() => {
    fetch(`/api/excursion/holiday_type?idx-comp-alias=${idx_comp}`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setMasterHoliday(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoading(false); // ✅ Loading selesai
      });
  }, []);

  // Badge Chips
  useEffect(() => {
    const allBadge = `ALL ${capitalizedCountry}`; // mis. "ALL Indonesia"

    if (state) {
      const normalized = state.toLowerCase();

      setBadgeState((prev) => {
        // 1️⃣ buang dulu badge “ALL …” agar tak ikut tersimpan
        const withoutAll = prev.filter(
          (b) => b.toLowerCase() !== allBadge.toLowerCase()
        );

        // 2️⃣ cek apakah badge state sudah ada (case‑insensitive)
        const alreadyExists = withoutAll.some(
          (b) => b.toLowerCase() === normalized
        );
        if (alreadyExists) return withoutAll;

        // 3️⃣ tambahkan badge state baru
        return [...withoutAll, state];
      });
    } else {
      // state === "" | null → reset kembali ke “ALL …”
      setBadgeState([allBadge]);
    }
  }, [state, capitalizedCountry]);

  useEffect(() => {
    loadWishlish();
  }, []); // tetap kosong, agar hanya dijalankan sekali saat mount

  useEffect(() => {
    if (currency == "IDR") {
      setPrice(10000000);
    } else {
      setPrice(1000);
    }
  }, [currency]);

  function loadWishlish() {
    const wish = JSON.parse(localStorage.getItem("wish") || "[]");
    setWish(wish);
    setIsLoading(false);
  }

  // Remove Badge
  const handleRemoveBadge = (id: string) => {
    setBadgeState((prev) =>
      prev.filter((item) => item.toLowerCase() !== id.toLowerCase())
    );
  };

  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // List Page
    <div className="max-w-screen-xl mx-auto">
      <section className="flex flex-col md:flex-row px-6 md:pb-6 bg-white gap-6">
        {/* Search List Mobile  */}
        <div className="md:hidden flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Search akan full width di HP */}
          <div className="">{/* <Search /> */}</div>

          {/* Badge akan di bawah search di HP, dan di samping saat md */}
          {/* <div className="flex flex-wrap gap-1">
            <Badge title="New" />
            <Badge title="Price Ascending" />
            <Badge title="Price Descending" />
            <Badge title="Rating" />
          </div> */}
        </div>
      </section>
      <section className="flex flex-col md:flex-row bg-white md:gap-6">
        {/* Konten Kiri Desktop */}
        <div className="hidden md:block w-full md:w-1/6  px-6 pb-6 text-gray-700">
          <p className="text-sm mb-2 font-semibold">Keywords</p>
          {BadgeState.map((item, index) => (
            <Chips
              key={index}
              title={capitalizeWords(item)}
              id={item}
              onRemove={handleRemoveBadge} // ✅ Kirim fungsi hapus
            />
          ))}
          {/* Range Price */}
          {/* <Range
            min="0"
            max={currency == "USD" || currency == "EUR" ? "1000" : "10000000"}
            value={price}
            onChange={setPrice}
          /> */}
          <div className="mt-5 mb-5">
            <hr className="text-gray-200" />
          </div>
          <div className="flex flex-row gap-3 md:flex-col">
            <div>
              <p className="text-sm mb-2 font-semibold">Holiday Type</p>
              {masterHoliday.map((item) => (
                <Checkbox
                  key={item.holiday_type}
                  title={item.holiday_type}
                  checked={selectedTypes.includes(item.holiday_type)}
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
        {/* Kontent Kiri Mobile */}
        <div className="flex flex-row gap-2 md:hidden h-15 items-center px-2 overflow-x-auto sticky top-31 z-30 bg-white">
          <div className="w-10 h-10 border-1 border-gray-500 rounded-lg text-center align-middle flex items-center justify-center p-2">
            <FontAwesomeIcon
              icon={faSliders}
              className="w-5 h-5 text-gray-500"
            />
          </div>
          {masterHoliday.map((item) => (
            <div
              key={`mobileHoliday-${item.holiday_type}`}
              className={`w-auto h-10  border-gray-500  ${
                item.holiday_type == SelectBadgeFilterMobile
                  ? "bg-gray-200 border-2"
                  : "border-1"
              }  rounded-lg text-center align-middle flex items-center justify-center p-2 whitespace-nowrap`}
              onClick={() => {
                if (item.holiday_type == SelectBadgeFilterMobile) {
                  handleApplyMobile("");
                  setSelectBadgeFilterMobile("");
                } else {
                  handleApplyMobile(item.holiday_type);
                  setSelectBadgeFilterMobile(item.holiday_type);
                }
              }}
            >
              <p className="text-sm text-gray-500">
                {capitalizeWords(item.holiday_type)}
              </p>

              {item.holiday_type == SelectBadgeFilterMobile && (
                <FontAwesomeIcon
                  icon={faXmark}
                  className="w-5 h-5 text-red-600"
                />
              )}
            </div>
          ))}
        </div>
        {/* Konten Kanan */}
        <div className="w-full md:w-5/6  md:px-6 pb-6 text-black">
          {/* Baris Search dan Badge */}
          <div className="hidden md:flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Search akan full width di HP */}
            <div className="w-xl">
              {/* <Search /> */}
              {/* <SearchWithDropdown
                country={capitalizedCountry ?? ""}
                idx_comp={idx_comp ?? ""}
                onChange={setState}
                state={state ?? ""}
              /> */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 py-4">
            {isLoading ? (
              <>
                <SkeletonCardList />
                <SkeletonCardList />
                <SkeletonCardList />
                <SkeletonCardList />
              </>
            ) : DetailDestination.length > 0 ? (
              DetailDestination.map((item, index) =>
                isMobile ? (
                  // Mobile layout
                  <ListCardMobile
                    key={`ListCardMobile-${index}`}
                    idx_comp={item.idx_comp}
                    idx_excursion={item.Idx_excursion}
                    // image={`https://picsum.photos/800/600?random=${index}`}
                    image={`${host_img}/media/${item.code_exc}/TN_400_${item.Gbr}`}
                    title={capitalizeWords(item.Name_excursion)}
                    sub_title={`${item.Holiday_Type} • ${item.Duration_Type} | ${item.State}, ${item.Country}`.toUpperCase()}
                    price={item.PriceFrom ?? 0}
                    currency={item.Currency ?? "Rp"}
                    link={`/destination/detail/${country}?id=${idx_comp}&state=${state}&country=${country}&exc=${item.Idx_excursion}`}
                    colorWish={
                      ListWist.some(
                        (wish) => wish.idx_excursion === item.Idx_excursion
                      )
                        ? true
                        : false
                    }
                  />
                ) : (
                  // Desktop Layout
                  <ListCard
                    key={`ListCard-${index}`}
                    idx_comp={item.idx_comp}
                    idx_excursion={item.Idx_excursion}
                    // image={`https://picsum.photos/800/600?random=${index}`}
                    image={`${host_img}/media/${item.code_exc}/TN_400_${item.Gbr}`}
                    title={item.Name_excursion}
                    sub_title={`${item.Holiday_Type} • ${item.Duration_Type} | ${item.State}, ${item.Country}`.toUpperCase()}
                    price={item.PriceFrom ?? 0}
                    currency={item.Currency ?? "Rp"}
                    link={`/destination/detail/${country}?id=${idx_comp}&state=${state}&country=${country}&exc=${item.Idx_excursion}`}
                    colorWish={
                      ListWist.some(
                        (wish) => wish.idx_excursion === item.Idx_excursion
                      )
                        ? true
                        : false
                    }
                  />
                )
              )
            ) : (
              <div className="col-span-4 text-center text-gray-500 py-10 flex flex-col justify-center items-center">
                {apply != 0 && (
                  <>
                    <img
                      src="/images/error/empty.svg"
                      alt=""
                      className="w-50 md:w-100 h-auto"
                    />
                    <p className="text-2xl">Opps Not Found!</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
