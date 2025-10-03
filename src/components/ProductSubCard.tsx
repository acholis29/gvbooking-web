// components/DestinationCard.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
// Host Imgae
import { API_HOSTS } from "@/lib/apihost";
// Select
import SelectCustomAsyn from "./SelectCustomAsyn";
import SelectCustom from "./SelectCustom";
// Form Libraries
import { useForm, Controller, useFieldArray } from "react-hook-form";
// Toast
import toast from "react-hot-toast";
// Context State Global
import { useDate } from "@/context/DateContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useReviewBooking } from "@/context/ReviewBookingContext";
import { useInitial } from "@/context/InitialContext";
// Redirect
import { useRouter } from "next/navigation";
import { getHostImageUrl } from "@/helper/helper";
import DatePicker from "react-datepicker";

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
  country?: string;
  state?: string;
  idx_comp?: string;
  transaction_id?: string;
};

type ChargeTypeProps = {
  name: string;
  code: string;
  min_pax: string;
  max_pax: string;
  age_from: string;
  age_to: string;
};

const ProductSub: React.FC<ProductSubProps> = ({
  item,
  country,
  state,
  idx_comp,
  transaction_id,
}) => {
  // Redirect
  const router = useRouter();

  // const host_img =
  //   country == "indonesia"
  //     ? API_HOSTS.img_indo
  //     : country == "thailand"
  //     ? API_HOSTS.img_thai
  //     : country == "vietnam"
  //     ? API_HOSTS.img_viet
  //     : country == "cambodia"
  //     ? API_HOSTS.img_camb
  //     : "";

  const [isLoading, setIsLoading] = useState(true);
  const [dataChargeType, setDataChargeType] = useState<ChargeTypeProps[]>([]);
  const [inputNote, setInputNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [labelSelectPickup, setLabelSelectPickup] = useState<string>("");
  const [pickupTimeFrom, setPickupTimeFrom] = useState<string>("");

  // Date Global
  const { date, setDate } = useDate();
  // Currency Global
  const { currency, setCurrency } = useCurrency();
  // Review Booking Global
  const { reviewBookingObj, setReviewBookingObj } = useReviewBooking();
  // Inital Global
  const { agent, repCode, coreInitial } = useInitial();

  // host sesuai country
  const host_img = getHostImageUrl(coreInitial, idx_comp ?? "");
  // DateLocal SubExcDate
  const [subExcBookingDate, setSubExcBookingDate] = useState<Date | null>(
    () => {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      return today;
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    if (data.Adult == "0" && data.Child == "0") {
      toast.error("Please fill input adult or child!");
    } else {
      // Set Kosong Awal
      setReviewBookingObj({
        idx_comp: "",
        state: "",
        country: "",
        exc_id: "",
        sub_exc_id: "",
        sub_exc_name: "",
        pickup_id: "",
        pickup_name: "",
        pickup_time_from: "",
        room: "",
        adult: "0",
        child: "0",
        infant: "0",
        agent_id: "",
        rep_code: "",
        transaction_id: "",
        sub_exc_booking_date: "",
      });

      const paramsBooking = {
        idx_comp: idx_comp ?? "",
        state: state ?? "",
        country: country ?? "",
        exc_id: item?.excursion_id ?? "",
        sub_exc_id: item?.sub_excursion_id ?? "",
        sub_exc_name: item?.sub_excursion_name ?? "",
        pickup_id: data.pickup_area ?? "",
        pickup_name: labelSelectPickup ?? "",
        pickup_time_from: pickupTimeFrom ?? "",
        room: data.room ?? "",
        adult: data.Adult ?? "0",
        child: data.Child ?? "0",
        infant: data.Infant ?? "0",
        agent_id: agent,
        rep_code: repCode,
        transaction_id: transaction_id ?? "",
        sub_exc_booking_date:
          subExcBookingDate?.toISOString().split("T")[0] ?? "",
      };
      setReviewBookingObj(paramsBooking);
      sessionStorage.setItem(
        "paramsReviewBooking",
        JSON.stringify(paramsBooking)
      );

      router.push("/review_booking");
      toast.success("Booking Process");
    }
  };

  // Product Allotment
  useEffect(() => {
    const fetchDataAllotment = async () => {
      setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: idx_comp || "", // ← ambil dari props // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: item?.excursion_id || "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        id_excursion_sub: item?.sub_excursion_id || "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        tour_date: date, //2025-07-07
        code_of_currency: currency, //IDR, EUR, USD
        promo_code: "R-BC",
      });

      try {
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_product_allotment_list_batch`,
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
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
      }
    };

    fetchDataAllotment();
  }, [date, currency]);

  useEffect(() => {
    if (date) {
      setSubExcBookingDate(new Date(date)); // ubah string jadi Date
    }
  }, [date]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <a className="flex flex-col md:flex-row w-full items-start mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 ">
        {/* <!-- Kolom 1: 1/2  40% --> */}
        <div className="w-full md:basis-1/2  p-2 flex flex-row">
          <div className="w-50 md:w-50 h-50 relative overflow-hidden rounded-lg mr-2">
            <img
              className="w-full h-full object-cover rounded-lg"
              src={`${host_img}/${item?.picture}`}
              title={item?.picture}
              alt={item?.picture}
            />
          </div>

          <div className="flex flex-col w-full">
            <h5 className="text-md font-bold tracking-tight text-gray-900 mts-2">
              {item?.sub_excursion_name}
            </h5>
            <DatePicker
              selected={subExcBookingDate}
              minDate={(() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow;
              })()}
              onChange={(date) => {
                setSubExcBookingDate(date);
                if (date) {
                  // Format ke yyyy-mm-dd dan simpan di context
                  const formatted = date.toISOString().split("T")[0];
                  setDate(formatted);
                  localStorage.setItem("booking_date", formatted);
                }
              }}
              dateFormat="dd/MM/yyyy"
              className="mt-1 bg-gray-100 font-semibold p-2 rounded-2xl w-full shadow-sm focus:outline-none focus:ring-0 border-0"
              wrapperClassName="w-full md:w-auto max-w-xs"
            />
            <p className="ml-4 mt-1 text-xs font-bold md:font-normal text-gray-500 ">
              Pickup from :
            </p>
            <Controller //validasi
              name="pickup_area"
              control={control}
              rules={{ required: "pickup area is required!" }}
              render={({ field, fieldState }) => (
                <SelectCustomAsyn
                  idx_comp={idx_comp}
                  id_excursion={item?.excursion_id}
                  placeholder="Find Pickup Area ..."
                  value={field.value}
                  // onChange={field.onChange}
                  onChange={(val) => {
                    field.onChange(val?.value);
                    setLabelSelectPickup(val?.label ?? "");
                    setPickupTimeFrom(val?.data.time_pickup_from);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  error={fieldState.error?.message}
                />
              )}
            />
            {/* <Controller
              name="room"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="text"
                    className="text-gray-600 text-sm border-gray-300 hidden md:block w-80 h-12 bg-gray-100 rounded-3xl mt-2 focus:outline-none focus:ring-0 focus:border-blue-300 focus:border-2"
                    placeholder="Room number (optional)..."
                    {...field}
                  />
                  <input
                    type="text"
                    className="text-gray-600 text-sm border-gray-300 block md:hidden w-auto h-12 bg-gray-100 rounded-3xl mt-2 focus:outline-none focus:ring-0 focus:border-blue-300 focus:border-2"
                    placeholder="Room number (optional)"
                    {...field}
                  />
                </>
              )}
            /> */}
          </div>
        </div>

        {/* <!-- Kolom 2: 1/4 20% --> */}
        <div className="w-full md:basis-1/5  p-2 md:p-4">
          <div className="flex flex-col justify-end items-center md:items-end">
            {/* Looping Adult/Child/Infant */}
            {dataChargeType?.map((item) => {
              return (
                <SelectCustom
                  key={item.code}
                  placeholder={item.name}
                  max_pax={Number(item.max_pax)}
                  age_from={Number(item.age_from)}
                  age_to={Number(item.age_to)}
                  onSelect={(val) => setValue(`${item.name}`, val)}
                />
              );
            })}
          </div>
        </div>

        {/* <!-- Kolom 3: 1/4 20%--> */}
        <div className="w-full md:basis-1/3  ">
          <div className="flex flex-col w-full px-4 md:p-4">
            <button
              type="submit"
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
      </a>
    </form>
  );
};

export default ProductSub;
