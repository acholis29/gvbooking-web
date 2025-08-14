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
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import SkeletonDetailProduk from "@/components/SkeletonDetailProduk";
import { useSearchParams } from "next/navigation";
import { log } from "console";
import { toLowerCaseAll } from "@/helper/helper";
// Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "@/components/Breadcrumb";

export default function DetailDestination() {
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //ini dari idx_comp_alias
  const idx_excursion = searchParams.get("exc"); //ini dari idx_excursion
  const country = searchParams.get("country");
  const state = searchParams.get("state");
  const transaction_id = searchParams.get("transaction_id");

  const [isDropdownPersonOpen, setDropdownPersonOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("");

  const [isDropdownProductSubOpen, setDropdownProductSubOpen] = useState(false);
  const [selectedProductSub, setSelectedProductSubOpen] = useState("");

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
  const [isLoading, setIsLoading] = useState(true);
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
          `${API_HOSTS.host1}/excursion.asmx/v2_product_description`,
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
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
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
          fetchSecondDataInitial(json.msg);
          setRepCode(json.msg.default_rep_code); //R-BC
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

  const maximum_pax =
    dataProduct != null && dataProduct.msg.product_subs.length > 0
      ? parseInt(dataProduct.msg.product_subs[0].maximum_pax)
      : 1;

  return (
    <>
      {!isLoading ? (
        <>
          <div className="max-w-screen-xl mx-auto px-4">
            <Breadcrumb
              pageName="Activity"
              country={country || ""}
              state={state || ""}
              idx_comp={idx_comp || ""}
            />
            {/* Baris Title */}
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
                  {dataProduct != null
                    ? dataProduct.msg.product_details[0].info_pickup_service
                    : ""}
                  {" Local Time"}
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

            {/* Baris Content */}
            <div className="flex flex-col md:flex-row pb-5 gap-5">
              <div className="order-2 md:order-1 w-full md:flex-[5] text-gray-600">
                <div className="w-full md:w-1/7 mt-3 mb-5">
                  {/* <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="bg-gray-50 p-2 rounded-2xl w-full shadow-sm focus:outline-none focus:ring-0 border-0"
                  /> */}
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
                </div>
                {dataProduct && dataProduct.msg.product_subs.length > 0 && (
                  <>
                    {dataProduct.msg.product_subs.map((item, index) => {
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
                  </>
                )}

                <p className="font-bold text-lg mt-20">
                  {/* The Legendary Charm of Tanah Lot Temple: Bali's Eternal Wonder */}
                  {dataProduct != null
                    ? dataProduct.msg.product_details[0].excursion_name
                    : ""}{" "}
                  {dataProduct != null
                    ? dataProduct.msg.product_details[0].info_location
                    : ""}
                  {" | "}
                  {dataProduct != null
                    ? dataProduct.msg.product_details[0].info_category
                    : ""}
                </p>
                {/* Deskripsi  */}
                <div
                  className="prose max-w-none text-sm text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html:
                      dataProduct != null
                        ? dataProduct.msg.product_details[0].info_general
                        : "",
                  }}
                />

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
                    Don't miss the stunning sunset moment. Find the best spot in
                    the cliff area or the surrounding coffee shops to enjoy this
                    unforgettable view.
                  </p>
                  <br />
                  <p>
                    <span className="font-bold">
                      Visiting Batu Bolong Temple:
                    </span>
                    Just a few steps from Tanah Lot, you will find Pura Batu
                    Bolong, a small temple with a hole at the bottom, which also
                    offers beautiful sea views.
                  </p>
                  <br />
                  <p>
                    <span className="font-bold">
                      Interacting with the Sacred Snake:
                    </span>
                    In the lower coral area, there is a small cave inhabited by
                    sacred sea snakes. You can touch them (with a guide) and it
                    is believed to bring good luck.
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <SkeletonDetailProduk />
        </>
      )}
    </>
  );
}
