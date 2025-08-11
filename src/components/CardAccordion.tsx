// components/CardAccordion.tsx
// Hooks
import React, { useEffect, useState } from "react";
// Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faChevronDown,
  faChevronUp,
  faEdit,
  faTrash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
// Helper
import { format_date, capitalizeFirst } from "@/helper/helper";
import { API_HOSTS } from "@/lib/apihost";
// Library
import toast from "react-hot-toast";
// Context Global
import { useCartApi } from "@/context/CartApiContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

type DetailPax = {
  charge_type: string;
  quantity: string;
  age: string;
  currency: string;
  price_per_item: string;
  price_total: string;
};

type DetailSurcharge = {
  surcharge: string;
  currency: string;
  price_total: string;
};

type CartApiItem = {
  master_file_id: string;
  transaction_id: string;
  market_id: string;
  client_id: string;
  company_id: string;
  supplier_id: string;
  voucher_number: string;
  excursion_id: string;
  excursion_sub_id: string;
  excursion_name: string;
  pickup_date: string;
  pickup_time: string;
  location_id: string;
  location_name: string;
  location_detail: string;
  pax_adult: number;
  pax_child: number;
  pax_infant: number;
  pax_total: number;
  currency_id: string;
  currency: string;
  price: string;
  price_in_format: string;
  priceori: string;
  priceori_in_format: string;
  disc: string;
  // disc_in_format: string;
  disc_in_format: string;
  promo_value: string;
  currency_local_id: string;
  currency_local: string;
  price_local: string;
  price_local_in_format: string;
  remark_to_internal: string;
  remark_to_supplier: string;
  picture: string;
  picture_small: string;
  create_by: string;
  create_date: string;
  modified_by: string;
  modified_date: string;
  detail_pax: DetailPax[];
  detail_surcharge: DetailSurcharge[];
};

type Props = {
  item: CartApiItem; // Ganti `any` dengan tipe yang sesuai jika ada
  onChangeCart: (item: CartApiItem, checked: boolean) => void;
  onRemoveCart: (item: CartApiItem) => void;
};

