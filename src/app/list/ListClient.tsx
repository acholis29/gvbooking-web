"use client";
// Hooks
import { useEffect, useLayoutEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// Component
import Chips from "@/components/Chips";
import ListCard from "@/components/ListCard";
import ListCardMobile from "@/components/ListCardMobile";
import SkeletonCardList from "@/components/SkeletonCardList";
import ModalBottomSheet from "@/components/ModalBottomSheet";
import Radio from "@/components/Radio";
// Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faFilter,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
// Helper
import {
  capitalizeWords,
  getHostImageUrl,
  splitUsername,
} from "@/helper/helper"; // sesuaikan path
// Global State
import { useWish } from "@/context/WishContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDate } from "@/context/DateContext";
import { useInitial } from "@/context/InitialContext";
import Checkbox from "@/components/Checkbox";
import { useSession } from "next-auth/react";
import { useProfile } from "@/context/ProfileContext";

type DestinationItemApi = {
  excursion_id: string;
  excursion_code: string;
  excursion_name: string;
  location_country: string;
  location_state: string;
  holiday_type_id: string;
  holiday_type: string;
  holiday_duration_id: string;
  holiday_duration: string;
  picture: string;
  currency_id: string;
  currency: string;
  price_in_raw: string; // bisa juga number jika ingin parsing
  price_in_format: string;
  price_of_lowest: string; // bisa juga number jika ingin parsing
  page_count: string; // bisa juga number jika ingin parsing
  page_item_count: string; // bisa juga number jika ingin parsing
};

type WishItem = {
  idx_comp: string;
  idx_excursion: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
};

type HolidayTypeApi = {
  holiday_type_id: string;
  holiday_type: string;
};

export default function ListClient() {
  // Query Params
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //dari idx_comp
  const country = searchParams.get("country");
  const state_ = searchParams.get("state");
  const idx_state =
    searchParams.get("id-state") == "null" ? "" : searchParams.get("id-state");
  const capitalizedCountry = capitalizeWords(country ?? "");

  // Curency
  const { currency } = useCurrency();
  // Language
  const { language } = useLanguage();
  // Date
  const { date } = useDate();
  // Initial
  const { coreInitial } = useInitial();
  // host sesuai country
  const host_img = getHostImageUrl(coreInitial, idx_comp ?? "");

  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);
  // Is Loading Holiday
  const [isLoadHoliday, setIsLoadHoliday] = useState(true);
  // Is Loading List
  const [isLoadList, setIsLoadList] = useState(true);

  const [DetailDestinationApi, setDetailDestinationApi] = useState<
    DestinationItemApi[]
  >([]);

  // State Data State Dari Dropdown Search
  const [state, setState] = useState<string | null>(
    capitalizeWords(state_ ?? "")
  );

  // State Data Badge Dari Dropdown Search
  const [BadgeState, setBadgeState] = useState<string[]>([]);
  // State Master Holiday State API
  const [masterHolidayApi, setMasterHolidayApi] = useState<HolidayTypeApi[]>(
    []
  );

  // State Data Range Price
  const [price, setPrice] = useState<number>(10000000);

  // State Data Button Apply
  const [apply, setApply] = useState<number>(0);

  // State Data Sorting Dropdown
  const [selectedSorting, setSelectedSorting] = useState("price asc");
  // dropdown sorting
  const [isSortingOpen, setIsSortingOpen] = useState(false);

  // State Data Checkbox Array Desktop
  const [selectedTypesHolidayArrDesk, setSelectedTypesHolidayArrDesk] =
    useState<string[]>([]);
  const [selectedTypesHolidayArrMob, setSelectedTypesHolidayArrMob] = useState<
    string[]
  >([]);
  // State Data Checkbox Single
  const [selectedTypesById, setSelectedTypesById] = useState<string>("");

  // State Data WistList
  const [ListWist, setWish] = useState<WishItem[]>([]);

  // State Handle Warna Filter Badge
  const [SelectBadgeFilterMobile, setSelectBadgeFilterMobile] =
    useState<string>("");

  // State BottomSheet
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  // Function Hanlde Checkbox
  const handleCheckboxChange = (
    checked: boolean,
    title: string,
    value: string
  ) => {
    if (checked) {
      setSelectedTypesHolidayArrDesk((prev) => [...prev, value]);
      // setSelectedTypesById(value);
    } else {
      setSelectedTypesHolidayArrDesk((prev) => prev.filter((t) => t !== value));
      // setSelectedTypesById("");
    }
  };

  const handleBadgeChange = (
    checked: boolean,
    title: string,
    value: string
  ) => {
    if (checked) {
      setSelectedTypesHolidayArrMob((prev) => [...prev, value]);
    } else {
      setSelectedTypesHolidayArrMob((prev) => prev.filter((t) => t !== value));
    }
  };

  // Function Handle Apply Filter Desktop
  const handleApply = () => {
    const result = selectedTypesHolidayArrDesk.join("~");
    setSelectedTypesById(result);
    setApply(apply + 1); // untuk trigger apply filter
  };

  // Function Handle Apply Filter Mobile
  const handleApplyMobile = () => {
    const result = selectedTypesHolidayArrMob.join("~");
    setSelectedTypesById(result);
    setApply(apply + 1); // untuk trigger apply filter
  };

  // Hanlde Mobile Filter Holiday Type
  useEffect(() => {
    handleApplyMobile();
    console.log(selectedTypesHolidayArrMob);
  }, [selectedTypesHolidayArrMob]);

  useEffect(() => {
    setIsLoadList(true);
    let sorting = selectedSorting == "price asc" ? "0" : "1";
    const formBody = new URLSearchParams({
      shared_key: idx_comp ?? "",
      xml: "false",
      keyword: idx_state ?? "", // id area bali 5BFD4F38-7BB4-40AB-BF0C-1B88F999BA5B
      date_from: date,
      date_to: date,
      code_of_language: language,
      code_of_currency: currency,
      page_set_item: "10000",
      page_set_position: "1",
      id_holiday_type: selectedTypesById,
      id_holiday_duration: "",
      price_from: "0",
      price_to: "0",
      order_by_NP: "P",
      order_by_01: sorting,
      promo_code: "R-BC",
    });

    fetch("https://api.govacation.biz/excursion.asmx/v2_product_explore", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        setDetailDestinationApi(data.msg.product_list);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => {
        setIsLoadList(false); // ✅ Loading selesai
      });
  }, [language, currency, apply, idx_state, selectedSorting]);

  // Holiday Tipe Master API
  useEffect(() => {
    setIsLoadHoliday(true);
    const formBody = new URLSearchParams({
      shared_key: idx_comp ?? "",
      xml: "false",
      keyword: idx_state ?? "", // id area bali 5BFD4F38-7BB4-40AB-BF0C-1B88F999BA5B
      date_from: date,
      date_to: date,
      code_of_language: language,
      code_of_currency: currency,
      page_set_item: "10000",
      page_set_position: "1",
      id_holiday_type: selectedTypesById,
      id_holiday_duration: "",
      price_from: "0",
      price_to: "0",
      order_by_NP: "P",
      order_by_01: "0",
      promo_code: "R-BC",
    });

    fetch("https://api.govacation.biz/excursion.asmx/v2_product_explore", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        setMasterHolidayApi(data.msg.holiday_type);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => {
        setIsLoadHoliday(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;
      const dropdown = document.getElementById("dropdown");
      const button = document.getElementById("dropdownDefaultButton");
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        button &&
        !button.contains(event.target as Node)
      ) {
        setIsSortingOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Login with Google
  const { data: session, status } = useSession();
  const { profile, setProfile } = useProfile();
  // Handle Profile Data
  useEffect(() => {
    const handleOAuth = async () => {
      if (status == "authenticated") {
        const email = session.user?.email ?? "";
        const [firstname, lastname] = splitUsername(
          session.user?.name ?? ""
        ) ?? ["-", "-"];

        const ProfilPay = {
          email,
          firstname,
          lastname,
          phone: "",
          temp: "false",
        };
        setProfile(ProfilPay);
        // 🔹 Simpan ke localStorage
        localStorage.setItem("profilePay", JSON.stringify(ProfilPay));
        localStorage.setItem("profileData", JSON.stringify(ProfilPay));
      }
    };

    handleOAuth();
  }, [session]);

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
        <div className="hidden md:block   px-6 pb-6 text-gray-700">
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
              {isLoadHoliday ? (
                <>
                  <div
                    role="status"
                    className="animate-pulse flex items-center gap-3 mb-2"
                  >
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>

                    <div className="h-2.5 w-24 bg-gray-300 rounded-full"></div>

                    <span className="sr-only">Loading...</span>
                  </div>
                  <div
                    role="status"
                    className="animate-pulse flex items-center gap-3 mb-2"
                  >
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>

                    <div className="h-2.5 w-24 bg-gray-300 rounded-full"></div>

                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  <Checkbox
                    title={"ALL TYPE"}
                    onChange={handleCheckboxChange}
                    value={""}
                  />
                  {masterHolidayApi.map((item) => (
                    <Checkbox
                      key={item.holiday_type}
                      title={item.holiday_type}
                      onChange={handleCheckboxChange}
                      value={item.holiday_type_id}
                    />
                  ))}
                </>
              )}
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
          {/* Filter Mobile */}
          {isLoadHoliday ? (
            <>
              {/* Skeleton Badge */}
              <div
                role="status"
                className="animate-pulse w-auto h-10 px-4 rounded-lg bg-gray-300 flex items-center gap-2"
              >
                <div className="h-2.5 w-16 bg-gray-200 rounded-full"></div>

                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>

                <span className="sr-only">Loading...</span>
              </div>

              <div
                role="status"
                className="animate-pulse w-auto h-10 px-4 rounded-lg bg-gray-300 flex items-center gap-2"
              >
                <div className="h-2.5 w-16 bg-gray-200 rounded-full"></div>

                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>

                <span className="sr-only">Loading...</span>
              </div>

              <div
                role="status"
                className="animate-pulse w-auto h-10 px-4 rounded-lg bg-gray-300 flex items-center gap-2"
              >
                <div className="h-2.5 w-16 bg-gray-200 rounded-full"></div>

                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>

                <span className="sr-only">Loading...</span>
              </div>
            </>
          ) : (
            <>
              {/* Button Bottom Sheet */}
              <div
                className="w-10 h-10 border-1 border-gray-500 rounded-lg text-center align-middle flex items-center justify-center p-2"
                onClick={() => setOpenBottomSheet(true)}
              >
                <FontAwesomeIcon
                  icon={faSliders}
                  className="w-5 h-5 text-gray-500"
                />
              </div>

              {/* Button All Type */}
              <div
                key={`mobileHoliday-all-type`}
                className={`w-auto h-10  border-gray-500  ${
                  "ALL TYPE" == SelectBadgeFilterMobile
                    ? "bg-red-200 border-1 border-red-500"
                    : "border-1"
                }  rounded-lg text-center align-middle flex items-center justify-center p-2 whitespace-nowrap`}
                onClick={() => {
                  if ("ALL TYPE" == SelectBadgeFilterMobile) {
                    setSelectBadgeFilterMobile("");
                    handleApplyMobile();
                  } else {
                    setSelectBadgeFilterMobile("ALL TYPE");
                    setSelectedTypesById("");
                    handleApplyMobile();
                  }
                }}
              >
                <p className="text-sm text-gray-500">
                  {capitalizeWords("ALL TYPE")}
                </p>

                {/* {"ALL TYPE" == SelectBadgeFilterMobile && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-5 h-5 text-red-600"
                  />
                )} */}
              </div>

              {/* Button Master Holiday Type */}
              {masterHolidayApi.map((item) => (
                <div
                  key={`mobileHoliday-${item.holiday_type}`}
                  className={`w-auto h-10  border-gray-500  ${
                    selectedTypesHolidayArrMob.includes(item.holiday_type_id)
                      ? "bg-red-200 border-1 border-red-500"
                      : "border-1"
                  }  rounded-lg text-center align-middle flex items-center justify-center p-2 whitespace-nowrap`}
                  onClick={() => {
                    //Kalo sama unchecked
                    if (
                      selectedTypesHolidayArrMob.includes(item.holiday_type_id)
                    ) {
                      // setSelectBadgeFilterMobile("");
                      // handleApplyMobile();
                      handleBadgeChange(
                        false,
                        item.holiday_type,
                        item.holiday_type_id
                      );
                    } else {
                      // kalo tidak sama checked
                      handleBadgeChange(
                        true,
                        item.holiday_type,
                        item.holiday_type_id
                      );
                      // setSelectBadgeFilterMobile(item.holiday_type);
                      // setSelectedTypesById(item.holiday_type_id);
                      // handleApplyMobile();
                    }
                  }}
                >
                  <p className="text-sm text-gray-500">
                    {capitalizeWords(item.holiday_type)}
                  </p>

                  {/* {item.holiday_type == SelectBadgeFilterMobile && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="w-5 h-5 text-red-600"
                    />
                  )} */}
                </div>
              ))}
            </>
          )}
        </div>
        {/* Konten Kanan */}
        <div className="w-full md:w-5/6  md:px-6 pb-6 text-black">
          {/* Baris Search dan Badge */}
          <div className="hidden md:flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Search akan full width di HP */}
            <div className="w-xl"></div>

            <div className="relative w-50 flex justify-end">
              <button
                id="dropdownDefaultButton"
                className="text-gray-500 focus:ring-2 focus:outline-none focus:ring-red-300 
               font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                type="button"
                onClick={() => setIsSortingOpen(!isSortingOpen)}
              >
                Sorting{" "}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {isSortingOpen && (
                <div
                  id="dropdown"
                  className="absolute right-0 top-full mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
                >
                  <ul
                    className="py-2 text-sm text-gray-700"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    <li className="cursor-pointer">
                      <span
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedSorting("price asc");
                        }}
                      >
                        Price Ascending
                      </span>
                    </li>
                    <li className="cursor-pointer">
                      <span
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedSorting("price desc");
                        }}
                      >
                        Price Descending
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Baris Card Baru */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 py-4">
            {isLoadList ? (
              <>
                <SkeletonCardList />
                <SkeletonCardList />
                <SkeletonCardList />
                <SkeletonCardList />
              </>
            ) : DetailDestinationApi.length > 0 ? (
              DetailDestinationApi.map((item, index) =>
                isMobile ? (
                  // Mobile layout
                  <ListCardMobile
                    key={`ListCardMobile-${index}`}
                    idx_comp={idx_comp ?? ""}
                    idx_excursion={item.excursion_id}
                    // image={`https://picsum.photos/800/600?random=${index}`}
                    image={`${host_img}/${item.picture}`}
                    title={capitalizeWords(item.excursion_name).toUpperCase()}
                    sub_title={`${item.holiday_type} • ${item.holiday_duration} | ${item.location_state}, ${item.location_country}`.toUpperCase()}
                    price={item.price_in_format ?? 0}
                    currency={item.currency ?? "Rp"}
                    link={`/destination/details/${country}?id=${idx_comp}&country=${country}&state=${state}&exc=${item.excursion_id}`}
                    colorWish={
                      ListWist.some(
                        (wish) => wish.idx_excursion === item.excursion_id
                      )
                        ? true
                        : false
                    }
                  />
                ) : (
                  // Desktop Layout
                  <ListCard
                    key={`ListCard-${index}`}
                    idx_comp={idx_comp ?? ""}
                    idx_excursion={item.excursion_id}
                    // image={`https://picsum.photos/800/600?random=${index}`}
                    image={`${host_img}/${item.picture}`}
                    title={item.excursion_name}
                    sub_title={`${item.holiday_type} • ${item.holiday_duration} | ${item.location_state}, ${item.location_country}`.toUpperCase()}
                    price={item.price_in_format ?? 0}
                    currency={item.currency ?? "Rp"}
                    link={`/destination/details/${country}?id=${idx_comp}&country=${country}&state=${state}&exc=${item.excursion_id}`}
                    colorWish={
                      ListWist.some(
                        (wish) => wish.idx_excursion === item.excursion_id
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
                      src="/images/error/empty.jpg"
                      alt=""
                      className="w-50 md:w-100 h-auto"
                    />
                    <p className="text-2xl">Activities not found</p>
                  </>
                )}
              </div>
            )}

            <ModalBottomSheet
              isOpen={openBottomSheet}
              onClose={() => setOpenBottomSheet(false)}
            >
              <div className="text-center">
                <h2 className="text-lg font-bold mb-2">Filter</h2>
                {/* <p>Isi Filter Disini</p> */}
                <div className="flex items-center mb-4">
                  <input
                    id="default-radio-1"
                    type="radio"
                    value="price asc"
                    name="filter"
                    checked={selectedSorting === "price asc"}
                    onChange={(e) => setSelectedSorting(e.target.value)}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-gray-900 "
                  >
                    Price Asc
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="default-radio-2"
                    type="radio"
                    value="price desc"
                    name="filter"
                    checked={selectedSorting === "price desc"}
                    onChange={(e) => setSelectedSorting(e.target.value)}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                  />
                  <label
                    htmlFor="default-radio-2"
                    className="ms-2 text-sm font-medium text-gray-900 "
                  >
                    Price Desc
                  </label>
                </div>

                <button
                  onClick={() => setOpenBottomSheet(false)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                >
                  Tutup
                </button>
              </div>
            </ModalBottomSheet>
          </div>
        </div>
      </section>
    </div>
  );
}
