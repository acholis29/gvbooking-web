// components/DestinationCard.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
// Host Imgae
import { API_HOSTS } from "@/lib/apihost";
// Select
import SelectCustomAsyn from "./SelectCustomAsyn";

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

type ProductSubProps = {
  item?: ProductSub;
  country?: String;
  idx_comp?: string;
};

type ChargeTypeProps = {
  name: string;
  code: string;
  min_pax: string;
  max_pax: string;
  age_from: string;
  age_to: string;
};

const ProductSub: React.FC<ProductSubProps> = ({ item, country, idx_comp }) => {
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

  const [isLoading, setIsLoading] = useState(true);
  const [dataChargeType, setDataChargeType] = useState<ChargeTypeProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  console.log("ini idx comp");
  console.log(idx_comp);

  // Product Allotment
  useEffect(() => {
    const fetchDataAllotment = async () => {
      setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: idx_comp || "", // ← ambil dari props // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: item?.excursion_id || "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        id_excursion_sub: item?.sub_excursion_id || "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        tour_date: "2025-07-07",
        code_of_currency: "IDR",
        promo_code: "R-BC",
      });

      try {
        const res = await fetch(
          "https://api.govacation.biz/excursion.asmx/v2_product_allotment_list_batch",
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
          const chargeTypes = json?.msg?.[0]?.charge_type ?? null;
          setDataChargeType(chargeTypes);
          console.log("chargeTypes");
          console.log(chargeTypes);
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
      }
    };

    fetchDataAllotment();
  }, []);

  return (
    <a className="flex flex-col items-center mb-3 bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row  hover:bg-gray-100 ">
      <div className="w-40 h-40 relative overflow-hidden rounded-2xl p-2 mr-2">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={`${host_img}/${item?.picture}`}
          title={item?.picture}
          alt={item?.picture}
        />
      </div>

      <div className="w-full flex flex-row">
        <div className="w-1/2">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 mt-2">
            {item?.sub_excursion_name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Description
          </p>
          <SelectCustomAsyn placeholder="Find Pickup Area ..." />
        </div>
        <div className="w-1/2 flex flex-row">
          <div className="flex flex-col justify-center">
            <div className="">
              {/* Looping Adult/Child/Infant */}
              {dataChargeType?.map((item) => (
                <button
                  key={item.code}
                  id="dropdownPickupAreaButton"
                  data-dropdown-toggle="dropdown"
                  className="w-40 h-auto mb-2 rounded-2xl text-gray-600 shadow-sm focus:outline-none focus:ring-0 border-0 bg-gray-100 hover:bg-gray-300 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
                  type="button"
                >
                  {item.name}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="w-4 h-4 text-gray-600"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full p-5">
            <button
              type="button"
              className="mt-3 w-full text-white bg-red-500 hover:bg-red-900 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              BOOKING
            </button>
            <p className="font-normal text-gray-700 ">From</p>
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              {item?.currency} {item?.price} / person
            </h3>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProductSub;