const CardAccordion: React.FC<Props> = ({
  item,
  onChangeCart,
  onRemoveCart,
}) => {
  const [isOpenAccordion, setAccordion] = useState(false);
  const { saveCartApi } = useCartApi();
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const removeItemCart = async () => {
    setIsRemoving(true);
    const formBody = new URLSearchParams({
      shared_key: item.company_id, // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
      xml: "false",
      id_master_file: item.master_file_id,
      language_code: "EN",
      id_transaction: item.transaction_id,
    });

    try {
      const res = await fetch(
        `${API_HOSTS.host1}/excursion.asmx/v2_cart_remove`,
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
        saveCartApi(json.msg);
        toast.success("Cart Removed");

        onRemoveCart(item);
        // Reload Ulang Cart
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleRemove = () => {
    if (isRemoving) {
      toast.success("Pleases Wait");
      return; // cegah klik ganda
    }

    setIsRemoving(true); // ⏳ mulai loading
    // aksi hapus di sini
    removeItemCart();
  };

  const handleChange = async () => {
    //
    if (isRemoving) {
      toast.success("Pleases Wait remove finish!");
      return; // cegah klik ganda
    }
    // Ambil idx_excursion
    // Cari Country dan Statenya
    const res = await fetch(
      `/api/excursion/attr/search-excursion?keyword=${item.excursion_id}`,
      {
        cache: "no-store", // ⛔ jangan ambil dari cache
      }
    );

    const json = await res.json();
    console.log(json);
    if (json.length > 0) {
      // Redirect Ke Detail Product Sambil Bawa trancation_id lama untuk dihapus dari cart jika berhasil
      router.push(
        `/destination/detail/${json[0].Country}?id=${json[0].idx_comp}&country=${json[0].Country}&state=${json[0].State}&exc=${json[0].Idx_excursion}&transaction_id=${item.transaction_id}`
      );
    } else {
      toast.error("Sorry, there is someting wrong!");
    }
  };

  return (
    <div className="relative md:max-w-3xl mb-4">
      {/* Tombol pojok kanan atas */}
      <button
        className="absolute top-2 right-2 z-10  text-white text-sm px-1 py-1 rounded hover:bg-gray-100"
        onClick={() => {
          // aksi untuk toggle accordion
          console.log("toggle accordion");
          setAccordion(!isOpenAccordion);
        }}
      >
        {isOpenAccordion ? (
          <FontAwesomeIcon
            icon={faChevronUp}
            className="w-10 h-10 text-gray-500"
            size="lg"
          />
        ) : (
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-10 h-10 text-gray-500"
            size="lg"
          />
        )}
      </button>
      <div className="flex flex-col items-center bg-white border border-gray-200 md:rounded-lg shadow-sm hover:bg-gray-50">
        <div
          className="flex items-start flex-row"
          onClick={() => {
            // aksi untuk toggle accordion
            console.log("toggle accordion");
            setAccordion(!isOpenAccordion);
          }}
        >
          <div className=" w-[100%] md:w-48 h-auto p-2">
            <img
              className="object-cover rounded-sm md:rounded-tl-sm h-auto md:w-48"
              src={`${API_HOSTS.img_indo}/${item.picture}`}
              alt=""
            />
          </div>
          <div className="flex flex-col justify-between px-3 pt-2 leading-normal">
            <h5 className="mb-2 text-md md:text-xl pr-7 font-bold tracking-tight text-gray-900 flex-wrap">
              {item.excursion_name ?? "-"}
            </h5>
            <div className="flex flex-row"></div>
            <p className="mb-3 text-xs md:text-md text-gray-700">
              Description ...
            </p>
          </div>
        </div>
        <div className="flex flex-row w-full bg-gray-100">
          <div className="w-[3%] grow p-4 text-left">
            <input
              type="checkbox"
              className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
              value={item.transaction_id}
              onChange={(e) => {
                const checked = e.target.checked;
                console.log("Checkbox is:", checked ? "Checked" : "Unchecked");
                onChangeCart(item, checked);
              }}
              defaultChecked={true} // ✅ hanya untuk default
            />
          </div>
          <div className="w-[40%] grow p-4 text-left">
            <p className="text-black text-sm font-bold">SUB TOTAL</p>
            <p className="text-red-700 text-sm font-semibold">
              {/* {item.currency} {item.price_in_format} */}
              {item.currency_local} {item.price_local_in_format}
            </p>
          </div>
          <div className="w-[15%] grow p-4 text-left">
            <p className="text-black text-sm font-bold">DISC</p>
            <p className="text-red-700 text-sm font-semibold">
              {item.disc_in_format}
            </p>
          </div>
          <div className="w-[40%] grow p-4 text-left">
            <p className="text-black text-sm font-bold">TOTAL</p>
            <p className="text-red-700 text-sm font-semibold">
              {item.currency_local} {item.price_local_in_format}
            </p>
          </div>
        </div>

        <div
          className={`${isOpenAccordion ? "flex flex-row" : "hidden"} w-full`}
        >
          <div className="w-[5%] py-4 text-left">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="w-10 h-10 text-gray-500"
              size="sm"
            />
          </div>
          <div className="w-[95%] p-4  text-left">
            <p className="text-black text-xs font-bold">Pickup date</p>
            <p className="text-black text-xs">
              {format_date(item.pickup_date)} | {item.pickup_time} (Local Time)
            </p>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <p className="text-black text-xs font-bold">Hotel</p>
            <p className="text-black text-xs">
              {capitalizeFirst(item.location_name)}
            </p>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <p className="text-black text-xs font-bold">Room Number</p>
            <p className="text-black text-xs">
              {capitalizeFirst(item.location_detail)}
            </p>
            <hr className="my-2 border border-gray-400 opacity-50" />
          </div>
        </div>
        <div
          className={`${isOpenAccordion ? "flex flex-row" : "hidden"} w-full`}
        >
          <div className="w-[5%] py-4  text-left">
            <FontAwesomeIcon
              icon={faUsers}
              className="w-10 h-10 text-gray-500"
              size="sm"
            />
          </div>
          <div className="w-[95%] p-4  text-left">
            <p className="text-black text-xs font-bold">Traveler</p>
            <p className="text-black text-xs font-bold">
              {item.pax_total} Person
            </p>
            <hr className="my-2 border border-gray-400 opacity-50" />
            {item.detail_pax.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="flex flex-row justify-between">
                    <p className="text-black text-xs">
                      {item.quantity}{" "}
                      {item.charge_type == "A"
                        ? "Adult"
                        : item.charge_type == "C"
                        ? "Child"
                        : item.charge_type == "I"
                        ? "Infant"
                        : item.charge_type == "S"
                        ? "Service"
                        : "Undifined"}
                    </p>
                    <p className="text-black text-xs font-bold">
                      {item.currency} {item.price_total}
                    </p>
                  </div>
                  <hr className="my-2 border border-gray-400 opacity-50" />
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div
          className={`${isOpenAccordion ? "flex flex-row" : "hidden"} w-full`}
        >
          <div className="w-[5%] py-4  text-left"></div>
          <div className="w-[95%] p-4  flex flex-row justify-start items-center gap-3">
            <div
              className="flex flex-row items-center gap-2 group cursor-pointer"
              onClick={handleRemove}
            >
              {isRemoving ? (
                <Spinner />
              ) : (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="w-5 h-5 text-gray-500 group-hover:text-red-700"
                  size="sm"
                />
              )}
              <p className="text-gray-600 text-sm group-hover:text-red-700">
                Remove
              </p>
            </div>
            <div
              className="flex flex-row items-center gap-2 group cursor-pointer"
              onClick={handleChange}
            >
              <FontAwesomeIcon
                icon={faEdit}
                className="w-5 h-5 text-gray-500 group-hover:text-red-700"
                size="sm"
              />
              <p className="text-gray-600 text-sm group-hover:text-red-700">
                Change
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAccordion;
