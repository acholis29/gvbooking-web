"use client";
import { useEffect, useState } from "react";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBaby,
  faBell,
  faChild,
  faInbox,
  faQuestion,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/Breadcrumb";
import ReviewBookingCard from "@/components/ReviewBookingCard";

import { API_HOSTS } from "@/lib/apihost";
// Context Global
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDate } from "@/context/DateContext";
import { useReviewBooking } from "@/context/ReviewBookingContext";
import { acis_qty_age, formatToIDR } from "@/helper/helper";
import { log } from "node:console";

// Toast
import toast from "react-hot-toast";
// Form Libraries
import { useForm, Controller, useFieldArray } from "react-hook-form";

type ReviewBookingItem = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
  link?: string; // optional
};

export default function ReviewBookingClient() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Data submit:", data);
    toast.success("Success");
  };

  // Currency
  const { currency, setCurrency } = useCurrency();
  // Language
  const { language, setLanguage } = useLanguage();
  // Date Global
  const { date, setDate } = useDate();
  // Review Booking Global
  const { reviewBookingObj, setReviewBookingObj } = useReviewBooking();

  const idx_comp = reviewBookingObj?.idx_comp; //ini dari idx_comp_alias
  const idx_excursion = reviewBookingObj?.exc_id; //ini dari idx_excursion
  const idx_excursion_sub = reviewBookingObj?.sub_exc_id; //ini sub_excursion_id
  const pickup_id = reviewBookingObj?.pickup_id; //ini dari pickup id
  const room = reviewBookingObj?.room; //ini dari room
  const pickup_name = reviewBookingObj?.pickup_name; //ini dari pickup name
  const pickup_time_from = reviewBookingObj?.pickup_time_from;
  const sub_excursion_name = reviewBookingObj?.sub_exc_name; //ini dari exc name
  const adult = reviewBookingObj?.adult;
  const child = JSON.parse(reviewBookingObj?.child ?? "{}");
  const infant = reviewBookingObj?.infant;
  const country = reviewBookingObj?.country;
  const state = reviewBookingObj?.state;
  const acis = acis_qty_age(
    adult ?? "",
    reviewBookingObj?.child ?? "{}",
    infant ?? ""
  );

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

  type PriceOfSurcharge = {
    surcharge_id: string;
    surcharge_name: string;
    currency: string;
    price: string;
    price_in_format: string;
    mandatory: string;
  };

  type PriceOfChargeType = {
    excursion_id: string;
    sub_excursion_id: string;
    contract_id: string;
    market_id: string;
    supplier_id: string;
    tour_date: string;
    charge_type: string;
    pax: string;
    age: string;
    raw_sale_rates: string;
    raw_exchange_rates: string;
    sale_currency: string;
    sale_currency_id: string;
    sale_rates: string;
    sale_rates_total: string;
    sale_rates_total_in_format: string;
    buy_currency_id: string;
    buy_rates: string;
    buy_rates_total: string;
    markup_value: string;
    markup_type_PV: string;
    markup_type_HJ_HB: string;
    category_MA: string;
  };

  const [dataProduct, setDataProduct] = useState<ProductResponse | null>(null);
  const [dataSurcharge, setDataSurcharge] = useState<PriceOfSurcharge[]>([]);
  const [dataChargeType, setDataChargeType] = useState<PriceOfChargeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSurcharge, setIsLoadingSurcharge] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  // State Form
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [selectedSurcharge, setSelectedSurcharge] = useState<
    PriceOfSurcharge[]
  >([]);
  const [specialNote, setSpecialNote] = useState<string>("");
  const [timePickup, setTimePickup] = useState<string>("");

  // Detail Tour / Produk Detail
  useEffect(() => {
    if (!idx_comp || !idx_excursion) return;
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
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
      }
    };

    fetchData();
  }, [reviewBookingObj]);

  // Charge type & Guide Surcharge
  useEffect(() => {
    if (!idx_comp || !idx_excursion) return;
    const fetchDataGuideSurcharge = async () => {
      setIsLoading(true); // mulai loading
      setIsLoadingSurcharge(true); // mulai loading surcharge
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: idx_excursion ?? "", // Examp : "BA928E11-CE70-4427-ACD0-A7FC13C34891"
        id_excursion_sub: idx_excursion_sub ?? "", // Examp :"123A24BD-56EC-4188-BE9D-B7318EF0FB84"
        id_pickup_area: pickup_id ?? "", // Examp : "1EC87603-7ECC-48BC-A56C-F513B7B28CE3"
        tour_date: date, //2025-07-11
        total_pax_adult: adult ?? "0", // 1
        total_pax_child: child.count ?? "0", // 2
        total_pax_infant: infant ?? "0", // 2
        code_of_currency: currency, // IDR
        promo_code: "R-BC", // R-BC
        acis_qty_age: acis, // A|1|0,C|1|11,C|1|11
      });

      try {
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_product_price`,
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
          setDataSurcharge(json.msg.price_of_surcharge);
          setDataChargeType(json.msg.price_of_charge_type);
          hitungTotal(
            json.msg.price_of_charge_type,
            json.msg.price_of_surcharge
          );
        }
      } catch (err: any) {
        setError(err.message || "Error");
        console.error("Fetch error:", err);
      } finally {
        setIsLoadingSurcharge(false); // selesai loading
        setIsLoading(false); // selesai loading
      }
    };

    fetchDataGuideSurcharge();
  }, [reviewBookingObj]);

  useEffect(() => {
    setTimePickup(pickup_time_from ?? "");
  }, [reviewBookingObj]); // dependency array kosong -> hanya jalan sekali

  function hitungTotal(
    ChargeType: PriceOfChargeType[],
    Surcharge: PriceOfSurcharge[]
  ): number {
    let total = 0;
    if (ChargeType.length > 0) {
      for (let i = 0; i < ChargeType.length; i++) {
        total += parseInt(ChargeType[i].sale_rates_total);
      }
    }

    if (Surcharge.length > 0) {
      for (let j = 0; j < Surcharge.length; j++) {
        if (Surcharge[j].mandatory.toLocaleLowerCase() == "true") {
          total += parseInt(Surcharge[j].price);
          // masukin data cheked
          setSelectedSurcharge((prev) => [...prev, Surcharge[j]]);
        }
      }
    }

    setTotal(total);
    return total;
  }

  const handleCheckboxChange = (checked: boolean, price: number, data: any) => {
    if (checked) {
      setTotal((prev) => prev + price);

      // Tambah data ke selectedSurcharge jika belum ada
      setSelectedSurcharge((prev) => [...prev, data]);
    } else {
      setTotal((prev) => prev - price);

      // Hapus data dari selectedSurcharge (berdasarkan ID atau properti unik lainnya)
      setSelectedSurcharge((prev) =>
        prev.filter((item) => item.surcharge_id !== data.surcharge_id)
      );
    }
  };

  return (
    // Cart Page
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb
        pageName="Review "
        country={country}
        state={state}
        idx_comp={idx_comp}
        idx_excursion={idx_excursion}
      />
      <h1 className="text-gray-500 px-6 pt-6 text-2xl font-bold">
        REVIEW BOOKING
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="flex flex-col md:flex-row p-6 bg-white gap-1">
          {/* Konten Kiri */}
          <div className="md:w-full text-gray-700">
            <Controller
              name="roomNumber"
              control={control}
              defaultValue={"Lobby"}
              rules={{ required: "Room number is required" }}
              render={({ field }) => (
                <ReviewBookingCard
                  key={1}
                  idx_comp={"asas"}
                  idx_excursion={"asas"}
                  image={
                    dataProduct != null &&
                    dataProduct.msg.product_details.length > 0
                      ? dataProduct.msg.product_details[0].picture
                      : "/images/error/loading.gif"
                  }
                  title={
                    dataProduct?.msg.product_details[0].excursion_name ?? "-"
                  }
                  sub_title_1={sub_excursion_name ?? ""}
                  sub_title_2={`Pickup : ${pickup_name}`}
                  sub_title_3={`Room : ${room}`}
                  pickup_time_from={pickup_time_from ?? ""}
                  adult={adult ?? ""}
                  child={child.count ?? ""}
                  infant={infant ?? ""}
                  // onRoomChange={(val) => {
                  //   setRoomNumber(val);
                  //   // atau simpan ke state
                  // }}
                  roomValue={field.value}
                  onRoomChange={field.onChange}
                  onTimeChange={(val) => {
                    setTimePickup(val);
                  }}
                  errors={errors} // ✅ Tambah ini!
                />
              )}
            />

            {/* Table Charge Type */}

            {dataChargeType.length > 0 && (
              <div className="relative overflow-x-auto shadow-md sm:rounded-l md:max-w-3xl mb-3">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-6 py-3 md:w-lg">
                        # Traveller
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataChargeType.map((item, index) => {
                      return (
                        <tr
                          key={`chargeType-${index}`}
                          className="bg-white hover:bg-gray-100 text-xs md:text-sm"
                        >
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-wrap"
                          >
                            {item.charge_type == "A" ? (
                              <FontAwesomeIcon
                                icon={faUser}
                                className="w-10 h-10 text-gray-500"
                                size="sm"
                              />
                            ) : item.charge_type == "C" ? (
                              <FontAwesomeIcon
                                icon={faChild}
                                className="w-10 h-10 text-gray-500"
                                size="lg"
                              />
                            ) : item.charge_type == "I" ? (
                              <FontAwesomeIcon
                                icon={faBaby}
                                className="w-10 h-10 text-gray-500"
                                size="lg"
                              />
                            ) : item.charge_type == "S" ? (
                              <FontAwesomeIcon
                                icon={faBell}
                                className="w-10 h-10 text-gray-500"
                                size="sm"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faQuestion}
                                className="w-10 h-10 text-gray-500"
                                size="sm"
                              />
                            )}
                            {item.pax}{" "}
                            {item.charge_type == "A"
                              ? "Adult"
                              : item.charge_type == "C"
                              ? "Child"
                              : item.charge_type == "I"
                              ? "Infant"
                              : item.charge_type == "S"
                              ? "Service"
                              : "Undifined"}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-wrap"
                          >
                            {item.sale_currency}{" "}
                            {item.sale_rates_total_in_format}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table Surgery */}
            {dataSurcharge.length > 0 && (
              <div className="relative overflow-x-auto shadow-md sm:rounded-l md:max-w-3xl">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-6 py-3 md:w-lg">
                        # Surcharge
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSurcharge.map((items, index) => {
                      return (
                        <tr key={index} className="bg-white hover:bg-gray-100">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-wrap"
                          >
                            <input
                              id={`surcharge-${index}`}
                              type="checkbox"
                              defaultChecked={
                                items.mandatory.toLocaleLowerCase() == "true"
                                  ? true
                                  : false
                              } // atau false
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e.target.checked,
                                  Number(items.price),
                                  items
                                )
                              }
                              className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                              disabled={
                                items.mandatory.toLowerCase() === "true"
                                  ? true
                                  : false
                              }
                            />
                            <label
                              htmlFor={`surcharge-${index}`}
                              className="w-full py-4 ms-2 text-xs md:text-sm font-medium text-gray-900"
                            >
                              {items.surcharge_name}
                            </label>
                          </th>
                          <td className="px-6 py-4 text-xs md:text-sm text-nowrap">
                            {items.currency} {items.price_in_format}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Text Area Note */}
            <div className="md:max-w-3xl my-3">
              <label
                htmlFor="message"
                className="block mb-2 text-sm text-gray-500 font-semibold"
              >
                Special Note
              </label>
              <textarea
                id="message"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-gray-500 focus:border-gray-500 shadow-md"
                placeholder="Write your note here..."
                onChange={(e) => {
                  setSpecialNote(e.target.value);
                }}
              ></textarea>
            </div>

            <div className="md:max-w-3xl flex h-20 w-full bg-gray-200 mt-15 rounded-sm shadow-md">
              <div className="basis-[60%] flex flex-col items-start justify-center pl-3">
                {/* Kolom 1 (60%) */}
                <p className="font-semibold text-gray-700">Total</p>
                <p className="font-bold text-gray-800">
                  {currency} {formatToIDR(total)}
                </p>
              </div>
              <div className="basis-[40%] flex items-center justify-center">
                {/* Kolom 2 (40%) */}
                {!isLoadingSurcharge && (
                  <button
                    type="submit"
                    className="text-gray-700 font-bold  shadow-2xl bg-amber-400 w-full hover:bg-amber-500 focus:ring-4 focus:ring-amber-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
                  >
                    Add Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
