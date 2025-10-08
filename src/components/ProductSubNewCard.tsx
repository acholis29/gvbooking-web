import React, { useEffect, useState } from "react";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_HOSTS } from "@/lib/apihost";
import { useSeason } from "@/context/SeasonContext";
import Spinner from "./Spinner";

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

type ProductSubNewProps = {
  dataSub: ProductSub;
  pickupArea: string;
  pickupArea_id: string;
  pickup_time: string;
  idx_comp: string;
  date_booking: string;
  total_pax_adult: string;
  total_pax_child: string;
  total_pax_infant: string;
};

const ProductSubNew: React.FC<ProductSubNewProps> = ({
  dataSub,
  pickupArea,
  pickupArea_id,
  idx_comp,
  date_booking,
  total_pax_adult,
  total_pax_child,
  total_pax_infant,
}) => {
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

  const [dataSurcharge, setDataSurcharge] = useState<PriceOfSurcharge[]>([]);
  const [dataChargeType, setDataChargeType] = useState<PriceOfChargeType[]>([]);
  // Session Id
  const { voucherNumber, setVoucherNumber, masterFileId, setMasterFileId } =
    useSeason();
  const [marketId, setMarketId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [contractId, setContractId] = useState<string>("");

  // Loading
  const [isLoadingSurCharge, setIsLoadingSurcharge] = useState(true);

  useEffect(() => {
    const fetchDataGuideSurcharge = async () => {
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: dataSub.excursion_id ?? "", // Examp : "BA928E11-CE70-4427-ACD0-A7FC13C34891"
        id_excursion_sub: dataSub.sub_excursion_id ?? "", // Examp :"123A24BD-56EC-4188-BE9D-B7318EF0FB84"
        id_pickup_area: pickupArea_id ?? "", // Examp : "1EC87603-7ECC-48BC-A56C-F513B7B28CE3"
        tour_date: date_booking ?? "", //2025-07-11 ini sub exc
        total_pax_adult: total_pax_adult ?? "0", // 1
        total_pax_child: total_pax_child ?? "0", // 2
        total_pax_infant: total_pax_infant ?? "0", // 2
        code_of_currency: "IDR", // IDR
        promo_code: "R-BC", // R-BC
        acis_qty_age: "A|1|0", // A|1|0,C|1|11,C|1|11
      });

      console.log(formBody.toString());

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
          setVoucherNumber(json.msg.season_id.voucher_number);
          setMasterFileId(json.msg.season_id.master_file_id);
          const data_msc = json?.msg?.price_of_charge_type?.find(
            (item: any) => item.charge_type === "A"
          );
          setMarketId(data_msc.market_id);
          setContractId(data_msc.contract_id);
          setSupplierId(data_msc.supplier_id);
          //   hitungTotal(
          //     json.msg.price_of_charge_type,
          //     json.msg.price_of_surcharge
          //   );
          //   concatInputItem(json.msg.price_of_charge_type);
          //   concatInputSurcharge(json.msg.price_of_surcharge);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setIsLoadingSurcharge(false);
      } finally {
        setIsLoadingSurcharge(false);
      }
    };

    fetchDataGuideSurcharge();
  }, []);

  return (
    <div className="w-full rounded-2xl mt-5 hover:border-2 border-gray-400 shadow-md bg-gray-100">
      {/* Desc */}
      <div className="flex flex-row p-5 justify-between gap-10">
        <div className="flex flex-col">
          <h1 className="text-md font-bold">
            {dataSub.sub_excursion_name ?? "Sub Excursion Name"}
          </h1>
          {/* "Pickup : Pickup Area Name | Meet at the lobby" */}
          <p className="text-sm">{`Pickup : ${pickupArea} | Meet at the lobby`}</p>

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
            <div className="absolute inset-y-0 left-30 flex items-center pointer-events-none">
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
              className="text-gray-600 text-sm border border-gray-300 pl-8 w-40 h-8 
                        bg-gray-100 rounded-md focus:outline-none focus:ring-0 
                        focus:border-2 focus:border-blue-300"
            />
          </div>
        </div>
        {/* Badge */}
        <div className="flex flex-col flex-2/3">
          <h1 className="text-sm font-bold">
            Add Surcharge {isLoadingSurCharge && <Spinner />}
          </h1>
          <div className="flex flex-row gap-2 flex-wrap">
            {/* Table Surgery && Data Surcharge */}
            {isLoadingSurCharge && (
              <div
                role="status"
                className="max-w-sm animate-pulse flex flex-row gap-2 mt-2"
              >
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-4"></div>

                <span className="sr-only">Loading...</span>
              </div>
            )}
            {dataSurcharge.length > 0 &&
              dataSurcharge.map((items, index) => {
                return (
                  <span
                    key={index}
                    className={`bg-gray-300 text-gray-800 text-xs font-semibold me-2 px-2.5 py-1 rounded-md ${
                      items.mandatory.toLocaleLowerCase() == "true"
                        ? "border border-red-700"
                        : "cursor-pointer"
                    }`}
                  >
                    {items.surcharge_name} ~ {items.currency} 
                    {items.price_in_format}
                  </span>
                );
              })}
            {/* <span className="bg-gray-300 text-gray-800 text-xs font-semibold me-2 px-2.5 py-1 rounded-md border border-red-700">
              GUIDE SURCHARGE FOREIGN ~ EUR 10.00
            </span> */}
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
            <p className="text-xs mt-2 italic">*All taxes and fees included</p>
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
  );
};

export default ProductSubNew;
