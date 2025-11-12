import React, { useEffect, useState } from "react";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_HOSTS } from "@/lib/apihost";
import { useSeason } from "@/context/SeasonContext";
import Spinner from "./Spinner";
import { useCurrency } from "@/context/CurrencyContext";
import { acis_qty_age } from "@/helper/helper";
import { Alert } from "flowbite-react";
import toast from "react-hot-toast";
import { useInitial } from "@/context/InitialContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCartApi } from "@/context/CartApiContext";
import { useRouter } from "next/navigation";

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
  pickup_time_from: string;
  idx_comp: string;
  date_booking: string;
  total_pax_adult: string;
  total_pax_child: string;
  arr_ages_child: string[];
  total_pax_infant: string;
};

const ProductSubNew: React.FC<ProductSubNewProps> = ({
  dataSub,
  pickupArea,
  pickupArea_id,
  pickup_time_from,
  idx_comp,
  date_booking,
  total_pax_adult,
  total_pax_child,
  arr_ages_child,
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
  // GLOBAL CONTEXT / HOOKS
  const router = useRouter();
  // Profile Initial dan Resource initial
  const { resourceInitial, profileInitial } = useInitial();
  // Language
  const { language, setLanguage } = useLanguage();
  // Inital Global
  const { agent, repCode, coreInitial } = useInitial();
  // Hooks Customs
  const { saveCartApi } = useCartApi();

  const [dataSurcharge, setDataSurcharge] = useState<PriceOfSurcharge[]>([]);
  const [dataChargeType, setDataChargeType] = useState<PriceOfChargeType[]>([]);
  const [selectedSurcharge, setSelectedSurcharge] = useState<
    PriceOfSurcharge[]
  >([]);
  // Session Id
  const { voucherNumber, setVoucherNumber, masterFileId, setMasterFileId } =
    useSeason();
  const [marketId, setMarketId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [contractId, setContractId] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [totalSurcharge, setTotalSurcharge] = useState<number>(0);
  const [totalCharge, setTotalCharge] = useState<number>(0);
  const [roomNumber, setRoomNumber] = useState("");
  const [pickupTimeFrom, setPickupTimeFrom] = useState<string>(
    pickup_time_from || ""
  );
  const [inputItem, setInputItem] = useState<string>("");
  const [inputSurcharge, setInputSurcharge] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Currency
  const { currency, setCurrency } = useCurrency();

  // Loading
  const [isLoadingSurCharge, setIsLoadingSurcharge] = useState(true);
  const [isLoadingChargeType, setIsLoadingChargeType] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let objChild = {
      count: total_pax_child,
      ages: arr_ages_child,
    };

    const acis = acis_qty_age(
      total_pax_adult.toString(),
      JSON.stringify(objChild),
      total_pax_infant.toString() ?? ""
    );

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
          setVoucherNumber(json.msg.season_id.voucher_number);
          setMasterFileId(json.msg.season_id.master_file_id);
          const data_msc = json?.msg?.price_of_charge_type?.find(
            (item: any) => item.charge_type === "A"
          );
          setMarketId(data_msc.market_id);
          setContractId(data_msc.contract_id);
          setSupplierId(data_msc.supplier_id);
          hitungTotal(
            json.msg.price_of_charge_type,
            json.msg.price_of_surcharge
          );
          concatInputItem(json.msg.price_of_charge_type);
          concatInputSurcharge(json.msg.price_of_surcharge);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setIsLoadingSurcharge(false);
        setIsLoadingChargeType(false);
      } finally {
        setIsLoadingChargeType(false);
        setIsLoadingSurcharge(false);
      }
    };

    fetchDataGuideSurcharge();
  }, []);

  function hitungTotal(
    ChargeType: PriceOfChargeType[],
    Surcharge: PriceOfSurcharge[]
  ): number {
    let total = 0;
    let total_surcharge = 0;
    let total_charge = 0;
    if (ChargeType.length > 0) {
      for (let i = 0; i < ChargeType.length; i++) {
        total += parseFloat(ChargeType[i].sale_rates_total);
        total_charge += parseFloat(ChargeType[i].sale_rates_total);
      }
    }

    if (Surcharge.length > 0) {
      for (let j = 0; j < Surcharge.length; j++) {
        if (Surcharge[j].mandatory.toLocaleLowerCase() == "true") {
          total += parseFloat(Surcharge[j].price);
          total_surcharge += parseFloat(Surcharge[j].price);
        }
      }
    }

    if (selectedSurcharge.length > 0) {
      for (let k = 0; k < selectedSurcharge.length; k++) {
        total += parseFloat(selectedSurcharge[k].price);
        total_surcharge += parseFloat(selectedSurcharge[k].price);
      }
    }

    setTotal(total);
    setTotalCharge(total_charge);
    setTotalSurcharge(total_surcharge);
    return total;
  }

  function handleBadgeSurchargeChange(itemSelected: PriceOfSurcharge) {
    setSelectedSurcharge((prev) => {
      // Check item sudah ada di dalam array apa belum
      const exists = prev.some(
        (item) => item.surcharge_id === itemSelected.surcharge_id
      );

      if (exists) {
        // Hapus string set input surcharge
        setInputSurcharge((prev) => {
          const toRemove = `${itemSelected.surcharge_id}|${itemSelected.price}`;
          const parts = prev.split(",").filter((item) => item !== toRemove);
          return parts.join(",");
        });
        // Hapus item yang sama
        return prev.filter(
          (item) => item.surcharge_id !== itemSelected.surcharge_id
        );
      } else {
        // Tambah string set input surcharge
        setInputSurcharge((prev) => {
          const newItem = `${itemSelected.surcharge_id}|${itemSelected.price}`;
          if (!prev.includes(newItem)) {
            return prev ? `${prev},${newItem}` : newItem;
          }
          return prev;
        });
        // Tambahkan item baru
        return [...prev, itemSelected];
      }
    });
  }

  function concatInputItem(ChargeType: PriceOfChargeType[]): string {
    let inputItem = "";
    if (ChargeType.length > 0) {
      for (let i = 0; i < ChargeType.length; i++) {
        inputItem += ChargeType[i].charge_type + "|";
        inputItem += ChargeType[i].pax + "|";
        inputItem += ChargeType[i].age + "|";
        inputItem += ChargeType[i].buy_rates + "|";
        inputItem += ChargeType[i].buy_currency_id + "|";
        inputItem += ChargeType[i].sale_rates + "|";
        inputItem += ChargeType[i].sale_currency_id + "|";
        inputItem += ChargeType[i].raw_exchange_rates + "|";
        inputItem += ChargeType[i].buy_rates_total + "|";
        inputItem += ChargeType[i].sale_rates_total + ",";
      }
      inputItem = inputItem.slice(0, -1); // hapus koma terakhir
    }
    setInputItem(inputItem);
    return inputItem;
  }

  function concatInputSurcharge(Surcharge: PriceOfSurcharge[]): string {
    let inputSurcharge = "";
    if (Surcharge.length > 0) {
      for (let j = 0; j < Surcharge.length; j++) {
        if (Surcharge[j].mandatory.toLocaleLowerCase() == "true") {
          inputSurcharge += Surcharge[j].surcharge_id + "|";
          inputSurcharge += Surcharge[j].price + ",";
        }
      }
      inputSurcharge = inputSurcharge.slice(0, -1);
      setInputSurcharge(inputSurcharge);
    }
    return inputSurcharge;
  }

  function handleSubmitToCart() {
    if (isSubmitting) {
      toast("Please wait...", {
        icon: "⏳", // hourglass
      });
      return null;
    }
    setIsSubmitting(true);

    const PostDataCart = async () => {
      setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8" IDX_COMP INDONESIA
        xml: "false",
        id_master_file: profileInitial[0].idx_mf ?? "",
        language_code: language,
        voucher_number: profileInitial[0].voucher, // Examp : "250759791"
        id_transaction: "",
        id_excursion: dataSub.excursion_id ?? "", // Examp : "3A4D09DA-0F15-4F96-B9DE-337D808C43E0"
        id_excursion_sub: dataSub.sub_excursion_id ?? "",
        id_agent: agent ?? "", // Examp AgentId Indo : "AF228762-345C-47B9-BDB8-19B94FB7A02D"
        id_contract: contractId ?? "", // Examp : "543662F5-0BC9-4198-8076-54440FBDDF38"
        id_market: marketId ?? "", // Examp : "4AD24FF1-2F16-47DB-BBC8-D2E5395773EB"
        id_supplier: supplierId, // Examp : "155D1088-BC9C-D85A-E9BC-96778772AC0F"
        id_pickup_area: pickupArea_id ?? "", // Examp pickup id : "12EBA6A1-533A-4875-B0A7-CA6362370FF3"
        pickup_point: roomNumber ?? "", //Exam : Lobby
        pickup_date: date_booking ?? "", // 2025-08-01 ini sub exc
        pickup_time: pickupTimeFrom ?? "", //05:45
        remark: "",
        input_item: inputItem ?? "", // surcharge_id|price,
        input_surcharge: inputSurcharge ?? "", // "DB7DA528-58C7-4C11-96C6-571125744413|134295"
      });

      try {
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_cart_save`,
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
          //RESPONSE ADD TO CART
          // set data cart api disini
          saveCartApi(json.msg);
          toast.success("Success add to cart");
        }
      } catch (err: any) {
        setError(err.message || "Error");
        console.error("Fetch error:", err);
      } finally {
        // redirect ke cart page
        setIsSubmitting(false);
        setIsLoading(false); // selesai loading
        router.replace("/cart");
      }
    };
    PostDataCart();
  }

  useEffect(() => {
    hitungTotal(dataChargeType, dataSurcharge);
  }, [selectedSurcharge]);

  return (
    <div className="w-full rounded-2xl mt-5 hover:border-2 border-gray-400 shadow-md bg-gray-100">
      {/* Desc */}
      <div className="flex flex-col md:flex-row p-5 justify-between gap-5 md:gap-10">
        {/* Tilte, Time, Room */}
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
            value={roomNumber}
            onChange={(e) => {
              setRoomNumber(e.target.value);
            }}
            className="text-gray-600 text-sm border border-gray-300 w-full h-8 rounded-md mt-2
                      focus:outline-none focus:ring-0 focus:border-2 focus:border-blue-300"
          />

          {/* Time input */}
          <div className="relative inline-block mt-2 item">
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
              value={pickupTimeFrom}
              onChange={(e) => {
                setPickupTimeFrom(e.target.value);
              }}
              required
              className={`text-gray-600 text-sm border border-gray-300 pl-8 w-40 h-8 
                        ${
                          pickup_time_from == "00:00" || pickup_time_from == ""
                            ? "bg-white"
                            : "bg-gray-100"
                        } rounded-md focus:outline-none focus:ring-0 
                        focus:border-2 focus:border-blue-300`}
              disabled={
                pickup_time_from == "00:00" || pickup_time_from == ""
                  ? false
                  : true
              }
            />
          </div>
          {pickup_time_from == "00:00" || pickup_time_from == "" ? (
            <p className="text-xs text-yellow-600 italic pt-1">
              *You can change the pickup time
            </p>
          ) : (
            <p className="text-xs text-yellow-500"></p>
          )}
        </div>
        {/* Badge */}
        <div className="flex flex-col flex-2/3">
          <h1 className="text-sm font-bold">
            Mandatory Surcharge {isLoadingSurCharge && <Spinner />}
          </h1>
          <div className="flex flex-col md:flex-row gap-2 flex-wrap">
            {/* Table Surgery && Data Surcharge */}
            {isLoadingSurCharge && (
              <div
                role="status"
                className="max-w-sm animate-pulse flex flex-col md:flex-row md:gap-2 mt-2"
              >
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-3 md:mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-3 md:mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-3 md:mb-4"></div>

                <span className="sr-only">Loading...</span>
              </div>
            )}
            {dataSurcharge.length > 0 ? (
              dataSurcharge.map((items, index) => {
                if (items.mandatory.toLocaleLowerCase() == "true") {
                  return (
                    <p
                      key={index}
                      className="text-xs text-red-900 font-semibold"
                    >
                      {" "}
                      {items.surcharge_name} ~ {items.currency} 
                      {items.price_in_format}
                    </p>
                  );
                }
              })
            ) : (
              <p className="text-xs">-</p>
            )}
          </div>
          <h1 className="text-sm font-bold">
            Add Surcharge {isLoadingSurCharge && <Spinner />}
          </h1>
          <div className="flex flex-col md:flex-row gap-2 flex-wrap">
            {/* Table Surgery && Data Surcharge */}
            {isLoadingSurCharge && (
              <div
                role="status"
                className="max-w-sm animate-pulse flex flex-col md:flex-row md:gap-2 mt-2"
              >
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-3 md:mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-3 md:mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md  w-60 mb-3 md:mb-4"></div>

                <span className="sr-only">Loading...</span>
              </div>
            )}
            {dataSurcharge.length > 0 ? (
              dataSurcharge.map((items, index) => {
                // Check Apa Surcharge Ini Sudah Selected Apa Belum
                const isExist = selectedSurcharge.some(
                  (item) => item.surcharge_id === items.surcharge_id
                );

                if (items.mandatory.toLocaleLowerCase() == "false") {
                  return (
                    <span
                      key={index}
                      className={`bg-gray-300 hover:bg-amber-600 text-gray-800 text-xs font-semibold me-2 px-2.5 py-1 rounded-md ${
                        items.mandatory.toLocaleLowerCase() == "true"
                          ? "border border-red-700"
                          : "cursor-pointer"
                      } ${isExist ? "border border-red-700" : ""}`}
                      onClick={() => {
                        if (items.mandatory.toLocaleLowerCase() != "true") {
                          handleBadgeSurchargeChange(items);
                        }
                      }}
                      title={`${
                        items.mandatory.toLocaleLowerCase() == "true"
                          ? "Included"
                          : `${
                              isExist ? "Click to remove" : "Click to include"
                            }`
                      } `}
                    >
                      {items.surcharge_name} ~ {items.currency} 
                      {items.price_in_format}
                    </span>
                  );
                }
              })
            ) : (
              <p className="text-xs">-</p>
            )}
          </div>
        </div>
      </div>

      {/* Total */}
      <div
        className="flex flex-col md:flex-row justify-between gap-7 border-t-2 border-red-700 
                     bg-gray-300 rounded-b-2xl p-5"
      >
        {/* Left side (pricing) */}
        <div className="flex flex-row gap-5">
          <div className="flex flex-col">
            {isLoadingChargeType ? (
              <p className="text-sm text-gray-600 font-medium animate-pulse">
                Please wait, calculating…
              </p>
            ) : (
              <h1 className="text-xl font-bold">
                {currency} {total.toLocaleString()}
              </h1>
            )}

            {isLoadingChargeType && (
              <div
                role="status"
                className="max-w-sm animate-pulse flex flex-col gap-2 mt-2"
              >
                <div className="h-3 bg-gray-200 rounded-md  w-40 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded-md  w-40 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded-md  w-40 mb-1"></div>

                <span className="sr-only">Loading...</span>
              </div>
            )}

            {dataChargeType.length > 0 ? (
              dataChargeType.map((item, index) => (
                <p key={index} className="text-xs">
                  {item.pax}{" "}
                  {item.charge_type === "A"
                    ? "Adult"
                    : item.charge_type === "C"
                    ? "Child"
                    : item.charge_type === "I"
                    ? "Infant"
                    : "N/A"}{" "}
                  {" x "}
                  {item.sale_currency} {item.sale_rates_total_in_format}
                </p>
              ))
            ) : (
              <p></p>
            )}

            {/* <p className="text-xs">1 Adult x Rp 676,851</p>
            <p className="text-xs">1 Youth x Rp 451,234</p>
            <p className="text-xs">1 Child x Rp 0</p> */}
            <p className="text-xs mt-2 italic">*All taxes and fees included</p>
          </div>
          <div className="flex flex-col mt-7">
            {isLoadingChargeType && (
              <div
                role="status"
                className="max-w-sm animate-pulse flex flex-col gap-2 mt-2"
              >
                <div className="h-3 bg-gray-200 rounded-md  w-30 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded-md  w-30 mb-1"></div>

                <span className="sr-only">Loading...</span>
              </div>
            )}

            {!isLoadingChargeType && (
              <>
                {" "}
                <p className="text-xs">
                  Surcharge x {currency} {totalSurcharge}
                </p>
                {/* Discount tidak ada disini hanya ada di cart */}
                <p className="text-xs">Discount {currency} 0</p>
              </>
            )}
          </div>
        </div>

        {/* Right side (button) */}
        <div className="flex flex-col items-center justify-center md:w-60">
          {!isLoadingChargeType && (
            <button
              onClick={() => {
                handleSubmitToCart();
              }}
              className="w-full md:w-60 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl px-4 py-2 cursor-pointer"
            >
              {isLoading && <Spinner />} Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSubNew;
