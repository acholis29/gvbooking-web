"use client";
// State
import { useState, useEffect, useRef } from "react";

import Galery from "@/components/Galery";
import ProductSubNew from "@/components/ProductSubNewCard";
import { GLOBAL_VAR } from "@/lib/globalVar";
import { API_HOSTS } from "@/lib/apihost";

// Context Global
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDate } from "@/context/DateContext";
import { useInitial } from "@/context/InitialContext";
import { useProfile } from "@/context/ProfileContext";
import { useCartApi } from "@/context/CartApiContext";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBatteryEmpty,
  faCalendarAlt,
  faCalendarCheck,
  faCaretDown,
  faCircleXmark,
  faClock,
  faClockRotateLeft,
  faListCheck,
  faMinusCircle,
  faPlusCircle,
  faSearch,
  faUser,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import SkeletonDetailProduk from "@/components/SkeletonDetailProduk";
import { useSearchParams } from "next/navigation";
import { log } from "console";
import { splitUsername, toLowerCaseAll } from "@/helper/helper";
// Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "@/components/Breadcrumb";
import Spinner from "@/components/Spinner";
import SkeletonDetailProdukSub from "@/components/SkeletonDetailProdukSub";
// import SelectCustomAsynNew from "@/components/SelectCustomAsynNew";
import dynamic from "next/dynamic";
const SelectCustomAsynNew = dynamic(
  () => import("@/components/SelectCustomAsynNew"),
  {
    ssr: false,
  }
);

// Form Libraries
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useSession } from "next-auth/react";

