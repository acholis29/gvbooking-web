"use client";
// State
import { useState, useEffect, useRef } from "react";

import Galery from "@/components/Galery";
import ProductSubNew from "@/components/ProductSubNewCard";
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
  faCalendarAlt,
  faCalendarCheck,
  faCaretDown,
  faClock,
  faClockRotateLeft,
  faListCheck,
  faMinusCircle,
  faPlusCircle,
  faSearch,
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
// import SelectCustomAsynNew from "@/components/SelectCustomAsynNew";
import dynamic from "next/dynamic";
const SelectCustomAsynNew = dynamic(
  () => import("@/components/SelectCustomAsynNew"),
  {
    ssr: false,
  }
);

// Form Libraries
import { useForm, Controller, useFieldArray } from "react-hook-form";

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
  const [labelSelectPickup, setLabelSelectPickup] = useState<string>("");
  const [pickupTimeFrom, setPickupTimeFrom] = useState<string>("");

  // Check avaibility
  const [checkAvaibility, setCheckAvaibility] = useState(false);
  // Pickup Area
  const [pickupAreaId, setPickupAreaId] = useState("");

  // Form Validate
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    setCheckAvaibility(true);
    setPickupAreaId(data.pickup_area);
  };

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
    let age = parseInt(value);
    if (isNaN(age)) age = 1;
    if (age < 1) age = 1;
    if (age > 12) age = 12;

    const updatedAges = [...childAges];
    updatedAges[index] = age.toString();
    setChildAges(updatedAges);
  };

  // Hanlde First Load Age
  const prevCountRef = useRef(childCount);
  useEffect(() => {
    // kalau childCount bertambah (increment)
    if (childCount > prevCountRef.current) {
      const diff = childCount - prevCountRef.current;
      setChildAges((prev) => [...prev, ...Array(diff).fill("12")]);
    }
    // kalau berkurang, hapus elemen dari akhir
    else if (childCount < prevCountRef.current) {
      setChildAges((prev) => prev.slice(0, childCount));
    }

    // simpan nilai terbaru untuk perbandingan berikutnya
    prevCountRef.current = childCount;
  }, [childCount]);

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
                      {/* <p className="font-bold text-lg">EUR 180.000</p> */}
                      <p className="font-bold text-lg">
                        {dataProductSub?.msg.product_subs[0].currency ?? ""}{" "}
                        {dataProductSub?.msg.product_subs[0].price ?? ""}
                      </p>
                      <p className="text-sm">per person</p>
                    </div>
                    <div className="flex flex-col">
                      <button
                        className="w-60 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl px-4 py-2 cursor-pointer"
                        onClick={() => {
                          // Scroll ke card check avaibility
                          window.scrollTo({
                            top: 1900,
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                    setCheckAvaibility(false);
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
                                  setCheckAvaibility(false);
                                }}
                              />
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 flex flex-col">
                              <div className="flex flex-row justify-around items-center">
                                <p className="w-10 font-semibold">Child</p>
                                <FontAwesomeIcon
                                  icon={faMinusCircle}
                                  className="w-4 h-4 text-red-400"
                                  onClick={() => {
                                    childCount > 0 &&
                                      setChildCount(childCount - 1);
                                    setCheckAvaibility(false);
                                  }}
                                />
                                <p className="w-5 text-center">{childCount}</p>
                                <FontAwesomeIcon
                                  icon={faPlusCircle}
                                  className="w-4 h-4 text-red-400"
                                  onClick={() => {
                                    setChildCount(childCount + 1);
                                    setCheckAvaibility(false);
                                  }}
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
                                        min="1"
                                        max="12"
                                        className="w-16 px-2 py-1 border rounded-md text-sm"
                                        value={childAges[i] || "12"}
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
                                  setCheckAvaibility(false);
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
                                  setCheckAvaibility(false);
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
                              setCheckAvaibility(false);
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
                    <div className="h-10 w-70 flex flex-row justify-around items-center">
                      <Controller //validasi
                        name="pickup_area"
                        control={control}
                        rules={{ required: "pickup area is required!" }}
                        render={({ field, fieldState }) => (
                          <SelectCustomAsynNew
                            idx_comp={idx_comp ?? ""}
                            id_excursion={idx_excursion ?? ""}
                            placeholder="Find Pickup Area ..."
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val?.value);
                              setLabelSelectPickup(val?.label ?? "");
                              setPickupTimeFrom(val?.data.time_pickup_from);
                              setCheckAvaibility(false);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Kanan: button */}
                  <button
                    type="submit"
                    className="w-60 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl px-4 py-2 cursor-pointer"
                  >
                    Check Availability
                  </button>
                </div>
              </div>
            </form>

            {checkAvaibility && (
              <p className="text-md font-semibold mt-5">
                Choose from {dataProductSub?.msg.product_subs.length} available
                option
              </p>
            )}

            {/* Card Sub Excursion dan Surcharge*/}
            {checkAvaibility &&
              dataProductSub?.msg.product_subs.map((item, index) => (
                <ProductSubNew
                  key={index}
                  dataSub={item}
                  pickupArea={labelSelectPickup}
                  pickupArea_id={pickupAreaId}
                  pickup_time={pickupTimeFrom}
                  idx_comp={idx_comp ?? ""}
                  date_booking={date}
                  total_pax_adult={adultCount.toString()}
                  total_pax_child={childCount.toString()}
                  arr_ages_child={childAges}
                  total_pax_infant={infantCount.toString()}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
