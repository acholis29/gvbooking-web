"use client";
import { useEffect, useState } from "react";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/Breadcrumb";
import ReviewBookingCard from "@/components/ReviewBookingCard";
import { useSearchParams } from "next/navigation";
import { API_HOSTS } from "@/lib/apihost";
// Context Global
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDate } from "@/context/DateContext";

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

export default function ReviewBooking() {
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //ini dari idx_comp_alias
  const idx_excursion = searchParams.get("exc"); //ini dari idx_excursion
  const idx_excursion_sub = searchParams.get("sub_exc"); //ini sub_excursion_id
  const pickup_id = searchParams.get("pickup_id"); //ini dari pickup id
  const note = searchParams.get("note"); //ini dari note
  const pickup_name = searchParams.get("pickup_name"); //ini dari pickup name
  const sub_excursion_name = searchParams.get("sub_exc_name"); //ini dari exc name
  const adult = searchParams.get("a");
  const child = JSON.parse(searchParams.get("c") ?? "{}");
  const infant = searchParams.get("i");

  // Currency
  const { currency, setCurrency } = useCurrency();
  // Language
  const { language, setLanguage } = useLanguage();
  // Date Global
  const { date, setDate } = useDate();

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

  const [dataProduct, setDataProduct] = useState<ProductResponse | null>(null);
  const [dataSurcharge, setDataSurcharge] = useState<PriceOfSurcharge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State Data Detail Destination
  const [ListReviewBooking, setReviewBooking] = useState<ReviewBookingItem[]>(
    []
  );

  useEffect(() => {
    loadReviewBooking();
  }, []); // tetap kosong, agar hanya dijalankan sekali saat mount

  function loadReviewBooking() {
    const review_booking = JSON.parse(
      localStorage.getItem("review_booking") || "[]"
    );
    setReviewBooking(review_booking);
    setIsLoading(false);
  }

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
          console.log(json);
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
  }, []);

  // Guide Surcharge
  useEffect(() => {
    const fetchDataGuideSurcharge = async () => {
      setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: "4D340942-88D3-44DD-A52C-EAF00EACADE8", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: "BA928E11-CE70-4427-ACD0-A7FC13C34891", // Examp : "BA928E11-CE70-4427-ACD0-A7FC13C34891"
        id_excursion_sub: "123A24BD-56EC-4188-BE9D-B7318EF0FB84", // Examp :"123A24BD-56EC-4188-BE9D-B7318EF0FB84"
        id_pickup_area: "1EC87603-7ECC-48BC-A56C-F513B7B28CE3", // Examp : "1EC87603-7ECC-48BC-A56C-F513B7B28CE3"
        tour_date: "2025-07-11", //2025-07-11
        total_pax_adult: "1", // 1
        total_pax_child: "2", // 2
        total_pax_infant: "2", // 2
        code_of_currency: "IDR", // IDR
        promo_code: "R-BC", // R-BC
        acis_qty_age: "A|1|0,C|1|11,C|1|11", // A|1|0,C|1|11,C|1|11
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
          console.log(json.msg.price_of_surcharge);
          setDataSurcharge(json.msg.price_of_surcharge);
        }
      } catch (err: any) {
        setError(err.message || "Error");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
      }
    };

    fetchDataGuideSurcharge();
  }, []);

  return (
    // Cart Page
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="Review Booking" />
      <h1 className="text-gray-500 px-6 pt-6 text-2xl font-bold">
        REVIEW BOOKING
      </h1>
      <section className="flex flex-col md:flex-row p-6 bg-white gap-1">
        {/* Konten Kiri */}
        <div className="md:w-full text-gray-700">
          <ReviewBookingCard
            key={1}
            idx_comp={"asas"}
            idx_excursion={"asas"}
            image="/images/destination/tanah-lot/tanah-lot6.jpg"
            title={dataProduct?.msg.product_details[0].excursion_name ?? "-"}
            sub_title_1={sub_excursion_name ?? ""}
            sub_title_2={`Pickup : ${pickup_name}`}
            sub_title_3={`Room : ${note}`}
            adult={adult ?? ""}
            child={child.count ?? ""}
            infant={infant ?? ""}
          />

          {/* Table Surgery */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-l md:max-w-3xl">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
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
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        <input
                          id={`surcharge-${index}`}
                          aria-describedby="helper-radio-text"
                          type="radio"
                          value=""
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <label
                          htmlFor={`surcharge-${index}`}
                          className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                        >
                          {items.surcharge_name}
                        </label>
                      </th>
                      <td className="px-6 py-4">
                        {items.currency} {items.price_in_format}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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
            ></textarea>
          </div>

          <div className="md:max-w-3xl flex h-20 w-full bg-gray-200 mt-15 rounded-sm shadow-md">
            <div className="basis-[60%] flex flex-col items-start justify-center pl-3">
              {/* Kolom 1 (60%) */}
              <p className="font-semibold text-gray-700">Total</p>
              <p className="font-bold text-gray-800">IDR 1.200.000</p>
            </div>
            <div className="basis-[20%] flex items-center justify-center">
              {/* Kolom 2 (20%) */}
              <button
                type="button"
                className="text-gray-700 font-bold  shadow-2xl bg-amber-300 w-full hover:bg-amber-400 focus:ring-4 focus:ring-amber-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
              >
                Add Cart
              </button>
            </div>
            <div className="basis-[20%]  flex items-center justify-center">
              {/* Kolom 3 (20%) */}
              <button
                type="button"
                className="text-white font-bold shadow-2xl bg-red-700 w-full hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
              >
                Payment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
