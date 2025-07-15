"use client";
// State
import { useState, useEffect, useRef } from "react";

import Galery from "@/components/Galery";
import ProductSub from "@/components/ProductSubCard";
import { GLOBAL_VAR } from "@/lib/globalVar"; 
import { API_HOSTS } from "@/lib/apihost";


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

export default function DetailDestination() {
  
  const searchParams = useSearchParams();  
  const idx_comp = searchParams.get("id"); //ini dari idx_comp_alias
  const idx_excursion = searchParams.get("exc"); //ini dari idx_excursion
  const country = searchParams.get("country");
  const state = searchParams.get("state");

  const [isDropdownPersonOpen, setDropdownPersonOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("");

  const [isDropdownProductSubOpen, setDropdownProductSubOpen] = useState(false);
  const [selectedProductSub, setSelectedProductSubOpen] = useState("");

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

  // Datepicker
  const disabledDates = [new Date("2025-07-16"), new Date("2025-07-25")];
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Detail Tour / Produk Detail
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: idx_excursion ?? "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        code_of_language: "DE",
        code_of_currency: "IDR",
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
          console.log("DataProduct");
          console.log(json);
        }
      } catch (err: any) {
        setError(err.message || "Error");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
      }
    };

    fetchData();
  }, []);

  const maximum_pax =
    dataProduct != null && dataProduct.msg.product_subs.length > 0
      ? parseInt(dataProduct.msg.product_subs[0].maximum_pax)
      : 1;

  return (
    <>
      {isLoading && <SkeletonDetailProduk />}
      {!isLoading && (
        <>
          <div className="max-w-screen-xl mx-auto px-4">
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
                <h3 className="text-small md:text-lg font-semibold md:font-bold text-left">
                  {/*DESC : Beraban, Kediri, Kabupaten Tabanan, Bali */}
                  {dataProduct != null
                    ? dataProduct.msg.product_details[0].info_location
                    : ""}
                </h3>
              </div>
              <div className="text-gray-700 w-1/2">
                <h3 className="text-small md:text-lg font-semibold md:font-bold text-right text-red-500">
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
                <div className="w-1/7 mt-3 mb-5">
                  {/* <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="bg-gray-50 p-2 rounded-2xl w-full shadow-sm focus:outline-none focus:ring-0 border-0"
                  /> */}
                  <div className="flex flex-row justify-center items-center">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={new Date()}
                      excludeDates={disabledDates}
                      className="bg-gray-50 p-2 rounded-2xl w-full shadow-sm focus:outline-none focus:ring-0 border-0"
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
                    {dataProduct.msg.product_subs.map((item, index) => (
                      <ProductSub
                        key={index}
                        item={item}
                        idx_comp={idx_comp ?? ""}
                        country={toLowerCaseAll(country ?? "")}
                      />
                    ))}
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
      )}
    </>
  );
}
