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
  faCalendarAlt,
  faCalendarCheck,
  faCalendarDays,
  faCalendarWeek,
  faChevronDown,
  faClockRotateLeft,
  faListCheck,
  faTicketSimple,
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
    setRepresentative,
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
        setRepresentative(json.msg.representative);
        localStorage.setItem("language", param.default_language); // simpan ke localStorage
        localStorage.setItem(
          "resource_initial",
          JSON.stringify(json.msg.resource)
        );
        localStorage.setItem(
          "profile_initial",
          JSON.stringify(json.msg.profile)
        );
        localStorage.setItem(
          "representative",
          JSON.stringify(json.msg.representative)
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
                <h3 className="text-sm md:text-lg font-semibold md:font-bold text-right text-red-500">
                  {/* 07:00 - 19:00 WITA */}
                  {/* {dataProduct != null
                    ? dataProduct.msg.product_details[0].info_pickup_service
                    : ""}
                  {" Local Time"} */}
                </h3>
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
              {/* Explore Grand Canyon West on the Hualapai Reservation on this day
              trip from Las Vegas. Walk along the rim of the canyon, admire the
              views, and make a stop for views of Hoover Dam. */}
            </p>
            {/* About Activity */}
            <p className="font-bold text-lg mt-3">About this activity</p>
            <div className="w-full flex flex-col mt-5">
              <div className="flex flex-row w-full mb-5">
                <div className="mr-2">
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="w-10 h-10 text-gray-500"
                    size="lg"
                  />
                </div>
                <div className="">
                  <p className="font-bold text-md">Free cancellation</p>
                  {/* <p className="text-sm">
                    {defaultCancelText ?? ""} */}
                  {/* Cancel up to 24 hours in advance for a full refund */}
                  {/* </p> */}
                  <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: defaultCancelText ?? "",
                    }}
                  ></p>
                </div>
              </div>
              {/* <div className="flex flex-row w-full mb-5">
                <div className="mr-2">
                  <FontAwesomeIcon
                    icon={faCalendarWeek}
                    className="w-10 h-10 text-gray-500"
                    size="lg"
                  />
                </div>
                <div className="">
                  <p className="font-bold text-md">Reserve now & pay later</p>

                  <p className="text-sm">
                    Keep your travel plans flexible — book your spot and pay
                    nothing today.
                  </p>
                </div>
              </div> */}
              <div className="flex flex-row w-full mb-5">
                <div className="mr-2">
                  <FontAwesomeIcon
                    icon={faClockRotateLeft}
                    className="w-10 h-10 text-gray-500"
                    size="lg"
                  />
                </div>
                <div className="">
                  <p className="font-bold text-md">
                    Duration{" "}
                    {dataProduct != null
                      ? dataProduct.msg.product_details[0].info_duration
                      : ""}{" "}
                  </p>
                  <p className="text-sm">
                    Check availability to see starting times
                  </p>
                </div>
              </div>
              {/* <div className="flex flex-row w-full mb-5">
                <div className="mr-2">
                  <FontAwesomeIcon
                    icon={faTicketSimple}
                    className="w-10 h-10 text-gray-500"
                    size="lg"
                  />
                </div>
                <div className="">
                  <p className="font-bold text-md">Skip the ticket line</p>
                  <p className="text-sm">-</p>
                </div>
              </div> */}
              <div className="flex flex-row w-full mb-5">
                <div className="mr-2">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="w-10 h-10 text-gray-500"
                    size="lg"
                  />
                </div>
                <div className="">
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
                <div className="">
                  <p className="font-bold text-md">Facilities</p>
                  <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        dataProduct != null &&
                        dataProduct.msg.product_details[0].info_facilities !=
                          null &&
                        dataProduct.msg.product_details[0].info_facilities != ""
                          ? dataProduct.msg.product_details[0].info_facilities
                          : "-",
                    }}
                  ></p>
                </div>
              </div>
            </div>

            {/* Date Global */}
            {/* <div className="w-full md:w-1/7 mt-3 mb-5">
                  <p className="mr-2 font-semibold text-gray-500">
                    Choose a date for your tour
                  </p>
                  <div className="flex flex-row w-full justify-start items-center">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          // Format ke yyyy-mm-dd dan simpan di context
                          const formatted = date.toISOString().split("T")[0];
                          setDate(formatted);
                          localStorage.setItem("booking_date", formatted);
                        }
                      }}
                      minDate={(() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return tomorrow;
                      })()}
                      excludeDates={disabledDates}
                      className="bg-gray-100 font-semibold p-2 rounded-2xl w-full shadow-sm focus:outline-none focus:ring-0 border-0"
                      wrapperClassName="w-full md:w-auto"
                    />
                    <FontAwesomeIcon
                      icon={faCalendarCheck}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                </div> */}

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

            {!isLoadingProdukDetailSub ? (
              <>
                {dataProductSub &&
                  dataProductSub.msg.product_subs.length > 0 && (
                    <div className="mt-3">
                      {dataProductSub.msg.product_subs.map((item, index) => {
                        return (
                          <ProductSub
                            key={index}
                            item={item}
                            idx_comp={idx_comp ?? ""}
                            transaction_id={transaction_id ?? ""} //ada isinya jika user change cart
                            country={toLowerCaseAll(country ?? "")}
                            state={toLowerCaseAll(state ?? "")}
                          />
                        );
                      })}
                    </div>
                  )}
              </>
            ) : (
              <>
                <SkeletonDetailProdukSub />
              </>
            )}

            {/* About Activity */}
            {/* <p className="font-bold text-lg mt-3">About this activity</p>
            <div className="border p-3 rounded-2xl w-full md:w-1/2">
              <p className="font-bold text-lg">Order now and pay later</p>
              <p>
                Keep your travel plans flexible - book your place and pay
                nothing today.
              </p>
              <p className="font-bold text-lg">Free cancellation</p>
              <p>
                Cancel up to 24 hours before the activity starts for a full
                refund.
              </p>
              <p className="font-bold text-lg">Duration 3 - 4 hours</p>
              <p>Check availability to see start times.</p>
              <p className="font-bold text-lg">Live tour guide</p>
              <p>English</p>
            </div>

            <p className="font-bold text-lg mt-3">Destination</p>
            <div className="w-full md:w-1/2">
              <p>
                <span className="font-bold">
                  Witnessing the Beauty of Sunset:
                </span>
                Don't miss the stunning sunset moment. Find the best spot in the
                cliff area or the surrounding coffee shops to enjoy this
                unforgettable view.
              </p>
              <br />
              <p>
                <span className="font-bold">Visiting Batu Bolong Temple:</span>
                Just a few steps from Tanah Lot, you will find Pura Batu Bolong,
                a small temple with a hole at the bottom, which also offers
                beautiful sea views.
              </p>
              <br />
              <p>
                <span className="font-bold">
                  Interacting with the Sacred Snake:
                </span>
                In the lower coral area, there is a small cave inhabited by
                sacred sea snakes. You can touch them (with a guide) and it is
                believed to bring good luck.
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Sticky */}
      {/* {isMobile && (
            <div className="md:w-[50%] h-auto fixed bottom-0 left-0 w-full z-50">
              <div className=" max-w-xl p-5 bg-gray-100 border border-gray-200 rounded-lg shadow-sm ">
                <p className="text-lg text-gray-900">From</p>
                {dataProduct && dataProduct.msg.product_subs.length > 0 && (
                  <>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      {dataProduct.msg.product_subs[0].currency}{" "}
                      {dataProduct.msg.product_subs[0].price}{" "}
                      <small className="font-light">per person</small>
                    </h5>
                    <button
                      type="submit"
                      className="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    >
                      {isLoading && <Spinner />} Check Availability
                    </button>
                  </>
                )}
              </div>
            </div>
          )} */}
    </>
  );
}
