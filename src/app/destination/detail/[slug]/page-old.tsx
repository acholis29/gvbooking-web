"use client";
// State
import { useState, useEffect, useRef } from "react";

import Galery from "@/components/Galery";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SkeletonDetailProduk from "@/components/SkeletonDetailProduk";
import { useSearchParams } from "next/navigation";

export default function DetailDestinationOld() {
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //ini dari idx_comp
  const idx_excursion = searchParams.get("exc"); //ini dari idx_excursion
  const country = searchParams.get("country");
  const state = searchParams.get("state");

  const [isDropdownPersonOpen, setDropdownPersonOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("");

  const [isDropdownProductSubOpen, setDropdownProductSubOpen] = useState(false);
  const [selectedProductSub, setSelectedProductSubOpen] = useState("");

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownProductSubRef = useRef<HTMLDivElement>(null);

  // ❗ Detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownPersonOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ❗ Detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownProductSubRef.current &&
        !dropdownProductSubRef.current.contains(event.target as Node)
      ) {
        setDropdownProductSubOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // PROXY
  // useEffect(() => {
  //   const fetchProductDetail = async () => {
  //     try {
  //       const res = await fetch("/api/proxy/produk", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           shared_key: "4D340942-88D3-44DD-A52C-EAF00EACADE8",
  //           xml: "false",
  //           id_excursion: "03208A45-4A41-4E1B-A597-20525C090E52",
  //           code_of_language: "DE",
  //           code_of_currency: "IDR",
  //           promo_code: "R-BC",
  //         }),
  //       });

  //       if (!res.ok) throw new Error("Fetch gagal: " + res.status);

  //       const result = await res.json();
  //       setData(result);
  //       setError(null);
  //     } catch (err: any) {
  //       console.error("Error:", err);
  //       setError(err.message || "Terjadi kesalahan");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProductDetail();
  // }, []);

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
          "https://api.govacation.biz/excursion.asmx/v2_product_description",
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
          setData(json);
        } else {
          const text = await res.text();
          setData(text); // bisa XML atau error message
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
      }
    };

    fetchData();
  }, []);

  const maximum_pax =
    data != null && data.msg.product_subs.length > 0
      ? parseInt(data.msg.product_subs[0].maximum_pax)
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
                  {data != null
                    ? data.msg.product_details[0].excursion_name
                    : ""}
                </h3>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center mt-4">
              <div className="text-gray-700 w-1/2">
                <h3 className="text-small md:text-lg font-semibold md:font-bold text-left">
                  {/*DESC : Beraban, Kediri, Kabupaten Tabanan, Bali */}
                  {data != null
                    ? data.msg.product_details[0].info_location
                    : ""}
                </h3>
              </div>
              <div className="text-gray-700 w-1/2">
                <h3 className="text-small md:text-lg font-semibold md:font-bold text-right text-red-500">
                  {/* 07:00 - 19:00 WITA */}
                  {data != null
                    ? data.msg.product_details[0].info_pickup_service
                    : ""}
                  {" WITA "}
                </h3>
              </div>
            </div>
            {/* Baris Galery */}

            <Galery
              picture={
                data != null && data.msg.product_details.length > 0
                  ? data.msg.product_details[0].picture
                  : ""
              }
              galery={data != null ? data.msg.product_details[0].gallery : ""}
            />

            {/* Baris Content */}
            <div className="flex flex-col md:flex-row pb-5 gap-5">
              {/* Kontent Kiri */}
              <div className="order-2 md:order-1 w-full md:flex-[5] text-gray-600">
                <p className="font-bold text-lg">
                  {/* The Legendary Charm of Tanah Lot Temple: Bali's Eternal Wonder */}
                  {data != null
                    ? data.msg.product_details[0].excursion_name
                    : ""}{" "}
                  {data != null
                    ? data.msg.product_details[0].info_location
                    : ""}
                  {" | "}
                  {data != null
                    ? data.msg.product_details[0].info_category
                    : ""}
                </p>
                {/* Deskripsi  */}
                <div
                  className="prose max-w-none text-sm text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html:
                      data != null
                        ? data.msg.product_details[0].info_general
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
              {/* Kontent Kanan */}
              <div className="order-1 md:order-2 w-full md:flex-[1] text-gray-600">
                <div className="border p-3 rounded-2xl">
                  <p className="font-bold text-lg">FROM</p>
                  <p>
                    {/* <span className="font-bold text-2xl">IDR 1.234.567 /</span>{" "}
              <small>PERSON</small> */}
                    <span className="font-bold text-2xl">
                      {data != null && data.msg.product_subs.length > 0
                        ? data.msg.product_subs[0].currency
                        : "IDR"}{" "}
                      {data != null && data.msg.product_subs.length > 0
                        ? data.msg.product_subs[0].price
                        : "0"}{" "}
                      /
                    </span>{" "}
                    <small>
                      {data != null && data.msg.product_subs.length > 0
                        ? data.msg.product_subs[0].minimum_pax
                        : "0"}{" "}
                      PERSON
                    </small>
                  </p>
                </div>
                <div className="border p-3 rounded-2xl mt-3 bg-gray-600">
                  <p className="font-bold text-lg text-center text-white">
                    Select date and participants
                  </p>
                  <div className="flex justify-between gap-2">
                    {/* date */}
                    <div className="w-1/2">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-white p-2 rounded-2xl w-full"
                      />
                    </div>
                    {/* Dropdown */}
                    <div className="w-1/2" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setDropdownPersonOpen(!isDropdownPersonOpen)
                        }
                        id="dropdownDefaultButton"
                        data-dropdown-toggle="dropdown"
                        className="w-40 rounded-2xl text-gray-600 bg-white hover:bg-gray-300 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
                        type="button"
                      >
                        {selectedPerson == "1"
                          ? selectedPerson + " Person"
                          : selectedPerson + " Persons"}
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="w-4 h-4 text-gray-600"
                        />
                      </button>

                      {isDropdownPersonOpen && (
                        <div className="absolute z-20 bg-gray-200 divide-y divide-gray-100 rounded-lg shadow-sm h-70 w-40 mt-2 overflow-auto scrollbar-none scrollbar-hidden">
                          <ul className="py-2 text-sm text-gray-700">
                            {Array.from(
                              { length: maximum_pax },
                              (_, i) => i + 1
                            ).map((num) => (
                              <li key={num}>
                                <button
                                  onClick={() => {
                                    setSelectedPerson(num.toString());
                                    setDropdownPersonOpen(false);
                                  }}
                                  type="button"
                                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                                >
                                  {num} Person{num > 1 && "s"}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full pt-2" ref={dropdownProductSubRef}>
                    <button
                      onClick={() =>
                        setDropdownProductSubOpen(!isDropdownProductSubOpen)
                      }
                      id="dropdownProductSubButton"
                      data-dropdown-toggle="dropdown"
                      className="w-full rounded-2xl text-gray-600 bg-white hover:bg-gray-300 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
                      type="button"
                    >
                      {selectedProductSub == "1"
                        ? selectedProductSub + " Product Sub"
                        : selectedProductSub + " Product Subs"}
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="w-4 h-4 text-gray-600"
                      />
                    </button>

                    {isDropdownProductSubOpen && (
                      <div className="absolute z-20 bg-gray-200 divide-y divide-gray-100 rounded-lg shadow-sm h-70 w-40 mt-2 overflow-auto scrollbar-none scrollbar-hidden">
                        <ul className="py-2 text-sm text-gray-700">
                          {Array.from({ length: 2 }, (_, i) => i + 1).map(
                            (num) => (
                              <li key={num}>
                                <button
                                  onClick={() => {
                                    setSelectedProductSubOpen(num.toString());
                                    setDropdownProductSubOpen(false);
                                  }}
                                  type="button"
                                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                                >
                                  {num} Product Sub{num > 1 && "s"}
                                </button>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="mt-3 w-full text-white bg-red-500 hover:bg-red-900 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    CHECK AVAILABALITY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
