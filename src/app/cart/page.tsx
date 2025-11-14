"use client";
// Hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Library
import { signIn, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faFacebook,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import {
  faChevronDown,
  faChevronUp,
  faMoneyBill,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

// Form Libraries
import { useForm, Controller, useFieldArray } from "react-hook-form";
// component
import Breadcrumb from "@/components/Breadcrumb";
import CardAccordion from "@/components/CardAccordion";
import Spinner from "@/components/Spinner";
// Context global
import { useCartApi } from "@/context/CartApiContext";
import { useInitial } from "@/context/InitialContext";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
// Helper
import {
  capitalizeWords,
  truncateText,
  formatRibuanInternational,
  splitUsername,
} from "@/helper/helper";
import { useModal } from "@/context/ModalContext";
import ModalComponent from "@/components/ModalComponent";
import { useSelectModal } from "@/context/SelectModalContext";
import { API_HOSTS } from "@/lib/apihost";
import { Toast } from "flowbite-react";
import { finished } from "stream";

// Type Property
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

type varPayment = {
  apikey: string;
  apikeysec: string;
  domain: string;
  min_daypayontour: number;
  payment_3ds: string;
  payment_site: string;
  payontour: string;
  provider: string;
  sts: string;
};

type varOnepayParam = {
  virtualPaymentClientURL: string;
  SECURE_SECRET: string;
  vpc_Merchant: string;
  vpc_AccessCode: string;
  vpc_Currency: string;
};

type CoreV2Item = {
  app_name: string;
  country: string;
  countryCode: string;
  def_curr: string;
  idx_comp: string;
  idx_comp_alias: string;
  intl: string;
  min_daypayontour: number;
  name: string;
  payontour: boolean;
  phone_code: string;
  status: boolean;
  url_img: string;
  url_img_team: string;
};

type IpLocation = {
  status: string; // contoh: "success"
  country: string; // contoh: "Indonesia"
  countryCode: string; // contoh: "ID"
  region: string; // contoh: "JK"
  regionName: string; // contoh: "Jakarta"
  city: string; // contoh: "Jakarta"
  zip: string; // contoh: ""
  lat: string; // contoh: -6.23366
  lon: string; // contoh: 106.832
  timezone: string; // contoh: "Asia/Jakarta"
  isp: string; // contoh: "Neuviz"
  org: string; // contoh: ""
  as: string; // contoh: "AS18103 Neuviz Net"
  query: string; // contoh: "203.128.80.46"
};

export default function Cart() {
  const router = useRouter(); // ✅ ini sekarang valid
  // State Data Detail Destination
  const [ListCart, setCart] = useState<CartApiItem[]>([]);
  const [ChekedCart, setCheckedCart] = useState<CartApiItem[]>([]);
  const [corev2, setCorev2] = useState<CoreV2Item[]>([]);
  const [IpLocation, setIpLocation] = useState<IpLocation>({
    status: "", // contoh: "success"
    country: "", // contoh: "Indonesia"
    countryCode: "", // contoh: "ID"
    region: "", // contoh: "JK"
    regionName: "", // contoh: "Jakarta"
    city: "", // contoh: "Jakarta"
    zip: "", // contoh: ""
    lat: "", // contoh: -6.23366
    lon: "", // contoh: 106.832
    timezone: "", // contoh: "Asia/Jakarta"
    isp: "", // contoh: "Neuviz"
    org: "", // contoh: ""
    as: "", // contoh: "AS18103 Neuviz Net"
    query: "", // contoh: "203.128.80.46"
  });
  const { language } = useLanguage();
  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPromoCode, setIsLoadingPromoCode] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [isOpenAccordion, setAccordion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtotalSummeryOrder, setSubtotalSummeryOrder] = useState(0);
  const [discTotalSummerOrder, setDiscTotalSummerOrder] = useState(0);
  const [subtotalSummeryOrderLocal, setSubtotalSummeryOrderLocal] = useState(0);
  const [paymentHtml, setPaymentHtml] = useState<string>("");
  const [confPayment, setPayment] = useState<varPayment>({
    apikey: "",
    apikeysec: "",
    domain: "",
    min_daypayontour: 0,
    payment_3ds: "",
    payment_site: "",
    payontour: "",
    provider: "",
    sts: "",
  });
  // Check Thailand dicart
  const [isThailand, setIsThailand] = useState(false);

  const [onepayParam, setOnepayParam] = useState<varOnepayParam>({
    virtualPaymentClientURL: "",
    SECURE_SECRET: "",
    vpc_Merchant: "",
    vpc_AccessCode: "",
    vpc_Currency: "",
  });

  const [buyCurrencyMF, setBuyCurrencyMF] = useState("");
  const [locaCurrencyMF, setLocalCurrencyMF] = useState("");
  // const [idxCompCart, setIdxCompCart] = useState("");

  // Context global
  const { profileInitial, setProfileInitial, resourceInitial, coreInitial } =
    useInitial();
  const { profile } = useProfile();
  const { cartApiItems, idxCompCart, setIdxCompCart, saveCartApi } =
    useCartApi();
  const { openModal } = useModal();
  const { selectModal, setSelectModal } = useSelectModal();

  resourceInitial.app_string = "newweb";

  type FormData = {
    promoCode: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await addPromoCode(data.promoCode);
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart_api") || "[]");
    if (cart.length > 0) {
      setIdxCompCart(cart[0].company_id);
    }
  }, []);

  useEffect(() => {
    if (idxCompCart != "") {
      fetch(`/mobile/data/${idxCompCart}.json`, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          setPayment(data.payment); // ✅ langsung set array-nya
          if (data.onepay_param != null) {
            setOnepayParam(data.onepay_param);
          }
        })
        .catch((err) => console.error(err));
    }

    loadCart();
  }, [cartApiItems, idxCompCart]);

  useEffect(() => {
    fetch(`${API_HOSTS.host1}/mobile/corev2.json`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setCorev2(data); // ✅ langsung set array-nya
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`/api/proxy/iplocation`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setIpLocation(data); // ✅ langsung set array-nya
      })
      .catch((err) => console.error(err));
  }, []);

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart_api") || "[]");
    setCart(cart);
    setIsLoading(false);
    if (cart.length > 0) {
      setIdxCompCart(cart[0].company_id);
    }
  }

  async function handleOnChangeCard(item: CartApiItem, checked: boolean) {
    if (checked) {
      // Tambahkan jika belum ada
      setCheckedCart((prev) => {
        // Hindari duplikat
        if (!prev.find((i) => i.transaction_id === item.transaction_id)) {
          return [...prev, item];
        }
        return prev;
      });
    } else {
      // Hapus dari CheckedCart
      setCheckedCart((prev) =>
        prev.filter((i) => i.transaction_id !== item.transaction_id)
      );
    }
  }

  async function handleOnRemoveCard(item: CartApiItem) {
    setIsRemove(true);
    await handleOnChangeCard(item, false);
    setIsRemove(false);
    // Hapus Dari List Dan ChekedList
  }

  function hitungSubtotalSummeryOrder(items: CartApiItem[]) {
    let subTotal = 0;
    let discTotal = 0;
    let subTotalLocal = 0;
    items.map((item, index) => {
      subTotal += parseFloat(item.priceori);
      discTotal += parseFloat(item.disc);
      subTotalLocal += parseFloat(item.price_local);
      if (index == 0) {
        setLocalCurrencyMF(item.currency_local);
        setBuyCurrencyMF(item.currency);
      }
    });
    setSubtotalSummeryOrder(subTotal);
    setDiscTotalSummerOrder(discTotal);
    setSubtotalSummeryOrderLocal(subTotalLocal);
  }

  // function Update Email API
  async function updateEmail(email: string) {
    try {
      const formBody = new URLSearchParams({
        shared_key: idxCompCart, // Indo Or Others
        xml: "false",
        id_master_file: profileInitial[0].idx_mf,
        email: email,
      });

      let url = `${API_HOSTS.host1}/excursion.asmx/v2_updateemail`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error("update email failed");

      // Response Html
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function addPromoCode(promoCode: string) {
    try {
      setIsLoadingPromoCode(true);
      const formBody = new URLSearchParams({
        shared_key: idxCompCart, // Indo Or Others
        xml: "false",
        voucher: promoCode,
        email: profileInitial[0].email,
        id_master_file: profileInitial[0].idx_mf,
        language_code: language,
        id_transaction: "",
      });

      let url = `${API_HOSTS.host1}/excursion.asmx/v2_card_promo`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error("add promo code failed");

      // Response Html
      const data = await response.json();
      // Update Cart
      saveCartApi(data.msg);
      toast.success("Promo Code Success");
    } catch (error) {
      console.error(error);
      setIsLoadingPromoCode(false);
    } finally {
      setIsLoadingPromoCode(false);
    }
  }

  // Untuk Validasi payment dengan google atau guest
  async function validationAccountPayment() {
    if (localStorage.length == 0) {
      toast.error("Checkout Error, Please Try Again From Country!");
      router.push("/");
      return null;
    }

    // harus ada cart yang di centang
    if (subtotalSummeryOrderLocal == 0) {
      toast.error(
        "You cannot checkout if you have not selected at least one item in the cart!"
      );
      return null;
    }

    if (subtotalSummeryOrderLocal < 0) {
      toast.error("Checkout is not allowed when the total is below zero!");
      return null;
    }

    // check auth google
    if (status != "authenticated") {
      setSelectModal("ProfilAsGuest");
      openModal();
      return null;
    } else {
      // Kalo sudah login google
      // Inisialisasi profilepay dari session google
      sessionStorage.setItem("oauth", "true");
      let email = session.user?.email ?? "";
      let firstname = splitUsername(session.user?.name ?? "")[0] ?? "-";
      let lastname = splitUsername(session.user?.name ?? "")[1] ?? "-";

      let ProfilPay = {
        email: email,
        firstname: firstname,
        lastname: lastname,
        phone: "",
        temp: "false",
      };

      // Update Email di Profile Initial API
      await updateEmail(email);
      // SET PROFIL PAY
      localStorage.setItem("profilePay", JSON.stringify(ProfilPay));
      localStorage.setItem("profileData", JSON.stringify(ProfilPay));
      // Ubah Profile Initial
      const savedProfileInitial = localStorage.getItem("profile_initial");
      if (savedProfileInitial) {
        const parsedData = JSON.parse(savedProfileInitial);

        // ambil data lama dan ubah email-nya
        const updatedProfile = [
          {
            ...parsedData[0], // ambil data lama dari localStorage
            email: email, // ganti email dengan email baru
          },
        ];

        // simpan ke state
        setProfileInitial(updatedProfile);

        // simpan kembali ke localStorage
        localStorage.setItem("profile_initial", JSON.stringify(updatedProfile));
      }
      await submitPayment2();
    }
  }

  async function submitPayment2() {
    // Cegah Submit Berulang
    if (isSubmitting) {
      toast("Please wait...", {
        icon: "⏳", // hourglass
      });
      return null;
    }

    // Cegah Remove Cart Disaat Submit
    if (isRemove) {
      toast.success("Please Wait Remove Finished!");
      toast("Please Wait Remove Finished!...", {
        icon: "⏳", // hourglass
      });
      return null;
    }

    const companyId = ListCart[0].company_id;
    const result = corev2.find((item) => item.idx_comp === companyId);
    setIsSubmitting(true);
    // Checout
    await checkout();
    if (result?.payontour == false) {
      // Payontour
      if (confPayment.provider == "") {
        await payontour();
      } else {
        // Payment gateway
        await paymentGateway();
      }
    }
  }

  async function submitPayment() {
    const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
    const profilePay = JSON.parse(localStorage.getItem("profilePay") || "{}");

    if (subtotalSummeryOrderLocal == 0) {
      toast.error(
        "You cannot checkout if you have not selected at least one item in the cart!"
      );
      return null;
    }

    //cek auth google
    if (status != "authenticated") {
      setSelectModal("ProfilAsGuest");
      openModal();
      return null;
    } else {
      // Inisialisasi profilpay
      let email = session.user?.email ?? "";
      let firstname = splitUsername(session.user?.name ?? "")[0] ?? "-";
      let lastname = splitUsername(session.user?.name ?? "")[1] ?? "-";

      let ProfilPay = {
        email: email,
        firstname: firstname,
        lastname: lastname,
        phone: "000000",
        temp: "false",
      };
      // SET PROFIL PAY
      localStorage.setItem("profilePay", JSON.stringify(ProfilPay));

      let UpdateProfile = {
        email: profileData.email,
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        phone: profileData.phone ?? "000000",
        temp: "false",
      };

      // SET / UPDATE PROFIL DATA
      localStorage.setItem("profileData", JSON.stringify(UpdateProfile));
    }

    if (isSubmitting) {
      toast("Please wait...", {
        icon: "⏳", // hourglass
      });
      return null;
    }

    if (isRemove) {
      toast.success("Please Wait Remove Finished!");
      toast("Please Wait Remove Finished!...", {
        icon: "⏳", // hourglass
      });
      return null;
    }

    const companyId = ListCart[0].company_id;
    const result = corev2.find((item) => item.idx_comp === companyId);
    setIsSubmitting(true);
    // Checout
    await checkout();
    if (result?.payontour == false) {
      // Payontour
      if (confPayment.provider == "") {
        await payontour();
      } else {
        // Payment gateway
        await paymentGateway();
      }
    }
  }

  async function paymentGateway() {
    try {
      let profile_pay = JSON.parse(
        localStorage.getItem("profilePay") || JSON.stringify(profile)
      );

      let grandtotal = subtotalSummeryOrderLocal; //idr
      const formBody = new URLSearchParams({
        idx_comp: idxCompCart ?? "",
        intl: resourceInitial.company_code ?? "", // contoh intl
        pay_provider: confPayment.provider ?? "", // contoh docu, xendit, onepay
        // NAME: `${profile.firstname} ${profile.lastname}`,
        NAME: `${profile_pay.firstname} ${profile_pay.lastname}`,
        // FIRST_NAME: profile.firstname,
        FIRST_NAME: profile_pay.firstname,
        // LAST_NAME: profile.lastname,
        LAST_NAME: profile_pay.lastname,
        // EMAIL: profileInitial[0].email,
        EMAIL: profile_pay.email,
        PASSPORT: "",
        // MOBILEPHONE: profile.phone,
        MOBILEPHONE: profile_pay.phone,
        ln: language,
        vpc_TicketNo: IpLocation.query, // 203.128.80.46
        backurl: window.location.origin,
      });
      if (confPayment.provider == "onepay") {
        // append semua key-value onepay_param
        Object.entries(onepayParam).forEach(([key, value]) => {
          formBody.append(key, value);
        });
      } else if (confPayment.provider == "xendit") {
        formBody.append("pay_apikey", confPayment.apikey);
        formBody.append("pay_3ds", confPayment.payment_3ds);
      }

      // Cek Excursion atau Hotel
      let jenis = "exc";
      if (jenis == "exc") {
        formBody.append("IDMF", profileInitial[0].idx_mf);
        formBody.append("VOUCHER", profileInitial[0].voucher);
        formBody.append("AMOUNT", grandtotal.toString());
        formBody.append(
          "forurl",
          resourceInitial.url_b2c
            .replace(/(^\w+:|^)\/\//, "")
            .replace(/\/$/, "")
        );
        formBody.append("stsapp", resourceInitial.app_string);
        formBody.append("statusapp", resourceInitial.app_demo);
      } else if (jenis == "htl") {
        formBody.append("IDMF", profileInitial[0].idx_mf);
        formBody.append("VOUCHER", "HOTEL");
        formBody.append("AMOUNT", grandtotal.toString());
        formBody.append(
          "forurl",
          resourceInitial.url_bo.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "")
        );
        formBody.append("stsapp", resourceInitial.app_string);
        formBody.append("statusapp", resourceInitial.app_demo);
      }

      // "https://internetpaygate.com/mIPGDetail.aspx"
      const response = await fetch(resourceInitial.url_payment, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error("Payment failed");
      // Response Html
      const html = await response.text();
      if (
        confPayment.provider == "onepay" ||
        confPayment.provider == "Sathapana" ||
        confPayment.provider == "kpayment"
      ) {
        // OPEN NEW WINDOW / NEW TAB
        // const newWindow = window.open("", "");
        // if (newWindow && newWindow.document) {
        //   newWindow.document.open();
        //   newWindow.document.write(html);
        //   newWindow.document.close();
        // } else {
        //   toast.error("Gagal membuka jendela baru. Mungkin diblokir browser.");
        //   console.error(
        //     "Gagal membuka jendela baru. Mungkin diblokir browser."
        //   );
        // }

        // REPLACE HALAMAN DENGAN HTML PAYMENT
        document.open();
        document.write(html);
        document.close();
        // Set oauth localstorage
        sessionStorage.setItem("oauth", "false");
      } else {
        // Render Modal Iframe
        // Simpan HTML di state untuk ditampilkan di iframe
        setPaymentHtml(html);
        setSelectModal("payment");
        openModal();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment . Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function payontour() {
    try {
      let grandtotal = subtotalSummeryOrder - discTotalSummerOrder;
      const formBody = new URLSearchParams({
        intl: resourceInitial.company_code ?? "", // contoh intl
        pay_provider: confPayment.provider ?? "", // contoh docu, xendit, onepay
        NAME: `${profile.firstname} ${profile.lastname}`,
        FIRST_NAME: profile.firstname,
        LAST_NAME: profile.lastname,
        EMAIL: profileInitial[0].email,
        PASSPORT: "",
        MOBILEPHONE: profile.phone,
        ln: language,
        vpc_TicketNo: IpLocation.query, // 203.128.80.46
      });

      // Cek Excursion atau Hotel
      let jenis = "exc";
      if (jenis == "exc") {
        formBody.append("IDMF", profileInitial[0].idx_mf);
        formBody.append("VOUCHER", profileInitial[0].voucher);
        formBody.append("AMOUNT", grandtotal.toString());
        formBody.append(
          "forurl",
          resourceInitial.url_b2c
            .replace(/(^\w+:|^)\/\//, "")
            .replace(/\/$/, "")
        );
        formBody.append("stsapp", resourceInitial.app_string);
        formBody.append("statusapp", resourceInitial.app_demo);
      }

      if (jenis == "htl") {
        formBody.append("IDMF", profileInitial[0].idx_mf);
        formBody.append("VOUCHER", "HOTEL");
        formBody.append("AMOUNT", grandtotal.toString());
        formBody.append(
          "forurl",
          resourceInitial.url_bo.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "")
        );
        formBody.append("stsapp", resourceInitial.app_string);
        formBody.append("statusapp", resourceInitial.app_demo);
      }

      let url = `${confPayment.domain}payontour.aspx`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error("Payment failed");

      // Response Html
      const html = await response.text();

      if (response.ok == true) {
        Swal.fire({
          title: "Payment Successful!",
          text: "Thank you for your payment.",
          icon: "success",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            router.replace("/");
          }
        });
      }
    } catch (error) {
      console.error("Payontour error:", error);
      toast.error("payontour . Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function checkout() {
    try {
      let profile_pay = JSON.parse(
        localStorage.getItem("profilePay") || JSON.stringify(profile)
      );

      const formBody = new URLSearchParams({
        shared_key: idxCompCart, // Indo Or Others
        xml: "false",
        id_master_file: profileInitial[0].idx_mf,
        language_code: language,
        voucher_number: profileInitial[0].voucher,
        promo_code: "R-BC",
        guest_first_name: profile_pay.firstname,
        guest_last_name: profile_pay.lastname,
        guest_email: profile_pay.email,
        guest_mobile: "mobile",
        user_agent_string: "WEB",
      });

      let url = `${API_HOSTS.host1}/excursion.asmx/v2_cart_checkout`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error("Checkout failed");

      // Response Html
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // initial
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    hitungSubtotalSummeryOrder(ChekedCart);
  }, [ChekedCart]);

  useEffect(() => {
    hitungSubtotalSummeryOrder(cartApiItems);
  }, [cartApiItems]);

  useEffect(() => {
    ListCart.map((items, index) => {
      handleOnChangeCard(items, true);
    });
  }, [ListCart]);

  useEffect(() => {
    if (!isLoading && ListCart.length === 0) {
      // router.back();
      router.push("/");
      toast.success("Cart is empty");
    }
  }, [isLoading, ListCart]);

  // Handle Refresh Saat Sudah Login di cart
  const { data: session, status } = useSession();
  useEffect(() => {
    const handleOAuth = async () => {
      let oauth = sessionStorage.getItem("oauth");

      if (status === "authenticated" && oauth === "true") {
        if (ListCart.length > 0) {
          // Inisialisasi profilePay dari session google

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

          // 🔹 Update Email di Profile Initial API
          await updateEmail(email);

          // 🔹 Simpan ke localStorage
          localStorage.setItem("profilePay", JSON.stringify(ProfilPay));
          localStorage.setItem("profileData", JSON.stringify(ProfilPay));

          // 🔹 Ubah Profile Initial
          const savedProfileInitial = localStorage.getItem("profile_initial");
          if (savedProfileInitial) {
            const parsedData = JSON.parse(savedProfileInitial);

            const updatedProfile = [
              {
                ...parsedData[0],
                email,
              },
            ];

            // Update state dan localStorage
            setProfileInitial(updatedProfile);
            localStorage.setItem(
              "profile_initial",
              JSON.stringify(updatedProfile)
            );
          }

          // 🔹 Submit payment (cukup sekali)
          await submitPayment2();
        }
      }
    };

    handleOAuth();
  }, [status, session, router]);

  useEffect(() => {
    const match = coreInitial.find((item) => item.idx_comp === idxCompCart);
    if (match && match.country.toLocaleLowerCase() == "thailand") {
      setIsThailand(true);
    } else {
      setIsThailand(false);
    }
  }, [coreInitial]);

  if (!isLoading && ListCart.length === 0) return null;
  return (
    // Cart Page
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="Cart" />
      <div className="flex flex-col md:flex-row">
        {/* Kontent Kiri */}
        <div className="w-[100%] md:w-[60%]">
          {" "}
          <section className="flex flex-col py-6 md:p-6 bg-white gap-1">
            {ListCart.map((item, index) => {
              return (
                <CardAccordion
                  key={`cardAccordion-${index}`}
                  item={item}
                  onChangeCart={handleOnChangeCard}
                  onRemoveCart={handleOnRemoveCard}
                />
              );
            })}
            <div className="block md:hidden mt-100"></div>
          </section>
        </div>
        {/* Kontent Kanan */}
        <div className="w-[100%] md:w-[40%] md:p-6">
          {/* Desktop */}
          {!isMobile && (
            <div className="hidden md:block max-w-xl p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-sm ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                Order Summary
              </h5>

              <div className="flex flex-col mt-6">
                {ChekedCart.map((item, index) => {
                  return (
                    <div
                      key={`chekedCart-${index}`}
                      className="flex flex-row justify-between mb-2"
                    >
                      <p className="text-sm text-gray-700 ">
                        {truncateText(capitalizeWords(item.excursion_name), 45)}
                      </p>
                      <p className="text-sm text-gray-700 font-semibold">
                        {item.currency} {item.priceori_in_format}
                      </p>
                    </div>
                  );
                })}
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 font-bold">Subtotal</p>
                <p className="text-sm text-gray-700 font-semibold">
                  {buyCurrencyMF}{" "}
                  {/* {formatRibuanInternational(subtotalSummeryOrder)} */}
                  {formatRibuanInternational(subtotalSummeryOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 font-semibold">Discount</p>
                <p className="text-sm text-gray-700 font-semibold">
                  {buyCurrencyMF}{" "}
                  {formatRibuanInternational(discTotalSummerOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-gray-700 font-semibold">Total</p>
                <p className="text-gray-700 font-semibold">
                  {buyCurrencyMF}{" "}
                  {formatRibuanInternational(
                    subtotalSummeryOrder - discTotalSummerOrder
                  )}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-gray-700 font-semibold">
                  Pay with local currency
                </p>
                <p className="text-gray-700 font-semibold">
                  {locaCurrencyMF}{" "}
                  {formatRibuanInternational(subtotalSummeryOrderLocal)}
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="max-w-md my-2">
                <div className="flex flex-row items-center gap-2">
                  {/* INPUT MENGISI RUANG TERSISA */}
                  <input
                    {...register("promoCode", {
                      required: "Please input your promo code",
                    })}
                    type="text"
                    id="promoCode"
                    className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 p-2.5 h-8"
                    placeholder="Input Promo Code (Optional)"
                  />

                  {/* TOMBOL WIDTH FIXED */}
                  <button
                    type="submit"
                    onClick={() => {}}
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-4 h-8"
                  >
                    {isLoadingPromoCode && <Spinner />} Apply
                  </button>
                </div>{" "}
                {errors.promoCode && (
                  <p className="text-red-600 text-xs mt-1 italic">
                    *{errors.promoCode.message}
                  </p>
                )}
              </form>

              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const match = coreInitial.find(
                      (item) => item.idx_comp === idxCompCart
                    );

                    if (match) {
                      router.push(
                        `/destination/${match.country.toLowerCase()}?id=${idxCompCart}&country=${match.country.toLowerCase()}`
                      );
                    } else {
                      router.push("/");
                    }
                  }}
                  className="text-white w-1/2 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 cursor-pointer"
                >
                  Browse More Tours
                </button>

                <button
                  type="button"
                  onClick={validationAccountPayment}
                  disabled={subtotalSummeryOrderLocal < 0}
                  className={`text-white w-1/2 ${
                    subtotalSummeryOrderLocal < 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 cursor-pointer "
                  }  font-bold rounded-lg text-sm px-5 py-2.5 `}
                >
                  {isSubmitting && <Spinner />} Checkout{" "}
                  {status == "authenticated" ? "With Google" : ""}
                </button>
              </div>
            </div>
          )}

          {/* Mobile */}
          {isMobile && (
            <div className="block md:hidden max-w-xl p-6 fixed bottom-0 left-0 w-full z-50 bg-gray-100 border border-gray-200 rounded-lg shadow-sm ">
              <div
                className="flex flex-row justify-between mb-2"
                onClick={() => {
                  setAccordion(!isOpenAccordion);
                }}
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  Order Summary
                </h5>
                <h5>
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
                </h5>
              </div>

              {isOpenAccordion && (
                <>
                  {ChekedCart.map((item, index) => {
                    return (
                      <div
                        key={`chekedCart-${index}`}
                        className="flex flex-row justify-between mb-2"
                      >
                        <p className="text-sm text-gray-700 ">
                          {truncateText(
                            capitalizeWords(item.excursion_name),
                            30
                          )}
                        </p>
                        <p className="text-sm text-gray-700 font-semibold">
                          {/* {item.currency_local} {item.price_local_in_format} */}
                          {item.currency} {item.priceori_in_format}
                        </p>
                      </div>
                    );
                  })}
                  <hr className="my-2 border border-gray-400 opacity-50" />
                </>
              )}

              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 font-bold">Subtotal</p>
                <p className="text-sm text-gray-700 font-semibold">
                  {buyCurrencyMF}{" "}
                  {formatRibuanInternational(subtotalSummeryOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 font-semibold">Disc</p>
                <p className="text-sm text-gray-700 font-semibold">
                  {buyCurrencyMF}{" "}
                  {formatRibuanInternational(discTotalSummerOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-gray-700 font-semibold">Total</p>
                <p className="text-gray-700 font-semibold">
                  {buyCurrencyMF}{" "}
                  {formatRibuanInternational(
                    subtotalSummeryOrder - discTotalSummerOrder
                  )}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-gray-700 font-semibold">
                  Pay with local currency
                </p>
                <p className="text-gray-700 font-semibold">
                  {locaCurrencyMF}{" "}
                  {formatRibuanInternational(subtotalSummeryOrderLocal)}
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="max-w-md my-2">
                <div className="flex flex-row items-center gap-2">
                  {/* INPUT MENGISI RUANG TERSISA */}
                  <input
                    {...register("promoCode", {
                      required: "Please input your promo code",
                    })}
                    type="text"
                    id="promoCode"
                    className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 p-2.5 h-8"
                    placeholder="Input Promo Code (Optional)"
                  />

                  {/* TOMBOL WIDTH FIXED */}
                  <button
                    type="submit"
                    onClick={() => {}}
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-4 h-8"
                  >
                    {isLoadingPromoCode && <Spinner />} Apply
                  </button>
                </div>{" "}
                {errors.promoCode && (
                  <p className="text-red-600 text-xs mt-1 italic">
                    *{errors.promoCode.message}
                  </p>
                )}
              </form>
              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const match = coreInitial.find(
                      (item) => item.idx_comp === idxCompCart
                    );

                    if (match) {
                      router.push(
                        `/destination/${match.country.toLowerCase()}?id=${idxCompCart}&country=${match.country.toLowerCase()}`
                      );
                    } else {
                      router.push("/");
                    }
                  }}
                  className="text-white w-1/2 bg-gray-500 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 cursor-pointer"
                >
                  Browse More
                </button>

                <button
                  type="button"
                  onClick={validationAccountPayment}
                  disabled={subtotalSummeryOrderLocal < 0}
                  className="text-white w-1/2 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 cursor-pointer"
                >
                  {isSubmitting && <Spinner />} Checkout{" "}
                  {status == "authenticated" ? "With Google" : ""}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal Payment */}
      {selectModal == "payment" && (
        <ModalComponent
          title="Payment"
          icon={faMoneyBill}
          size="5xl"
          closeBackdrop={false}
        >
          {/* Tampilkan iframe kalau sudah ada HTML */}
          {paymentHtml && (
            <iframe
              srcDoc={paymentHtml}
              style={{
                width: "100%",
                height: "600px",
                border: "none",
              }}
            />
          )}
        </ModalComponent>
      )}

      {/* Modal Profile */}
      {selectModal == "ProfilAsGuest" && (
        <ModalComponent title="Log in?" icon={faUser} closeBackdrop={false}>
          <ProfileAsGuestContent />
        </ModalComponent>
      )}

      {/* Modal GoPayment */}
      {selectModal == "GoPayment" && (
        <ModalComponent
          title="Pay as guest?"
          icon={faUser}
          closeBackdrop={false}
        >
          <GoPaymentContent
            onClick={() => {
              submitPayment2(); // ✅ sekarang submitPayment() jalan
            }}
          />
        </ModalComponent>
      )}

      {/* Modal Payment Oauth */}
      {selectModal == "GoPaymentOauth" && (
        <ModalComponent
          title={`Pay as ${
            status == "authenticated" ? session.user?.name : ""
          }`}
          icon={faUser}
          closeBackdrop={false}
        >
          <GoPaymentOauthContent
            onClick={() => {
              submitPayment(); // ✅ sekarang submitPayment() jalan
            }}
          />
        </ModalComponent>
      )}
    </div>
  );
}

// Type Data Untuk Modal
type GoPaymentContentProps = {
  onClick?: () => void; // sesuai tipe function submitPayment
};

// Modal Pilih Guest Atau Google
const ProfileAsGuestContent = () => {
  const { setSelectModal } = useSelectModal();
  const { closeModal, openModal } = useModal();

  type FormData = {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    temp: string;
  };

  const { profile, setProfile } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Simpan ke localStorage
    closeModal();
  };

  const { data: session } = useSession();
  return (
    <div className="flex flex-row mb-2 p-2 md:p-0">
      <div className="w-[100%] rounded-sm">
        {/* Apply */}
        <div className="mb-3">
          <button
            type="button"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-3xl text-sm px-5 py-2.5 text-center w-full cursor-pointer"
            onClick={() => {
              // sekarang bisa langsung set dari sini
              closeModal();
              setSelectModal("GoPayment");
              openModal();
            }}
          >
            Continue as guest
          </button>
          <div className="flex items-center gap-3 text-gray-500 text-sm my-3">
            <div className="flex-1 border-t"></div>
            <span>OR</span>
            <div className="flex-1 border-t"></div>
          </div>
          <p className="text-gray-500 text-sm mb-3">
            Check out more easily and access your tickets on any device with
            your Govacation account.
          </p>

          <div className="flex flex-row gap-2">
            {/* Google */}
            <button
              type="button"
              onClick={() => {
                signIn("google");
                sessionStorage.setItem("oauth", "true");
              }}
              className="flex items-center justify-center text-gray-700 mb-3 hover:text-gray-500 border-2 border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-3xl text-sm px-5 py-2.5 text-center w-full cursor-pointer gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Form Guest
const GoPaymentContent = ({ onClick }: GoPaymentContentProps) => {
  const { closeModal } = useModal();

  type FormData = {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    temp: string;
  };

  const { profile, setProfile } = useProfile();
  const { cartApiItems, idxCompCart, setIdxCompCart } = useCartApi();
  // Context global
  const { profileInitial, setProfileInitial, resourceInitial, coreInitial } =
    useInitial();

  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState("");
  const [countryCodeUser, setCountryCodeUser] = useState("ID");

  // Geolocation
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung di browser ini.");
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchCountry = async () => {
      try {
        let country_code = await checkCountry(location.lat, location.lng);
        setCountryCodeUser(country_code.toUpperCase());
      } catch (err) {
        console.error("Error ambil negara:", err);
      }
    };

    fetchCountry();
  }, [location]);

  // Function Get Country OpenStreetmap
  async function checkCountry(lat: number, lng: number) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.address.country_code; // contoh: "Indonesia"
  }

  // function Update Email Local Modal
  async function updateEmail(email: string) {
    try {
      const formBody = new URLSearchParams({
        shared_key: idxCompCart, // Indo Or Others
        xml: "false",
        id_master_file: profileInitial[0].idx_mf,
        email: email,
      });

      let url = `${API_HOSTS.host1}/excursion.asmx/v2_updateemail`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error("update email failed");

      // Response Html
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  // function Update Profile Data, ProfilePay dan ProfileInitial Pada Localstorage Local Modal
  async function updateProfilLocalStorage(data: FormData) {
    // ubah email profilPay
    localStorage.setItem("profilePay", JSON.stringify(data));

    let UpdateProfile = {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone ?? "0000",
      temp: "false",
    };
    // Ubah profil data
    setProfile(UpdateProfile);
    localStorage.setItem("profileData", JSON.stringify(UpdateProfile));

    // Ubah Profile Initial
    const savedProfileInitial = localStorage.getItem("profile_initial");
    if (savedProfileInitial) {
      const parsedData = JSON.parse(savedProfileInitial);

      // ambil data lama dan ubah email-nya
      const updatedProfile = [
        {
          ...parsedData[0], // ambil data lama dari localStorage
          email: data.email, // ganti email dengan email baru
        },
      ];

      // simpan ke state
      setProfileInitial(updatedProfile);

      // simpan kembali ke localStorage
      localStorage.setItem("profile_initial", JSON.stringify(updatedProfile));
    }
  }

  const {
    register,
    handleSubmit,
    control, // ✅ tambahkan ini
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Ubah email profilInitial api untuk cart
    await updateEmail(data.email);
    await updateProfilLocalStorage(data);

    toast.success("Save Profile, Success");
    toast.success(`Hai ${data.firstname ?? ""}, Welcome!`);
    // ✅ panggil function dari parent
    onClick?.();
    closeModal();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row mb-2 p-2 md:p-0">
        <div className="w-[100%] rounded-sm">
          <div className="mb-3">
            <label
              htmlFor="firstname"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              First Name
            </label>
            <input
              {...register("firstname", {
                required: "First name is required",
              })}
              type="text"
              id="firstname"
              defaultValue={profile.temp == "true" ? "" : profile.firstname}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="First Name"
              required
            />
            {errors.firstname && (
              <p className="text-red-500">{errors.firstname.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="lastname"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Last Name
            </label>
            <input
              {...register("lastname", {
                required: "Last name is required",
              })}
              type="text"
              id="lastname"
              defaultValue={profile.temp == "true" ? "" : profile.lastname}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Last Name"
              required
            />
            {errors.lastname && (
              <p className="text-red-500">{errors.lastname.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Phone Number
            </label>
            <Controller
              name="phone"
              control={control}
              defaultValue={profile.temp == "true" ? "" : profile.phone}
              rules={{ required: "Phone number is required" }}
              render={({ field, fieldState }) => (
                <>
                  <PhoneInput
                    {...field}
                    defaultCountry={countryCodeUser as Country}
                    placeholder="Enter phone number"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      // Ambil code negara (+62)
                      const cc = value?.match(/^\+\d+/)?.[0] ?? "";
                      setCountryCode(cc);

                      // Simpan country code juga kalau diperlukan
                    }}
                    onCountryChange={(c) => {
                      setCountry(c ?? ""); // contoh "ID"
                    }}
                    className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5"
                  />

                  {fieldState.error && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              {...register("email", {
                required: "email is required",
              })}
              type="email"
              id="email"
              defaultValue={profile.temp == "true" ? "" : profile.email}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Email"
              required
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <input
            {...register("temp")}
            type="hidden"
            id="temp"
            defaultValue={"false"}
          />
          {/* Apply */}
          <div className="mb-3">
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center w-full"
            >
              Go Payment
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

// Modal Google
const GoPaymentOauthContent = ({ onClick }: GoPaymentContentProps) => {
  const { closeModal } = useModal();
  const { data: session, status } = useSession();

  type FormData = {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    temp: string;
  };

  const { profile, setProfile } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    let email = "";
    let firstname = "";
    let lastname = "";
    if (status == "authenticated") {
      email = session.user?.email ?? "";
      firstname = splitUsername(session.user?.name ?? "")[0] ?? "-";
      lastname = splitUsername(session.user?.name ?? "")[1] ?? "-";
    }
    let ProfilPay = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      phone: "000000",
      temp: "false",
    };
    localStorage.setItem("profilePay", JSON.stringify(ProfilPay));

    let UpdateProfile = {
      email: profile.email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      phone: "000000",
      temp: "false",
    };

    localStorage.setItem("profileData", JSON.stringify(UpdateProfile));

    toast.success("Save Profile, Success");
    toast.success(`Hai ${data.firstname ?? ""}, Welcome!`);
    // ✅ panggil function dari parent
    onClick?.();
    closeModal();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row mb-2 p-2 md:p-0">
        <div className="w-[100%] rounded-sm">
          {/* Apply */}
          <div className="mb-3">
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center w-full"
            >
              Go Payment
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
