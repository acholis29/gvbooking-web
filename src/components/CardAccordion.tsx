// components/CardAccordion.tsx
// Hooks
import React, { useEffect, useState, useRef } from "react";
// Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import {
  faCalendarAlt,
  faCalendarDays,
  faCancel,
  faCaretDown,
  faChevronDown,
  faChevronUp,
  faClock,
  faEdit,
  faMinusCircle,
  faPlusCircle,
  faSave,
  faTrash,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
// Helper
import {
  format_date,
  capitalizeFirst,
  getHostImageUrl,
  acis_qty_age,
} from "@/helper/helper";
import { API_HOSTS } from "@/lib/apihost";
// Library
import toast from "react-hot-toast";
// Context Global
import { useCartApi } from "@/context/CartApiContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useInitial } from "@/context/InitialContext";
import DatePicker from "react-datepicker";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import SelectCustomAsynNew from "./SelectCustomAsynNew";

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
  // Inital Global
  const { agent, repCode, coreInitial, resourceInitial } = useInitial();
  const [isEdit, setIsEdit] = useState(false);
  const [openDateEdit, setOpenDateEdit] = useState(false);
  // State Edit
  const [selectedDate, setSelectedDate] = useState(new Date(item.pickup_date));
  const [locationId, setLocaltionId] = useState(item.location_id);
  const [openDropdownPax, setOpenDropdownPax] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [totalSurcharge, setTotalSurcharge] = useState<number>(0);
  const [totalCharge, setTotalCharge] = useState<number>(0);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [marketId, setMarketId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [contractId, setContractId] = useState<string>("");
  const [locationPickupTime, setLocationPickupTime] = useState(
    item.pickup_time
  );

  const [inputItem, setInputItem] = useState<string>("");
  const [inputSurcharge, setInputSurcharge] = useState<string>("");

  // set adult, child, infant
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [valDropdownPax, setValDropdownPax] = useState("Adult x 1");
  const [childAges, setChildAges] = useState<string[]>([]);
  // Currency
  const { currency, setCurrency } = useCurrency();
  const { language } = useLanguage();

  type ChargeTypeProps = {
    name: string;
    code: string;
    min_pax: string;
    max_pax: string;
    age_from: string;
    age_to: string;
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

  // Allotment untuk lihat jenis pax Adult, Child, Infant
  const [dataChargeType, setDataChargeType] = useState<ChargeTypeProps[]>([]);
  const [priceSurcharge, setPriceSurcharge] = useState<PriceOfSurcharge[]>([]);
  const [priceChargeType, setPriceChargeType] = useState<PriceOfChargeType[]>(
    []
  );

  // Handle Close OnClick Out Reference
  const refPax = useRef<HTMLDivElement>(null);
  const refDate = useRef<HTMLDivElement>(null);

  // Form Validate
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    // data form disini
  };

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
      toast("Please wait...", {
        icon: "⏳", // hourglass
      });
      return; // prevent double click
    }

    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "This action cannot be undone!",
      icon: "warning",
      iconColor: "#d33", // red
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33", // red
      cancelButtonColor: "#6c757d", // gray
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsRemoving(true); //  start loading
        // delete action here
        await removeItemCart();
      }
    });
  };

  const handleChange = async () => {
    //
    if (isRemoving) {
      toast("Please wait remove finish!...", {
        icon: "⏳", // hourglass
      });
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
    if (json.length > 0) {
      // Redirect Ke Detail Product Sambil Bawa trancation_id lama untuk dihapus dari cart jika berhasil
      router.push(
        `/destination/details/${json[0].Country}?id=${json[0].idx_comp}&country=${json[0].Country}&state=${json[0].State}&exc=${json[0].Idx_excursion}&transaction_id=${item.transaction_id}`
      );
    } else {
      toast.error("Sorry, there is someting wrong!");
    }
  };

  function handleImage() {
    let host = getHostImageUrl(coreInitial, item.company_id);
    if (host) {
      return `${host}/${item.picture}`;
    } else {
      return "/images/error/loading.gif";
    }
  }

  // Hanlde Child Age
  const handleAgeChange = (index: number, value: string) => {
    let age = parseInt(value);
    if (isNaN(age)) age = 1;
    if (age < 1) age = 1;
    if (age > 12) age = 12;

    const updatedAges = [...childAges];
    updatedAges[index] = age.toString();
    setChildAges(updatedAges);
  };

  // Hanlde First Load Age
  const prevCountRef = useRef(childCount);
  useEffect(() => {
    // kalau childCount bertambah (increment)
    if (childCount > prevCountRef.current) {
      const diff = childCount - prevCountRef.current;
      setChildAges((prev) => [...prev, ...Array(diff).fill("12")]);
    }
    // kalau berkurang, hapus elemen dari akhir
    else if (childCount < prevCountRef.current) {
      setChildAges((prev) => prev.slice(0, childCount));
    }

    // simpan nilai terbaru untuk perbandingan berikutnya
    prevCountRef.current = childCount;
  }, [childCount]);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (refPax.current && !refPax.current.contains(target)) {
        setOpenDropdownPax(false);
      }

      if (refDate.current && !refDate.current.contains(target)) {
        setOpenDateEdit(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Product Allotment
  useEffect(() => {
    const fetchDataAllotment = async () => {
      // setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: item.company_id || "", // ← ambil dari props // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: item.excursion_id || "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        id_excursion_sub: item.excursion_sub_id || "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        tour_date: item.pickup_date, //2025-07-07
        code_of_currency: item.currency, //IDR, EUR, USD
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
        // setError(err.message || "Terjadi kesalahan");
        console.error("Fetch error:", err);
      } finally {
        // setIsLoading(false); // selesai loading
      }
    };

    fetchDataAllotment();
  }, []);

  useEffect(() => {
    let parts: string[] = [];

    if (adultCount > 0) {
      parts.push(`Adl x ${adultCount}`);
    }

    if (childCount > 0) {
      parts.push(`Chd x ${childCount}`);
    }

    if (infantCount > 0) {
      parts.push(`Inf x ${infantCount}`);
    }

    if (adultCount == 0 && childCount == 0 && infantCount == 0) {
      setAdultCount(1);
    }

    let text = parts.join(", ");

    setValDropdownPax(text);
  }, [adultCount, childCount, infantCount]);

  // Initial value pax
  useEffect(() => {
    if (item.detail_pax.length > 0) {
      item.detail_pax.forEach((pax, index) => {
        if (pax.charge_type.toLocaleLowerCase() == "a") {
          setAdultCount(parseInt(pax.quantity));
        }

        if (pax.charge_type.toLocaleLowerCase() == "c") {
          setChildCount(parseInt(pax.quantity));
        }

        if (pax.charge_type.toLocaleLowerCase() == "i") {
          setInfantCount(parseInt(pax.quantity));
        }
      });
    }
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

    // Bagian ini cek surcharge yang sudah dipilih sebelumnya
    if (Surcharge.length > 0) {
      for (let k = 0; k < Surcharge.length; k++) {
        if (Surcharge[k].mandatory.toLocaleLowerCase() == "false") {
          const found = item.detail_surcharge.find(
            (item) =>
              item.surcharge.toLocaleLowerCase() ==
              Surcharge[k].surcharge_name.toLocaleLowerCase()
          );

          if (found) {
            total += parseFloat(Surcharge[k].price);
            total_surcharge += parseFloat(Surcharge[k].price);
          }
        }
      }
    }

    setTotal(total);
    setTotalCharge(total_charge);
    setTotalSurcharge(total_surcharge);
    return total;
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
        // Kalo mandatory true langsung tambahkan
        if (Surcharge[j].mandatory.toLocaleLowerCase() == "true") {
          inputSurcharge += Surcharge[j].surcharge_id + "|";
          inputSurcharge += Surcharge[j].price + ",";
        } else {
          // Kalo mandatory false, cek apakah dipilih sebelumnya jika ya tambahkan
          const found = item.detail_surcharge.find(
            (item) =>
              item.surcharge.toLocaleLowerCase() ==
              Surcharge[j].surcharge_name.toLocaleLowerCase()
          );

          if (found) {
            inputSurcharge += Surcharge[j].surcharge_id + "|";
            inputSurcharge += Surcharge[j].price + ",";
          }
        }
      }
      inputSurcharge = inputSurcharge.slice(0, -1);
      setInputSurcharge(inputSurcharge);
    }
    return inputSurcharge;
  }

  // Save Update Cart
  async function saveUpdateCart() {
    // Jalankan API SUB Excursion untuk ambil price
    // Jalankan API Product Price untuk ambil charge type dan surchargenya yang mandatori
    if (isLoadingSave) {
      toast.error("Please Wait");
      return null;
    }
    setIsLoadingSave(true);
    let objChild = {
      count: childCount,
      ages: childAges,
    };

    const acis = acis_qty_age(
      adultCount.toString(),
      JSON.stringify(objChild),
      infantCount.toString() ?? ""
    );

    const fetchDataGuideSurcharge = async () => {
      const formBody = new URLSearchParams({
        shared_key: item.company_id ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: item.excursion_id ?? "", // Examp : "BA928E11-CE70-4427-ACD0-A7FC13C34891"
        id_excursion_sub: item.excursion_sub_id ?? "", // Examp :"123A24BD-56EC-4188-BE9D-B7318EF0FB84"
        id_pickup_area: locationId ?? "", // Examp : "1EC87603-7ECC-48BC-A56C-F513B7B28CE3"
        tour_date: selectedDate.toISOString().split("T")[0] ?? "", //2025-07-11 ini sub exc
        total_pax_adult: adultCount.toString(), // 1
        total_pax_child: childCount.toString(), // 2
        total_pax_infant: infantCount.toString(), // 2
        code_of_currency: item.currency, // IDR
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
          setPriceSurcharge(json.msg.price_of_surcharge);
          setPriceChargeType(json.msg.price_of_charge_type);
          const total = hitungTotal(
            json.msg.price_of_charge_type,
            json.msg.price_of_surcharge
          );

          const data_msc = json?.msg?.price_of_charge_type?.find(
            (item: any) => item.charge_type === "A"
          );
          setMarketId(data_msc.market_id);
          setContractId(data_msc.contract_id);
          setSupplierId(data_msc.supplier_id);
          concatInputItem(json.msg.price_of_charge_type);
          concatInputSurcharge(json.msg.price_of_surcharge);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setIsLoadingSave(false);
      } finally {
        // setIsLoadingSave(false);
      }
    };

    fetchDataGuideSurcharge();
  }

  // Save to cart
  function handleSubmitToCart() {
    const PostDataCart = async () => {
      const formBody = new URLSearchParams({
        shared_key: item.company_id ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8" IDX_COMP INDONESIA
        xml: "false",
        id_master_file: item.master_file_id ?? "",
        language_code: language,
        voucher_number: item.voucher_number, // Examp : "250759791"
        id_transaction: "",
        id_excursion: item.excursion_id ?? "", // Examp : "3A4D09DA-0F15-4F96-B9DE-337D808C43E0"
        id_excursion_sub: item.excursion_sub_id ?? "",
        id_agent: resourceInitial.agent_id ?? "", // Examp AgentId Indo : "AF228762-345C-47B9-BDB8-19B94FB7A02D"
        id_contract: contractId ?? "", // Examp : "543662F5-0BC9-4198-8076-54440FBDDF38"
        id_market: marketId ?? "", // Examp : "4AD24FF1-2F16-47DB-BBC8-D2E5395773EB"
        id_supplier: supplierId ?? "", // Examp : "155D1088-BC9C-D85A-E9BC-96778772AC0F"
        id_pickup_area: item.location_id ?? "", // Examp pickup id : "12EBA6A1-533A-4875-B0A7-CA6362370FF3"
        pickup_point: item.location_detail ?? "", //Exam : Lobby
        pickup_date: selectedDate.toISOString().split("T")[0] ?? "", // 2025-08-01 ini sub exc
        pickup_time: locationPickupTime ?? "", //05:45
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
          removeItemCart();
          setIsEdit(false);
          toast.success("Success add to cart");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoadingSave(false);
      }
    };
    PostDataCart();
  }

  useEffect(() => {
    if (total == 0 && priceChargeType.length == 0) return;
    handleSubmitToCart();
  }, [priceSurcharge]);

  return (
    <div className="relative md:max-w-3xl mb-4">
      {/* Tombol pojok kanan atas */}
      <button
        className="absolute top-2 right-2 z-10  text-white text-sm px-1 py-1 rounded hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          // aksi untuk toggle accordion
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
      <div className="flex flex-col items-start bg-white border border-gray-200 md:rounded-lg shadow-sm hover:bg-gray-50">
        <div
          className="flex items-start flex-row"
          onClick={() => {
            // aksi untuk toggle accordion
            // setAccordion(!isOpenAccordion);
          }}
        >
          <div className=" w-[100%] max-w-36 md:w-48 h-auto p-2">
            <img
              className="object-cover rounded-sm md:rounded-tl-sm h-auto md:w-48"
              src={handleImage()}
              alt="-"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/images/icon/android-chrome-512x512.png";
              }}
            />
          </div>
          <div className="flex flex-col justify-between px-3 pt-2 leading-normal">
            <h5 className="mb-2 text-md md:text-xl pr-7 font-bold tracking-tight text-gray-900 flex-wrap cursor-pointer">
              {item.excursion_name ?? "-"}
            </h5>
            <div className="flex flex-row"></div>

            {!isEdit && (
              <p className="mb-3 text-xs md:text-md text-gray-700">
                {item.location_name} | {item.pickup_time}
                {/* <FontAwesomeIcon icon={faClock} className="w-4 h-4 ml-1" /> */}
              </p>
            )}
            {/*Edit */}
            {isEdit && (
              <>
                <div className="flex flex-col md:flex-row gap-1">
                  {/* Select Date */}
                  <div
                    className="relative h-10 md:w-50 flex flex-row items-center bg-gray-200 rounded-xl cursor-pointer"
                    ref={refDate}
                  >
                    <div
                      className="h-10 w-full md:w-50 px-3 flex flex-row justify-between items-center bg-white border border-gray-300 rounded-xl cursor-pointer"
                      onClick={() => {
                        setOpenDateEdit(!openDateEdit);
                      }}
                    >
                      {/* Kiri: Icon Kalender + Tanggal */}
                      <div className="flex flex-row items-center">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="w-4 h-4 text-gray-500 mr-2"
                          size="lg"
                        />
                        <p className="text-sm font-bold text-gray-500">
                          {selectedDate.toLocaleDateString("en-GB")}
                        </p>
                      </div>

                      {/* Kanan: Icon Panah */}
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                          openDateEdit ? "rotate-180" : ""
                        }`}
                        size="lg"
                      />
                    </div>

                    {/* Popup Kalender */}
                    {openDateEdit && (
                      <div className="absolute top-full mt-2 right-0 z-10 bg-white shadow-lg rounded">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => {
                            if (!date) return; // stop kalau date null
                            setSelectedDate(date);
                          }}
                          minDate={(() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            return tomorrow;
                          })()}
                          inline
                          className="p-2"
                        />
                      </div>
                    )}
                  </div>
                  {/* PAX */}
                  <div className="relative" ref={refPax}>
                    {/* Trigger */}
                    <div
                      className="h-10 w-60 px-3 flex flex-row justify-between items-center bg-white border border-gray-300 rounded-xl cursor-pointer"
                      onClick={() => setOpenDropdownPax(!openDropdownPax)}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="w-4 h-4 text-gray-500 mr-2"
                          size="lg"
                        />
                        <p className="text-sm font-bold text-gray-500">
                          {valDropdownPax}
                          {/* Adult x 1, Child x 1, Infant x 1 */}
                        </p>
                      </div>
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                          openDropdownPax ? "rotate-180" : ""
                        }`}
                        size="lg"
                      />
                    </div>

                    {/* Dropdown list muncul di bawah trigger */}
                    {openDropdownPax && (
                      <div className="absolute top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                        <ul className="py-2">
                          {/* Adult */}
                          {dataChargeType.map((item, index) => {
                            if (item.name.toLowerCase() == "adult") {
                              return (
                                <li
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-around"
                                >
                                  <p className="w-10 font-semibold text-gray-500">
                                    Adult
                                  </p>
                                  <FontAwesomeIcon
                                    icon={faMinusCircle}
                                    className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                      openDropdownPax ? "rotate-180" : ""
                                    }`}
                                    size="lg"
                                    onClick={() => {
                                      if (adultCount > 0) {
                                        setAdultCount(adultCount - 1);
                                      }
                                    }}
                                  />
                                  <p className="w-5 text-center text-gray-500">
                                    {adultCount}
                                  </p>
                                  <FontAwesomeIcon
                                    icon={faPlusCircle}
                                    className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                      openDropdownPax ? "rotate-180" : ""
                                    }`}
                                    size="lg"
                                    onClick={() => {
                                      setAdultCount(adultCount + 1);
                                    }}
                                  />
                                </li>
                              );
                            }
                          })}

                          {/* Child */}
                          {dataChargeType.map((item, index) => {
                            if (item.name.toLocaleLowerCase() == "child") {
                              return (
                                <li
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-100 flex flex-col"
                                >
                                  <div className="flex flex-row justify-around items-center">
                                    <p className="w-10 font-semibold text-gray-500">
                                      Child
                                    </p>
                                    <FontAwesomeIcon
                                      icon={faMinusCircle}
                                      className="w-4 h-4 text-red-400"
                                      onClick={() => {
                                        childCount > 0 &&
                                          setChildCount(childCount - 1);
                                      }}
                                    />
                                    <p className="w-5 text-center text-gray-500">
                                      {childCount}
                                    </p>
                                    <FontAwesomeIcon
                                      icon={faPlusCircle}
                                      className="w-4 h-4 text-red-400"
                                      onClick={() => {
                                        setChildCount(childCount + 1);
                                      }}
                                    />
                                  </div>

                                  {/* Input umur anak */}
                                  {childCount > 0 && (
                                    <div className="mt-2 ml-5 flex flex-col gap-1">
                                      {[...Array(childCount)].map((_, i) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-2"
                                        >
                                          <p className="text-xs w-10 text-gray-500">
                                            Age {i + 1}
                                          </p>
                                          <input
                                            type="number"
                                            min="1"
                                            max="12"
                                            className="w-16 px-2 py-1 border rounded-md text-sm text-gray-500"
                                            value={childAges[i] || "12"}
                                            onChange={(e) =>
                                              handleAgeChange(i, e.target.value)
                                            }
                                            placeholder="0–12"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </li>
                              );
                            }
                          })}

                          {/* Infant */}
                          {dataChargeType.map((item, index) => {
                            if (item.name.toLocaleLowerCase() == "infant") {
                              return (
                                <li
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-around"
                                >
                                  <p className="w-10 font-semibold text-gray-500">
                                    Infant
                                  </p>
                                  <FontAwesomeIcon
                                    icon={faMinusCircle}
                                    className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                      openDropdownPax ? "rotate-180" : ""
                                    }`}
                                    size="lg"
                                    onClick={() => {
                                      if (infantCount > 0) {
                                        setInfantCount(infantCount - 1);
                                      }
                                    }}
                                  />
                                  <p className="w-5 text-center text-gray-500">
                                    {infantCount}
                                  </p>
                                  <FontAwesomeIcon
                                    icon={faPlusCircle}
                                    className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                      openDropdownPax ? "rotate-180" : ""
                                    }`}
                                    size="lg"
                                    onClick={() => {
                                      setInfantCount(infantCount + 1);
                                    }}
                                  />
                                </li>
                              );
                            }
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mt-2">
                  {/* Find Pickup */}
                  <div className="h-10 w-full flex flex-row justify-around items-center">
                    <Controller //validasi
                      name="pickup_area"
                      control={control}
                      rules={{ required: "pickup area is required!" }}
                      render={({ field, fieldState }) => (
                        <SelectCustomAsynNew
                          idx_comp={item.company_id ?? ""}
                          id_excursion={item.excursion_id ?? ""}
                          placeholder="Find Pickup Area ..."
                          value={field.value}
                          defaultLabel={item.location_name} // opsional hanya untuk edit atau update
                          defaultValue={item.location_id} // opsional hanya untuk edit atau update
                          onChange={(val) => {
                            field.onChange(val?.value);
                            setLocaltionId(val?.value ?? "");
                            setLocationPickupTime(val?.data.time_pickup_from);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-row gap-2 mt-2 mb-2">
              {/* Button remove */}
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
              {/* Button Change */}
              {/* diganti dengan edit */}
              {/* <div
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
              </div> */}
              {!isEdit ? (
                <div
                  className="flex flex-row items-center gap-2 group cursor-pointer"
                  onClick={() => {
                    setIsEdit(!isEdit);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="w-5 h-5 text-gray-500 group-hover:text-red-700"
                    size="sm"
                  />
                  <p className="text-gray-600 text-sm group-hover:text-red-700">
                    Edit
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="flex flex-row items-center gap-2 group cursor-pointer"
                    onClick={() => {
                      setIsEdit(!isEdit);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCancel}
                      className="w-5 h-5 text-gray-500 group-hover:text-red-700"
                      size="sm"
                    />
                    <p className="text-gray-600 text-sm group-hover:text-red-700">
                      Cancel
                    </p>
                  </div>
                  <div
                    className="flex flex-row items-center gap-2 group cursor-pointer"
                    onClick={async () => {
                      await saveUpdateCart();
                    }}
                  >
                    {isLoadingSave ? (
                      <Spinner />
                    ) : (
                      <FontAwesomeIcon
                        icon={faSave}
                        className="w-5 h-5 text-gray-500 group-hover:text-red-700"
                        size="sm"
                      />
                    )}

                    <p className="text-gray-600 text-sm group-hover:text-red-700">
                      Save
                    </p>
                  </div>
                </>
              )}
            </div>
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
                onChangeCart(item, checked);
              }}
              defaultChecked={true} // ✅ hanya untuk default
            />
          </div>
          <div className="w-[40%] grow p-4 text-left">
            <p className="text-black text-sm font-bold">SUB TOTAL</p>
            <p className="text-red-700 text-sm font-semibold">
              {item.currency} {item.priceori_in_format}
              {/* {item.currency_local} {item.price_local_in_format} */}
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
              {item.currency} {item.price_in_format}
              {/* {item.currency_local} {item.price_local_in_format} */}
            </p>
          </div>
        </div>
        {/* Accordion */}
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
          {/* Button Remove dan Change */}
          {/* <div className="w-[5%] py-4  text-left"></div> */}
          {/* <div className="w-[95%] p-4  flex flex-row justify-start items-center gap-3">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CardAccordion;
