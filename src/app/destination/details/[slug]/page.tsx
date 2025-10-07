"use client";
// State
import { useState, useEffect, useRef } from "react";

import Galery from "@/components/Galery";
import ProductSub from "@/components/ProductSubCard";
import { GLOBAL_VAR } from "@/lib/globalVar";
import { API_HOSTS } from "@/lib/apihost";

// Context Global
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDate } from "@/context/DateContext";
import { useInitial } from "@/context/InitialContext";
import { useProfile } from "@/context/ProfileContext";
import { useCartApi } from "@/context/CartApiContext";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowAltCircleDown,
  faCalendarAlt,
  faCalendarCheck,
  faCalendarDays,
  faCalendarWeek,
  faCaretDown,
  faChevronDown,
  faCircleDown,
  faClock,
  faClockRotateLeft,
  faListCheck,
  faMinusCircle,
  faPlusCircle,
  faTicketSimple,
  faUser,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import SkeletonDetailProduk from "@/components/SkeletonDetailProduk";
import { useSearchParams } from "next/navigation";
import { log } from "console";
import { toLowerCaseAll } from "@/helper/helper";
// Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "@/components/Breadcrumb";
import Spinner from "@/components/Spinner";
import SkeletonDetailProdukSub from "@/components/SkeletonDetailProdukSub";