export default function DetailDestination() {
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //ini dari idx_comp
  const idx_excursion = searchParams.get("exc"); //ini dari idx_excursion
  const country = searchParams.get("country");
  const state = searchParams.get("state");
  const transaction_id = searchParams.get("transaction_id");

  const [isDropdownPersonOpen, setDropdownPersonOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("");

  const [isDropdownProductSubOpen, setDropdownProductSubOpen] = useState(false);
  const [selectedProductSub, setSelectedProductSubOpen] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [defaultCancelText, setDefaultCanceText] = useState("");
  const [labelSelectPickup, setLabelSelectPickup] = useState<string>("");
  const [valueSelectPickup, setValueSelectPickup] = useState<string>("");
  const [pickupTimeFrom, setPickupTimeFrom] = useState<string>("");
  const [disabledCheckAvailable, setDisabledCheckAvailable] = useState(false);
  const [useLastLocation, setUseLastLocation] = useState(true);

  type ChargeTypeProps = {
    name: string;
    code: string;
    min_pax: string;
    max_pax: string;
    age_from: string;
    age_to: string;
  };
  // Allotment untuk lihat jenis pax Adult, Child, Infant
  const [dataChargeType, setDataChargeType] = useState<ChargeTypeProps[]>([]);

  // Check avaibility
  const [checkAvaibility, setCheckAvaibility] = useState(false);
  // Pickup Area
  const [pickupAreaId, setPickupAreaId] = useState("");
  // Refresh Key Untuk Load Berulang Card ProductSubNew
  const [refreshKey, setRefreshKey] = useState(0);

  // Form Validate
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pickup_area: valueSelectPickup,
      // contoh default value
    },
  });

  const onSubmit = (data: any) => {
    let last_location = {
      value: data.pickup_area,
      label: labelSelectPickup,
      pickup_time_from: pickupTimeFrom,
    };
    // save last location ke localstorage
    localStorage.setItem("last_location", JSON.stringify(last_location));
    // setCheckAvaibility(true);
    setPickupAreaId(data.pickup_area);

    // Toggle ulang pemanggilan
    setCheckAvaibility(false);

    // Force reload komponen
    setRefreshKey((prev) => prev + 1);

    setTimeout(() => {
      setCheckAvaibility(true);
    }, 50);
  };

  // Currency
  const { currency, setCurrency, masterCurrency, setMasterCurrency } =
    useCurrency();
  // Language
  const { language, setLanguage, masterLanguage, setMasterLanguage } =
    useLanguage();
  // Date Global
  const { date, setDate } = useDate();
  // Initial Global (AgentId dan RepCode)
  const {
    agent,
    setAgent,
    repCode,
    setRepCode,
    resourceInitial,
    setResourceInitial,
    profileInitial,
    setProfileInitial,
    setRepresentative,
  } = useInitial();
  // Profil
  const { profile, setProfile } = useProfile();
  // Cart API
  const { saveCartApi } = useCartApi();

  type ProductDetail = {
    excursion_name: string;
    info_location: string;
    info_category: string;
    info_duration: string;
    info_general: string;
    info_sortdesc: string;
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

  type Allotment = {
    date: string;
    date_detail: {
      year: string;
      month: string;
      month_name: string;
      day: string;
      day_name: string;
    };
    balance: string;
    type: string; // "PP"
    info: string; // e.g. "Availability: 99 Pax"
    currency: string; // "IDR"
    price_in_raw: string; // "1936000"
    price_in_format: string; // "1,936,000.00"
    status: string; // "1"
  };

  type ChargeType = {
    name: string; // "Adult", "Child", "Infant"
    code: string; // "A", "C", "I"
    min_pax: string;
    max_pax: string;
    age_from: string;
    age_to: string;
  };

  type AllotmentMsg = {
    excursion_id: string;
    sub_excursion_id: string;
    allotment_list: Allotment[];
    charge_type: ChargeType[];
  };

  type AllotmentResponse = {
    error: string;
    msg: AllotmentMsg[];
    len: {
      current_row: string;
      total_row: string;
      total_page: string;
      time: string;
    };
    id: string;
  };

  const [dataProduct, setDataProduct] = useState<ProductResponse | null>(null);
  const [dataProductSub, setDataProductSub] = useState<ProductResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProdukDetail, setIsLoadingProdukDetail] = useState(true);
  const [isLoadingProdukDetailSub, setIsLoadingProdukDetailSub] =
    useState(true);
  const [isLoadingAllotmentArr, setIsLoadingAllotmentArr] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Konversi string ke Date (atau fallback ke hari ini jika kosong)
  const initialDate = date ? new Date(date) : new Date();
  // Datepicker Local
  const disabledDates = [new Date("2025-10-28"), new Date("2025-10-29")];
  const [disabledDatesArr, setDisabledDateArr] = useState<Date[]>([]);
  const [enabledDatesArr, setEnabledDateArr] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  // open dropdown pax (adult, child, infant)
  const [openDropdownPax, setOpenDropdownPax] = useState(false);
  // open date avaibility
  const [openDateAvaibility, setOpenDateAvaibility] = useState(false);
  // set adult, child, infant
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [valDropdownPax, setValDropdownPax] = useState("Adult x 1");
  // Handle Close OnClick Out Reference
  const refPax = useRef<HTMLDivElement>(null);
  const refDate = useRef<HTMLDivElement>(null);
  const [childAges, setChildAges] = useState<string[]>([]);
  // Handle Hide Buttom Sheet Ketika sudah di target
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  // Allotment Msg Untuk Cek Allotment List
  const [allotmentResponse, setAllotmentResponse] =
    useState<AllotmentResponse | null>(null);

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

  useEffect(() => {
    if (enabledDatesArr.length > 0) {
      setSelectedDate(enabledDatesArr[0]);
    } else {
      setSelectedDate(null);
    }
  }, [enabledDatesArr]);

  // Handle initial / default last location
  useEffect(() => {
    const lastLocation = JSON.parse(
      localStorage.getItem("last_location") || "{}"
    );
    if (lastLocation.label && lastLocation.value) {
      // Check apakah ada last location di api /v2_product_pickup_list
      const CheckLocation = async () => {
        const formBody = new URLSearchParams({
          shared_key: idx_comp ?? "",
          xml: "false",
          id_excursion: idx_excursion ?? "",
          keyword: lastLocation.label,
        });

        try {
          const res = await fetch(
            `${API_HOSTS.host1}/excursion.asmx/v2_product_pickup_list`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: formBody.toString(),
            }
          );

          const json = await res.json();
          const matched = json.msg.find(
            (item: any) => item.location_id === lastLocation.value
          );

          if (matched) {
            // Jika ada set value dan label jika tidak
            setLabelSelectPickup(lastLocation.label);
            setValueSelectPickup(lastLocation.value);
            setPickupTimeFrom(lastLocation.pickup_time_from);
            reset({
              pickup_area: lastLocation.value,
            });
          } else {
            // Jika tidak sudah ada value default ""
          }
        } catch (err: any) {
          console.error(err);
        }
      };

      CheckLocation();
    }
  }, []);
  // Handle Change Currency And Close / Hide Sub excursion
  useEffect(() => {
    setCheckAvaibility(false);
  }, [currency]);

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
        setOpenDateAvaibility(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          // `${API_HOSTS.host1}/excursion.asmx/v2_product_description`,
          `${API_HOSTS.host1}/excursion.asmx/product_description`,
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
        setIsLoading(false);
        setIsLoadingProdukDetail(false);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
        setIsLoadingProdukDetail(false); // Loading Produk
      }
    };

    fetchData();
  }, [idx_excursion, idx_comp, currency, language]);

  // Produk Detail Sub
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
          `${API_HOSTS.host1}/excursion.asmx/product_sub`,
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

          setDataProductSub(json);
        }
      } catch (err: any) {
        setError(err.message || "Error");
        setIsLoading(false);
        setIsLoadingProdukDetail(false);
        setIsLoadingProdukDetailSub(false);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
        setIsLoadingProdukDetail(false); // Loading Produk
        setIsLoadingProdukDetailSub(false); // Loading Produk Sub
      }
    };
    fetchData();
  }, [idx_excursion, idx_comp, currency, language]);

  useEffect(() => {
    setSelectedDate(new Date(date));
  }, [date]);

  // Cek Initial Agent dan Repcode
  useEffect(() => {
    // Load ulang initial jika agent kosong
    const fetchDataInitial = async () => {
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
      });

      try {
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_initialize`,
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
          fetchSecondDataInitial(json.msg);
          setRepCode(json.msg.default_rep_code); //R-BC
          setDefaultCanceText(json.msg.default_cancelText); //Cancel Text
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
      }
    };

    const fetchSecondDataInitial = async (param: any) => {
      try {
        const formBody = new URLSearchParams({
          shared_key: idx_comp ?? "",
          xml: "false",
          keyword: `|${profile.email}`,
          date: date,
          code_of_language: param.default_language,
          code_of_currency: param.default_currency,
          promo_code: param.default_rep_code,
          email: profile.email ?? "",
          mobile: profile.phone ?? "",
        });

        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_product_search_initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        const json = await res.json();
        const languageList = json.msg.company_language.map((item: any) => ({
          MSLanguage: item.language_code,
        }));
        const currencyList = json.msg.company_currency.map((item: any) => ({
          Currency: item.currency_code,
        }));
        // Set dari api v2_product_search_initialize
        setMasterLanguage(languageList);
        setLanguage(param.default_language);
        setMasterCurrency(currencyList);
        let presentCurrency = localStorage.getItem("currency") ?? "";
        if (presentCurrency == "") {
          setCurrency(param.default_currency);
          localStorage.setItem("currency", param.default_currency); // simpan ke localStorage
        } else {
          const isPresentCurrency = currencyList.some(
            (item: any) => item.Currency === presentCurrency
          );
          if (isPresentCurrency) {
            setCurrency(presentCurrency);
            localStorage.setItem("currency", presentCurrency); // simpan ke localStorage
          } else {
            setCurrency(param.default_currency);
            localStorage.setItem("currency", param.default_currency); // simpan ke localStorage
          }
        }
        setAgent(json.msg.resource.agent_id);
        setResourceInitial(json.msg.resource);
        setProfileInitial(json.msg.profile);
        setRepresentative(json.msg.representative);
        localStorage.setItem("language", param.default_language); // simpan ke localStorage
        localStorage.setItem(
          "resource_initial",
          JSON.stringify(json.msg.resource)
        );
        localStorage.setItem(
          "profile_initial",
          JSON.stringify(json.msg.profile)
        );
        localStorage.setItem(
          "representative",
          JSON.stringify(json.msg.representative)
        );
        saveCartApi(json.msg.cart_item);

        // proses hasil dari fetch kedua di sini
      } catch (err: any) {
        console.error("Fetch kedua error:", err);
      }
    };

    if (date != "") {
      fetchDataInitial();
    }
  }, [date, profile]);

  // Last search
  useEffect(() => {
    if (!idx_excursion) return;

    // Ambil data lama
    let stored: string[] = JSON.parse(
      localStorage.getItem("last-search") || "[]"
    );

    // Hapus dulu kalau sudah ada (biar nggak dobel)
    stored = stored.filter((item) => item !== idx_excursion);

    // Masukkan di posisi paling depan
    stored.unshift(idx_excursion);

    // Batasi maksimal 5 item
    if (stored.length > 5) {
      stored = stored.slice(0, 5);
    }

    // Simpan lagi
    localStorage.setItem("last-search", JSON.stringify(stored));
  }, [idx_excursion]);

  // Product Allotment Untuk Cek Pax Tersedia
  useEffect(() => {
    const subs = dataProductSub?.msg?.product_subs ?? [];
    if (subs.length > 0) {
      const fetchDataAllotment = async () => {
        setIsLoading(true); // mulai loading
        const formBody = new URLSearchParams({
          shared_key: idx_comp || "", // ← ambil dari props // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
          xml: "false",
          id_excursion: idx_excursion || "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
          id_excursion_sub:
            dataProductSub?.msg?.product_subs[0].sub_excursion_id ?? "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
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
    }
  }, [dataProductSub]);

  useEffect(() => {
    // Pastikan dataProductSub sudah tersedia sebelum fetch
    if (!dataProductSub?.msg?.product_subs?.length) return;

    const subExcursionIds =
      dataProductSub?.msg?.product_subs
        ?.map((item) => item.sub_excursion_id)
        .join(",") ?? "";

    const fetchDataAllotment = async () => {
      setIsLoading(true); // mulai loading
      const formBody = new URLSearchParams({
        shared_key: idx_comp || "", // ← ambil dari props // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
        id_excursion: idx_excursion || "", // Examp : "03208A45-4A41-4E1B-A597-20525C090E52"
        id_excursion_sub: subExcursionIds, // Examp : "03208A45-4A41-4E1B-A597-20525C090E52,03208A45-4A41-4E1B-A597-20525C090E52 "
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
          setAllotmentResponse(json);
          joinDateAllotmentForDisabled(json);
          joinDateAllotmentForUndisabled(json);
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // selesai loading
      }
    };

    fetchDataAllotment();
  }, [dataProductSub]);

  function joinDateAllotmentForDisabled(data: AllotmentResponse) {
    setIsLoadingAllotmentArr(true);
    // Fungsi untuk mengabungkan semua allotment date yang false
    const allDates = data.msg.flatMap((item) =>
      item.allotment_list.filter((a) => a.status === "0").map((a) => a.date)
    );

    // Hapus duplikat dan ubah ke Date object
    const uniqueDates = [...new Set(allDates)].map((d) => new Date(d));
    setDisabledDateArr(uniqueDates);
    setIsLoadingAllotmentArr(false);
    return uniqueDates;
  }

  function joinDateAllotmentForUndisabled(data: AllotmentResponse) {
    setIsLoadingAllotmentArr(true);
    // Fungsi untuk mengabungkan semua allotment date yang false
    const allDates = data.msg.flatMap((item) =>
      item.allotment_list.filter((a) => a.status === "1").map((a) => a.date)
    );

    // Hapus duplikat dan ubah ke Date object
    const uniqueDates = [...new Set(allDates)].map((d) => new Date(d));
    setEnabledDateArr(uniqueDates);
    setIsLoadingAllotmentArr(false);
    return uniqueDates;
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // initial
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const maximum_pax =
    dataProduct != null && dataProduct.msg.product_subs.length > 0
      ? parseInt(dataProduct.msg.product_subs[0].maximum_pax)
      : 1;

  // Handle Hidden Bottom Sheet
  useEffect(() => {
    const target = document.getElementById("availability-section");
    if (!target) return;

    const handleScroll = () => {
      const rect = target.getBoundingClientRect();

      // Cek apakah elemen sudah muncul atau sudah lewat layar
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Elemen sedang terlihat di layar
        setIsSectionVisible(true);
      } else if (rect.top < 0) {
        // Elemen sudah lewat (di atas viewport)
        setIsSectionVisible(true);
      } else {
        // Elemen masih di bawah viewport → tampilkan tombol
        setIsSectionVisible(false);
      }
    };

    // Jalankan sekali saat pertama kali render
    handleScroll();

    // Pasang listener scroll
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Login with Google
  const { data: session, status } = useSession();
  // Handle Profile Data
  useEffect(() => {
    const handleOAuth = async () => {
      if (status == "authenticated") {
        const email = session.user?.email ?? "";
        const [firstname, lastname] = splitUsername(
          session.user?.name ?? ""
        ) ?? ["-", "-"];

        const ProfilPay = {
          email,
          firstname,
          lastname,
          phone: "",
          temp: "false",
        };
        setProfile(ProfilPay);
        // 🔹 Simpan ke localStorage
        localStorage.setItem("profilePay", JSON.stringify(ProfilPay));
        localStorage.setItem("profileData", JSON.stringify(ProfilPay));
      }
    };

    handleOAuth();
  }, [session]);

  // ✅ Hitung validProductSubs di luar return JSX
  const validProductSubs =
    dataProductSub?.msg?.product_subs.filter((item) => {
      const matchedAllotment = allotmentResponse?.msg?.find(
        (a) => a.sub_excursion_id === item.sub_excursion_id
      );
      const matchAllotmentDate = matchedAllotment?.allotment_list.find(
        (b) => b.date === date && b.status === "1"
      );
      return !!matchAllotmentDate;
    }) ?? [];

  const validProductSubsCount = validProductSubs.length;

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4">
        <Breadcrumb
          pageName="Activity"
          country={country || ""}
          state={state || ""}
          idx_comp={idx_comp || ""}
        />
        {/* Baris Title */}
        {!isLoadingProdukDetail ? (
          <>
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
                <h3 className="text-sm md:text-lg font-semibold md:font-bold text-left">
                  {/*DESC : Beraban, Kediri, Kabupaten Tabanan, Bali */}
                  {dataProduct != null
                    ? dataProduct.msg.product_details[0].info_location
                    : ""}
                </h3>
              </div>
              <div className="text-gray-700 w-1/2">
                <h3 className="text-sm md:text-lg font-semibold md:font-bold text-right text-red-500"></h3>
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
          </>
        ) : (
          <SkeletonDetailProduk />
        )}

        {/* Baris Content */}
        <div className="flex flex-col md:flex-row pb-5 gap-5 mt-5">
          <div className="order-2 md:order-1 w-full md:flex-[5] text-gray-600">
            {/* Short Description */}
            <p className="font-normal text-md text-justify">
              {dataProduct != null &&
              dataProduct.msg.product_details[0].info_sortdesc != null
                ? dataProduct.msg.product_details[0].info_sortdesc.replace(
                    /<[^>]*>/g,
                    ""
                  )
                : ""}
            </p>
            {/* About Activity */}
            <p className="font-bold text-lg mt-3">About this activity</p>
            <div className="w-full flex flex-row gap-5 mt-5">
              {/* Kiri */}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-row w-full mb-5">
                  <div className="mr-2">
                    <FontAwesomeIcon
                      icon={faCalendarCheck}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-md">Free cancellation</p>
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: defaultCancelText ?? "",
                      }}
                    ></p>
                  </div>
                </div>

                <div className="flex flex-row w-full mb-5">
                  <div className="mr-2">
                    <FontAwesomeIcon
                      icon={faClockRotateLeft}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-md">
                      Duration{" "}
                      {dataProduct != null
                        ? dataProduct.msg.product_details[0].info_duration
                        : ""}
                    </p>
                    <p className="text-sm">
                      Check availability to see starting times
                    </p>
                  </div>
                </div>

                <div className="flex flex-row w-full mb-5">
                  <div className="mr-2">
                    <FontAwesomeIcon
                      icon={faUserCheck}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-md">Live tour guide</p>
                    <p className="text-sm">English</p>
                  </div>
                </div>

                <div className="flex flex-row w-full mb-5">
                  <div className="mr-2">
                    <FontAwesomeIcon
                      icon={faListCheck}
                      className="w-10 h-10 text-gray-500"
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-md">Facilities</p>
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html:
                          dataProduct != null &&
                          dataProduct.msg.product_details[0].info_facilities
                            ? dataProduct.msg.product_details[0].info_facilities
                            : "-",
                      }}
                    ></p>
                  </div>
                </div>
              </div>

              {/* Kanan */}
              <div className="w-1/3 hidden md:block">
                <div className="bg-gray-200 shadow-lg rounded-lg p-5">
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">From</p>
                      {/* <p className="font-bold text-lg">EUR 180.000</p> */}
                      {isLoadingProdukDetailSub && (
                        <div className="flex flex-row items-center">
                          <Spinner />{" "}
                          <p className="text-xs animate-pulse">Please wait</p>
                        </div>
                      )}
                      <p className="font-bold text-lg">
                        {dataProductSub?.msg.product_subs[0].currency ?? ""}{" "}
                        {dataProductSub?.msg.product_subs[0].price ?? ""}
                      </p>
                      <p className="text-sm">per person</p>
                    </div>
                    <div className="flex flex-col">
                      {isLoadingProdukDetailSub ? (
                        <div className="w-60 h-10 bg-gray-300 text-white font-bold rounded-2xl px-4 py-2 animate-pulse" />
                      ) : (
                        <button
                          className="w-60 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl px-4 py-2 cursor-pointer"
                          onClick={() => {
                            const target = document.getElementById(
                              "availability-section"
                            );

                            if (target) {
                              // Scroll ke tengah layar dengan efek halus
                              target.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                                inline: "nearest",
                              });

                              // Efek highlight sementara
                              target.classList.add("ring-2", "ring-gray-500");
                              setTimeout(() => {
                                target.classList.remove(
                                  "ring-2",
                                  "ring-gray-500"
                                );
                              }, 1500);
                            }
                          }}
                        >
                          Check Avaibility
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex flex-row mt-2">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="w-4 h-4 text-gray-500 mr-1"
                      size="sm"
                    />
                    <p className="text-xs">
                      Reserve now & pay later to book your spot and pay nothing
                      today.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Judul Deskripsi  */}
            <p className="font-bold text-lg mt-5">
              {/* The Legendary Charm of Tanah Lot Temple: Bali's Eternal Wonder */}
              {dataProduct != null
                ? dataProduct.msg.product_details[0].excursion_name
                : ""}{" "}
              {dataProduct != null
                ? dataProduct.msg.product_details[0].info_location
                : ""}{" "}
              {dataProduct != null
                ? dataProduct.msg.product_details[0].info_category
                : ""}
            </p>
            {/* Deskripsi  */}
            <div
              className="prose max-w-none text-justify text-sm text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  dataProduct != null
                    ? dataProduct.msg.product_details[0].info_general
                    : "",
              }}
            />

            {/* Card Check Available */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="w-full md:h-40 bg-gray-300 rounded-2xl mt-5 p-8"
                id="availability-section"
              >
                <p className="text-sm md:text-lg font-semibold">
                  Select participants, date, and pickup area
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between mt-5">
                  {/* Kiri: input-input */}
                  <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                    {/* Pax Adult, Child, Infant */}
                    <div className="relative" ref={refPax}>
                      {/* Trigger */}
                      <div
                        className="h-10 w-70 px-3 flex flex-row justify-between items-center bg-white rounded-xl cursor-pointer"
                        onClick={() => setOpenDropdownPax(!openDropdownPax)}
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="w-4 h-4 text-gray-500 mr-2"
                            size="lg"
                          />
                          <p className="text-sm font-bold">
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
                                    <p className="w-10 font-semibold">Adult</p>
                                    <FontAwesomeIcon
                                      icon={faMinusCircle}
                                      className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
                                        openDropdownPax ? "rotate-180" : ""
                                      }`}
                                      size="lg"
                                      onClick={() => {
                                        if (adultCount > 0) {
                                          setAdultCount(adultCount - 1);
                                          setCheckAvaibility(false);
                                        }
                                      }}
                                    />
                                    <p className="w-5 text-center">
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
                                        setCheckAvaibility(false);
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
                                      <p className="w-10 font-semibold">
                                        Child
                                      </p>
                                      <FontAwesomeIcon
                                        icon={faMinusCircle}
                                        className="w-4 h-4 text-red-400"
                                        onClick={() => {
                                          childCount > 0 &&
                                            setChildCount(childCount - 1);
                                          setCheckAvaibility(false);
                                        }}
                                      />
                                      <p className="w-5 text-center">
                                        {childCount}
                                      </p>
                                      <FontAwesomeIcon
                                        icon={faPlusCircle}
                                        className="w-4 h-4 text-red-400"
                                        onClick={() => {
                                          setChildCount(childCount + 1);
                                          setCheckAvaibility(false);
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
                                              className="w-16 px-2 py-1 border rounded-md text-sm"
                                              value={childAges[i] || "12"}
                                              onChange={(e) =>
                                                handleAgeChange(
                                                  i,
                                                  e.target.value
                                                )
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
                                    <p className="w-10 font-semibold">Infant</p>
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
                                        setCheckAvaibility(false);
                                      }}
                                    />
                                    <p className="w-5 text-center">
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
                                        setCheckAvaibility(false);
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

                    {/* Select Date */}
                    <div
                      className="relative h-10 md:w-50 flex flex-row items-center bg-white rounded-xl cursor-pointer"
                      ref={refDate}
                    >
                      <div
                        className="h-10 w-full md:w-50 px-3 flex flex-row justify-between items-center bg-white rounded-xl cursor-pointer"
                        onClick={() => {
                          setOpenDateAvaibility(!openDateAvaibility);
                        }}
                      >
                        {/* Kiri: Icon Kalender + Tanggal */}
                        <div className="flex flex-row items-center">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="w-4 h-4 text-gray-500 mr-2"
                            size="lg"
                          />
                          <p className="text-sm font-bold">
                            {selectedDate
                              ? selectedDate.toLocaleDateString("en-GB") // format: dd/mm/yyyy
                              : "Select Date"}
                          </p>
                        </div>

                        {/* Kanan: Icon Panah */}
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                            openDateAvaibility ? "rotate-180" : ""
                          }`}
                          size="lg"
                        />
                      </div>

                      {/* Popup Kalender */}
                      {openDateAvaibility && (
                        <div className="absolute top-full mt-2 right-0 z-10 bg-white shadow-lg rounded">
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                              setSelectedDate(date);
                              if (date) {
                                const formatted = date
                                  .toISOString()
                                  .split("T")[0];
                                setDate(formatted);
                                localStorage.setItem("booking_date", formatted);
                              }
                              setCheckAvaibility(false);
                              // Langsung Tutup Calendar
                              setOpenDateAvaibility(false);
                            }}
                            // excludeDates={disabledDatesArr} //Disabled date
                            includeDates={enabledDatesArr} //Disabled date
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

                    {/* Find Pickup */}
                    <div className="h-10 w-70 flex flex-row justify-around items-center">
                      <Controller //validasi
                        name="pickup_area"
                        control={control}
                        rules={{ required: "pickup area is required!" }}
                        render={({ field, fieldState }) => (
                          <SelectCustomAsynNew
                            idx_comp={idx_comp ?? ""}
                            id_excursion={idx_excursion ?? ""}
                            placeholder="Find Pickup Area ..."
                            value={field.value}
                            // defaultLabel={"THE SAMAYA SEMINYAK - BALI"}
                            // defaultValue={
                            //   "0075E95D-FFD0-4732-AF25-AF27DF697DE9"
                            // }
                            defaultLabel={
                              useLastLocation ? labelSelectPickup : undefined
                            }
                            defaultValue={
                              useLastLocation ? valueSelectPickup : undefined
                            }
                            onChange={(val) => {
                              if (!val) {
                                // CLEAR
                                setUseLastLocation(false);
                                field.onChange(null);
                                setLabelSelectPickup("");
                                return;
                              }

                              field.onChange(val?.value);
                              setLabelSelectPickup(val?.label ?? "");
                              setPickupTimeFrom(val?.data.time_pickup_from);
                              setCheckAvaibility(false);

                              // Jika value == N/A atau Pickup Unvailable
                              // Maka Disable Button Check Available
                              if (val?.value == "NA") {
                                // Disable button check available
                                setDisabledCheckAvailable(true);
                              } else {
                                setDisabledCheckAvailable(false);
                              }
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Kanan: button */}
                  <div className="p-2 md:ml-20 w-full">
                    {dataChargeType.length > 0 && !isLoadingAllotmentArr ? (
                      <button
                        type="submit"
                        disabled={disabledCheckAvailable}
                        className={`w-full md:w-60 text-white font-bold rounded-2xl mt-4 md:mt-0 px-4 py-2
                      ${
                        disabledCheckAvailable
                          ? "bg-gray-400 cursor-not-allowed opacity-60"
                          : "bg-red-600 hover:bg-red-700 cursor-pointer"
                      }`}
                      >
                        Check Availability
                      </button>
                    ) : (
                      <div className="w-full h-10 bg-gray-400 text-white font-bold rounded-2xl px-4 py-2 text-center animate-pulse">
                        <p className="text-white">Please Wait ...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {checkAvaibility && (
              <p className="text-md font-semibold mt-5">
                Choose from {validProductSubsCount} available option
              </p>
            )}

            {checkAvaibility && validProductSubsCount == 0 && (
              <p className="text-md font-semibold mt-5 text-center">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    openDateAvaibility ? "rotate-180" : ""
                  }`}
                  size="lg"
                />{" "}
                SORRY, NOT AVAILABLE !
              </p>
            )}

            {/* Card Sub Excursion dan Surcharge*/}
            {checkAvaibility &&
              dataProductSub?.msg.product_subs.map((item, index) => {
                // Cek apakah allotmentList sudah ada
                const matchedAllotment = allotmentResponse?.msg?.find(
                  (a) => a.sub_excursion_id === item.sub_excursion_id
                );

                if (matchedAllotment == undefined) {
                  return null;
                } else {
                  const matchAllotmentDate =
                    matchedAllotment.allotment_list.find(
                      (b) => b.date === date && b.status === "1"
                    );
                  if (matchAllotmentDate == undefined) {
                    return null;
                  } else {
                    return (
                      <ProductSubNew
                        // key={index}
                        key={`${index}-${refreshKey}`}
                        dataSub={item}
                        pickupArea={labelSelectPickup}
                        pickupArea_id={pickupAreaId}
                        pickup_time_from={pickupTimeFrom}
                        idx_comp={idx_comp ?? ""}
                        date_booking={date}
                        total_pax_adult={adultCount.toString()}
                        total_pax_child={childCount.toString()}
                        arr_ages_child={childAges}
                        total_pax_infant={infantCount.toString()}
                      />
                    );
                  }
                }
              })}
          </div>
        </div>

        {isMobile && !isSectionVisible && (
          <div className="md:w-[50%] h-auto fixed bottom-0 left-0 w-full z-50 shadow">
            <div className="max-w-xl p-6 bg-gray-300 border border-gray-200 rounded-lg shadow-sm ">
              <div className="flex flex-row gap-1 justify-between mb-2 items-center">
                <div className="flex flex-col flex-1">
                  <p className="text-gray-700 tex-xs">From</p>
                  {isLoadingProdukDetailSub && (
                    <div className="flex flex-row items-center">
                      <Spinner />{" "}
                      <p className="text-xs animate-pulse text-gray-700">
                        Please wait
                      </p>
                    </div>
                  )}
                  <p className="text-gray-700">
                    <span className="font-semibold text-lg">
                      {dataProductSub?.msg.product_subs[0].currency ?? ""}{" "}
                      {dataProductSub?.msg.product_subs[0].price ?? ""}{" "}
                    </span>{" "}
                  </p>
                  <p className="text-xs text-gray-700">per person</p>
                </div>
                <div className="flex flex-col flex-2">
                  {isLoadingProdukDetailSub ? (
                    <div className="w-full h-10 bg-gray-400 focus:ring-4 font-bold rounded-3xl text-sm text-center px-5 py-2.5 me-2 mb-2 animate-pulse">
                      <p className="text-white">Please Wait ...</p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-3xl text-sm px-5 py-2.5 me-2 mb-2"
                      onClick={() => {
                        const target = document.getElementById(
                          "availability-section"
                        );

                        if (target) {
                          // Scroll ke tengah layar dengan efek halus
                          target.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                            inline: "nearest",
                          });

                          // Efek highlight sementara
                          target.classList.add("ring-2", "ring-gray-500");
                          setTimeout(() => {
                            target.classList.remove("ring-2", "ring-gray-500");
                          }, 1500);
                        }
                      }}
                    >
                      Check Avaibility
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