export default function DetailDestination() {
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //ini dari idx_comp
  const idx_excursion = searchParams.get("exc"); //ini dari idx_excursion
  const country = searchParams.get("country");
  const state = searchParams.get("state");
  const transaction_id = searchParams.get("transaction_id");

  const [isDropdownPersonOpen, setDropdownPersonOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("");

  const [isDropdownProductSubOpen, setDropdownProductSubOpen] = useState(false);
  const [selectedProductSub, setSelectedProductSubOpen] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [defaultCancelText, setDefaultCanceText] = useState("");

  // Currency
  const { currency, setCurrency, masterCurrency, setMasterCurrency } =
    useCurrency();
  // Language
  const { language, setLanguage, masterLanguage, setMasterLanguage } =
    useLanguage();
  // Date Global
  const { date, setDate } = useDate();
  // Initial Global (AgentId dan RepCode)
  const {
    agent,
    setAgent,
    repCode,
    setRepCode,
    resourceInitial,
    setResourceInitial,
    profileInitial,
    setProfileInitial,
  } = useInitial();
  // Profil
  const { profile } = useProfile();
  // Cart API
  const { saveCartApi } = useCartApi();

  type ProductDetail = {
    excursion_name: string;
    info_location: string;
    info_category: string;
    info_duration: string;
    info_general: string;
    info_sortdesc: string;
    info_facilities: string;
    info_pickup_service: string;
    info_finish_time: string;
    picture: string;
    gallery: string;
  };

  type ProductSub = {
    excursion_id: string;
    sub_excursion_name: string;
    sub_excursion_id: string;
    minimum_pax: string;
    maximum_pax: string;
    picture: string;
    latitude: string;
    longitude: string;
    currency: string;
    price: string;
    status: string;
    buy_currency_id: string | null;
  };

  type ProductMsg = {
    product_details: ProductDetail[];
    product_subs: ProductSub[];
    product_pickup_list: any[]; // bisa diperjelas nanti kalau tahu isinya
  };

  type ProductResponse = {
    error: string;
    msg: ProductMsg;
    len: {
      current_row: string;
      total_row: string;
      total_page: string;
      time: string;
    };
    id: string;
  };

  const [dataProduct, setDataProduct] = useState<ProductResponse | null>(null);
  const [dataProductSub, setDataProductSub] = useState<ProductResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProdukDetail, setIsLoadingProdukDetail] = useState(true);
  const [isLoadingProdukDetailSub, setIsLoadingProdukDetailSub] =
    useState(true);
  const [error, setError] = useState<string | null>(null);

  // Konversi string ke Date (atau fallback ke hari ini jika kosong)
  const initialDate = date ? new Date(date) : new Date();
  // Datepicker Local
  const disabledDates = [new Date("2025-07-16"), new Date("2025-07-25")];
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  // open dropdown pax (adult, child, infant)
  const [openDropdownPax, setOpenDropdownPax] = useState(false);
  // open date avaibility
  const [openDateAvaibility, setOpenDateAvaibility] = useState(false);
  // set adult, child, infant
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [valDropdownPax, setValDropdownPax] = useState("Adult x 1");
  // Handle Close OnClick Out Reference
  const refPax = useRef<HTMLDivElement>(null);
  const refDate = useRef<HTMLDivElement>(null);
  const [childAges, setChildAges] = useState<string[]>([]);

  // Hanlde Child Age
  const handleAgeChange = (index: number, value: string) => {
    const updatedAges = [...childAges];
    updatedAges[index] = value;
    setChildAges(updatedAges);
  };

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (refPax.current && !refPax.current.contains(target)) {
        setOpenDropdownPax(false);
      }

      if (refDate.current && !refDate.current.contains(target)) {
        setOpenDateAvaibility(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let parts: string[] = [];

    if (adultCount > 0) {
      parts.push(`Adl x ${adultCount}`);
    }

    if (childCount > 0) {
      parts.push(`Chd x ${childCount}`);
    }

    if (infantCount > 0) {
      parts.push(`Inf x ${infantCount}`);
    }

    if (adultCount == 0 && childCount == 0 && infantCount == 0) {
      setAdultCount(1);
    }

    let text = parts.join(", ");

    setValDropdownPax(text);
  }, [adultCount, childCount, infantCount]);

  // Detail Tour / Produk Detail
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: idx_excursion ?? "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        code_of_language: language, // DE
        code_of_currency: currency, // IDR
        promo_code: "R-BC",
      });

      try {
        const res = await fetch(
          // `${API_HOSTS.host1}/excursion.asmx/v2_product_description`,
          `${API_HOSTS.host1}/excursion.asmx/product_description`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const json = await res.json();
          setDataProduct(json);
        }
      } catch (err: any) {
        setError(err.message || "Error");
        setIsLoading(false);
        setIsLoadingProdukDetail(false);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
        setIsLoadingProdukDetail(false); // Loading Produk
      }
    };

    fetchData();
  }, [idx_excursion, idx_comp, currency, language]);

  // Produk Detail Sub
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: idx_excursion ?? "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        code_of_language: language, // DE
        code_of_currency: currency, // IDR
        promo_code: "R-BC",
      });

      try {
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/product_sub`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const json = await res.json();
          console.log("Poduct Sub", json);
          setDataProductSub(json);
        }
      } catch (err: any) {
        setError(err.message || "Error");
        setIsLoading(false);
        setIsLoadingProdukDetail(false);
        setIsLoadingProdukDetailSub(false);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
        setIsLoadingProdukDetail(false); // Loading Produk
        setIsLoadingProdukDetailSub(false); // Loading Produk Sub
      }
    };
    fetchData();
  }, [idx_excursion, idx_comp, currency, language]);

  useEffect(() => {
    setSelectedDate(new Date(date));
  }, [date]);

  // Cek Initial Agent dan Repcode
  useEffect(() => {
    // Load ulang initial jika agent kosong
    const fetchDataInitial = async () => {
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
      });

      try {
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const json = await res.json();
          console.log(json);
          console.log("Canceled : ", json);
          fetchSecondDataInitial(json.msg);
          setRepCode(json.msg.default_rep_code); //R-BC
          setDefaultCanceText(json.msg.default_cancelText); //Cancel Text
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
      }
    };

    const fetchSecondDataInitial = async (param: any) => {
      try {
        const formBody = new URLSearchParams({
          shared_key: idx_comp ?? "",
          xml: "false",
          keyword: `|${profile.email}`,
          date: date,
          code_of_language: param.default_language,
          code_of_currency: param.default_currency,
          promo_code: param.default_rep_code,
          email: profile.email ?? "",
          mobile: profile.phone ?? "",
        });
        console.log(formBody.toString());
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_product_search_initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        const json = await res.json();
        console.log("Response 2:", json.msg);
        console.log("Cart Item :", json.msg.cart_item);
        const languageList = json.msg.company_language.map((item: any) => ({
          MSLanguage: item.language_code,
        }));
        const currencyList = json.msg.company_currency.map((item: any) => ({
          Currency: item.currency_code,
        }));
        // Set dari api v2_product_search_initialize
        setMasterLanguage(languageList);
        setLanguage(param.default_language);
        setMasterCurrency(currencyList);
        let presentCurrency = localStorage.getItem("currency") ?? "";
        if (presentCurrency == "") {
          setCurrency(param.default_currency);
          localStorage.setItem("currency", param.default_currency); // simpan ke localStorage
        } else {
          const isPresentCurrency = currencyList.some(
            (item: any) => item.Currency === presentCurrency
          );
          if (isPresentCurrency) {
            setCurrency(presentCurrency);
            localStorage.setItem("currency", presentCurrency); // simpan ke localStorage
          } else {
            setCurrency(param.default_currency);
            localStorage.setItem("currency", param.default_currency); // simpan ke localStorage
          }
        }
        setAgent(json.msg.resource.agent_id);
        setResourceInitial(json.msg.resource);
        setProfileInitial(json.msg.profile);
        localStorage.setItem("language", param.default_language); // simpan ke localStorage
        localStorage.setItem(
          "resource_initial",
          JSON.stringify(json.msg.resource)
        );
        localStorage.setItem(
          "profile_initial",
          JSON.stringify(json.msg.profile)
        );
        saveCartApi(json.msg.cart_item);

        // proses hasil dari fetch kedua di sini
      } catch (err: any) {
        console.error("Fetch kedua error:", err);
      }
    };

    if (date != "") {
      fetchDataInitial();
    }
  }, [date]);

  // Last search
  useEffect(() => {
    if (!idx_excursion) return;

    // Ambil data lama
    let stored: string[] = JSON.parse(
      localStorage.getItem("last-search") || "[]"
    );

    // Hapus dulu kalau sudah ada (biar nggak dobel)
    stored = stored.filter((item) => item !== idx_excursion);

    // Masukkan di posisi paling depan
    stored.unshift(idx_excursion);

    // Batasi maksimal 5 item
    if (stored.length > 5) {
      stored = stored.slice(0, 5);
    }

    // Simpan lagi
    localStorage.setItem("last-search", JSON.stringify(stored));
  }, [idx_excursion]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // initial
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const maximum_pax =
    dataProduct != null && dataProduct.msg.product_subs.length > 0
      ? parseInt(dataProduct.msg.product_subs[0].maximum_pax)
      : 1;

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4">
        <Breadcrumb
          pageName="Activity"
          country={country || ""}
          state={state || ""}
          idx_comp={idx_comp || ""}
        />
        {/* Baris Title */}
        {!isLoadingProdukDetail ? (
          <>
            <div className="flex flex-row justify-between items-center mt-4">
              <div className="text-gray-700 w-full">
                <h3 className="text-xl md:text-4xl font-bold">
                  {/*EXMP : TANAH LOT BALI */}
                  {dataProduct != null
                    ? dataProduct.msg.product_details[0].excursion_name
                    : ""}
                </h3>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center mt-4">
              <div className="text-gray-700 w-1/2">
                <h3 className="text-sm md:text-lg font-semibold md:font-bold text-left">
                  {/*DESC : Beraban, Kediri, Kabupaten Tabanan, Bali */}
                  {dataProduct != null
                    ? dataProduct.msg.product_details[0].info_location
                    : ""}
                </h3>
              </div>
              <div className="text-gray-700 w-1/2">
                <h3 className="text-sm md:text-lg font-semibold md:font-bold text-right text-red-500"></h3>
              </div>
            </div>
            {/* Baris Galery */}

            <Galery
              picture={
                dataProduct != null &&
                dataProduct.msg.product_details.length > 0
                  ? dataProduct.msg.product_details[0].picture
                  : ""
              }
              galery={
                dataProduct != null
                  ? dataProduct.msg.product_details[0].gallery
                  : ""
              }
            />
          </>
        ) : (
          <SkeletonDetailProduk />
        )}

        {/* Baris Content */}
        <div className="flex flex-col md:flex-row pb-5 gap-5 mt-5">
          <div className="order-2 md:order-1 w-full md:flex-[5] text-gray-600">
            {/* Short Description */}
            <p className="font-normal text-md text-justify">
              {dataProduct != null &&
              dataProduct.msg.product_details[0].info_sortdesc != null
                ? dataProduct.msg.product_details[0].info_sortdesc.replace(
                    /<[^>]*>/g,
                    ""
                  )
                : ""}
            </p>
            {/* About Activity */}
            <p className="font-bold text-lg mt-3">About this activity</p>
            <div className="w-full flex flex-row gap-5 mt-5">
              {/* Kiri */}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-row w-full mb-5">
                  <div className="mr-2">
                    <FontAwesomeIcon
                      icon={faCalendarCheck}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-md">Free cancellation</p>
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: defaultCancelText ?? "",
                      }}
                    ></p>
                  </div>
                </div>

                <div className="flex flex-row w-full mb-5">
                  <div className="mr-2">
                    <FontAwesomeIcon
                      icon={faClockRotateLeft}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-md">
                      Duration{" "}
                      {dataProduct != null
                        ? dataProduct.msg.product_details[0].info_duration
                        : ""}
                    </p>
                    <p className="text-sm">
                      Check availability to see starting times
                    </p>
                  </div>
                </div>

                <div className="flex flex-row w-full mb-5">
                  <div className="mr-2">
                    <FontAwesomeIcon
                      icon={faUserCheck}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-md">Live tour guide</p>
                    <p className="text-sm">English</p>
                  </div>
                </div>

                <div className="flex flex-row w-full mb-5">
                  <div className="mr-2">
                    <FontAwesomeIcon
                      icon={faListCheck}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-md">Facilities</p>
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html:
                          dataProduct != null &&
                          dataProduct.msg.product_details[0].info_facilities
                            ? dataProduct.msg.product_details[0].info_facilities
                            : "-",
                      }}
                    ></p>
                  </div>
                </div>
              </div>

              {/* Kanan */}
              <div className="w-1/3">
                <div className="bg-gray-200 shadow-lg rounded-lg p-5">
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">From</p>
                      <p className="font-bold text-lg">EUR 180.000</p>
                      <p className="text-sm">per person</p>
                    </div>
                    <div className="flex flex-col">
                      <button
                        className="w-60 bg-red-600 text-white font-bold rounded-2xl px-4 py-2"
                        onClick={() => {
                          // document
                          //   .getElementById("availability-section")
                          //   ?.scrollIntoView({ behavior: "smooth" });

                          window.scrollTo({
                            top: 1000,
                            behavior: "smooth",
                          });

                          const target = document.getElementById(
                            "availability-section"
                          );

                          if (target) {
                            // target.scrollIntoView({ behavior: "smooth" });

                            // kasih efek highlight sementara
                            target.classList.add("ring-2", "ring-gray-500");
                            setTimeout(() => {
                              target.classList.remove(
                                "ring-2",
                                "ring-gray-500"
                              );
                            }, 1500); // hilang setelah 1.5 detik
                          }
                        }}
                      >
                        Check Avaibility
                      </button>
                    </div>
                  </div>
                  <div className="w-full flex flex-row mt-2">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="w-4 h-4 text-gray-500 mr-1"
                      size="sm"
                    />
                    <p className="text-xs">
                      Reserve now & pay later to book your spot and pay nothing
                      today.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Judul Deskripsi  */}
            <p className="font-bold text-lg mt-5">
              {/* The Legendary Charm of Tanah Lot Temple: Bali's Eternal Wonder */}
              {dataProduct != null
                ? dataProduct.msg.product_details[0].excursion_name
                : ""}{" "}
              {dataProduct != null
                ? dataProduct.msg.product_details[0].info_location
                : ""}{" "}
              {dataProduct != null
                ? dataProduct.msg.product_details[0].info_category
                : ""}
            </p>
            {/* Deskripsi  */}
            <div
              className="prose max-w-none text-justify text-sm text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  dataProduct != null
                    ? dataProduct.msg.product_details[0].info_general
                    : "",
              }}
            />

            {/* Card Check Available */}
            <div
              className="w-full h-40 bg-gray-300 rounded-2xl mt-5 p-8"
              id="availability-section"
            >
              <p className="text-lg font-semibold">
                Select participants, date, and language
              </p>

              <div className="flex flex-row items-center justify-between mt-5">
                {/* Kiri: input-input */}
                <div className="flex flex-row gap-5">
                  {/* Pax Adult, Child, Infant */}
                  <div className="relative" ref={refPax}>
                    {/* Trigger */}
                    <div
                      className="h-10 w-70 px-3 flex flex-row justify-between items-center bg-white rounded-xl cursor-pointer"
                      onClick={() => setOpenDropdownPax(!openDropdownPax)}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="w-4 h-4 text-gray-500 mr-2"
                          size="lg"
                        />
                        <p className="text-sm font-bold">
                          {valDropdownPax}
                          {/* Adult x 1, Child x 1, Infant x 1 */}
                        </p>
                      </div>
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                          openDropdownPax ? "rotate-180" : ""
                        }`}
                        size="lg"
                      />
                    </div>

                    {/* Dropdown list muncul di bawah trigger */}
                    {openDropdownPax && (
                      <div className="absolute top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                        <ul className="py-2">
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-around">
                            <p className="w-10 font-semibold">Adult</p>
                            <FontAwesomeIcon
                              icon={faMinusCircle}
                              className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                openDropdownPax ? "rotate-180" : ""
                              }`}
                              size="lg"
                              onClick={() => {
                                if (adultCount > 0) {
                                  setAdultCount(adultCount - 1);
                                }
                              }}
                            />
                            <p className="w-5 text-center">{adultCount}</p>
                            <FontAwesomeIcon
                              icon={faPlusCircle}
                              className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                openDropdownPax ? "rotate-180" : ""
                              }`}
                              size="lg"
                              onClick={() => {
                                setAdultCount(adultCount + 1);
                              }}
                            />
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-100 flex flex-col">
                            <div className="flex flex-row justify-around items-center">
                              <p className="w-10 font-semibold">Child</p>
                              <FontAwesomeIcon
                                icon={faMinusCircle}
                                className="w-4 h-4 text-red-400"
                                onClick={() =>
                                  childCount > 0 &&
                                  setChildCount(childCount - 1)
                                }
                              />
                              <p className="w-5 text-center">{childCount}</p>
                              <FontAwesomeIcon
                                icon={faPlusCircle}
                                className="w-4 h-4 text-red-400"
                                onClick={() => setChildCount(childCount + 1)}
                              />
                            </div>

                            {/* Input umur anak */}
                            {childCount > 0 && (
                              <div className="mt-2 ml-5 flex flex-col gap-1">
                                {[...Array(childCount)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <p className="text-xs w-10 text-gray-500">
                                      Age {i + 1}
                                    </p>
                                    <input
                                      type="number"
                                      min="0"
                                      max="12"
                                      className="w-16 px-2 py-1 border rounded-md text-sm"
                                      value={childAges[i] || ""}
                                      onChange={(e) =>
                                        handleAgeChange(i, e.target.value)
                                      }
                                      placeholder="0–12"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </li>

                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-around">
                            <p className="w-10 font-semibold">Infant</p>
                            <FontAwesomeIcon
                              icon={faMinusCircle}
                              className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                openDropdownPax ? "rotate-180" : ""
                              }`}
                              size="lg"
                              onClick={() => {
                                if (infantCount > 0) {
                                  setInfantCount(infantCount - 1);
                                }
                              }}
                            />
                            <p className="w-5 text-center">{infantCount}</p>
                            <FontAwesomeIcon
                              icon={faPlusCircle}
                              className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                openDropdownPax ? "rotate-180" : ""
                              }`}
                              size="lg"
                              onClick={() => {
                                setInfantCount(infantCount + 1);
                              }}
                            />
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Select Date */}
                  <div
                    className="relative h-10 w-50 flex flex-row justify-around items-center bg-white rounded-xl cursor-pointer"
                    ref={refDate}
                  >
                    <div
                      className="h-10 w-50 px-3 flex flex-row justify-around items-center bg-white rounded-xl cursor-pointer"
                      onClick={() => {
                        setOpenDateAvaibility(!openDateAvaibility);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="w-4 h-4 text-gray-500 mr-1"
                        size="lg"
                      />
                      {/* <p className="text-sm font-bold">Select Date</p> */}
                      <p className="text-sm font-bold">
                        {selectedDate
                          ? selectedDate.toLocaleDateString("en-GB") // format: dd/mm/yyyy
                          : ""}
                      </p>
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                          openDateAvaibility ? "rotate-180" : ""
                        }`}
                        size="lg"
                      />
                    </div>
                    {openDateAvaibility && (
                      <div className="absolute top-full mt-2 right-0 z-10 bg-white shadow-lg rounded">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => {
                            setSelectedDate(date);
                            if (date) {
                              // Format ke yyyy-mm-dd dan simpan di context
                              const formatted = date
                                .toISOString()
                                .split("T")[0];
                              setDate(formatted);
                              localStorage.setItem("booking_date", formatted);
                            }
                          }}
                          minDate={(() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            return tomorrow;
                          })()}
                          inline
                          className="p-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* Find Pickup */}
                  <div className="h-10 w-60 px-3 flex flex-row justify-around items-center bg-white rounded-xl">
                    <p className="text-sm font-bold">Find Pickup ...</p>
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className="w-4 h-4 text-gray-500 ml-2"
                      size="lg"
                    />
                  </div>
                </div>

                {/* Kanan: button */}
                <button className="w-60 bg-red-600 text-white font-bold rounded-2xl px-4 py-2">
                  Check Availability
                </button>
              </div>
            </div>

            <p className="text-md font-semibold mt-5">
              Choose from 1 available option
            </p>

            {/* Card Sub Excursion */}
            <div className="w-full rounded-2xl mt-5 hover:border-2 border-gray-400 shadow-md bg-gray-100">
              {/* Desc */}
              <div className="flex flex-row p-5 justify-between gap-10">
                <div className="flex flex-col">
                  <h1 className="text-md font-bold">Tanah Lot, Bali</h1>
                  <p className="text-sm">
                    Pickup : THE SAMAYA UBUD | Meet at the lobby
                  </p>

                  {/* Room number */}
                  <input
                    type="text"
                    placeholder="Enter Room Number (Optional)"
                    value=""
                    onChange={(e) => {}}
                    className="text-gray-600 text-sm border border-gray-300 w-full h-8 rounded-md mt-2
                   focus:outline-none focus:ring-0 focus:border-2 focus:border-blue-300"
                  />

                  {/* Time input */}
                  <div className="relative inline-block mt-2">
                    {/* Ikon jam */}
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="w-4 h-4 text-gray-600"
                      />
                    </div>

                    <input
                      type="time"
                      id="time"
                      value="07:00"
                      onChange={(e) => {}}
                      required
                      className="text-gray-600 text-sm border border-gray-300 pl-8 w-32 h-8 
                     bg-gray-100 rounded-md focus:outline-none focus:ring-0 
                     focus:border-2 focus:border-blue-300"
                    />
                  </div>
                </div>
                {/* Badge */}
                <div className="flex flex-col flex-2/3">
                  <h1 className="text-sm font-bold">Add Surcharge</h1>
                  <div className="flex flex-row gap-2 flex-wrap">
                    <span className="bg-gray-300 text-gray-800 text-xs font-semibold me-2 px-2.5 py-1 rounded-md border border-red-700">
                      GUIDE SURCHARGE FOREIGN ~ EUR 10.00
                    </span>
                    <span className="bg-gray-300 text-gray-800 text-xs font-semibold me-2 px-2.5 py-1 rounded-md">
                      GUIDE SURCHARGE FOREIGN ~ EUR 10.00
                    </span>
                    <span className="bg-gray-300 text-gray-800 text-xs font-semibold me-2 px-2.5 py-1 rounded-md">
                      GUIDE SURCHARGE FOREIGN ~ EUR 10.00
                    </span>
                    <span className="bg-gray-300 text-gray-800 text-xs font-semibold me-2 px-2.5 py-1 rounded-md">
                      GUIDE SURCHARGE FOREIGN ~ EUR 10.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div
                className="flex flex-row justify-between gap-7 border-t-2 border-red-700 
                  bg-gray-300 rounded-b-2xl p-5"
              >
                {/* Left side (pricing) */}
                <div className="flex flex-row gap-5">
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold">EUR 180.00</h1>
                    <p className="text-xs">1 Adult x Rp 676,851</p>
                    <p className="text-xs">1 Youth x Rp 451,234</p>
                    <p className="text-xs">1 Child x Rp 0</p>
                    <p className="text-xs mt-2 italic">
                      *All taxes and fees included
                    </p>
                  </div>
                  <div className="flex flex-col mt-7">
                    <p className="text-xs">Surcharge Rp 265.00</p>
                    <p className="text-xs">Discount Rp 265.00</p>
                  </div>
                </div>

                {/* Right side (button) */}
                <div className="flex flex-col items-center justify-center">
                  <button className="w-60 bg-red-600 text-white font-bold rounded-2xl px-4 py-2">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
