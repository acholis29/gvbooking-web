"use client";
// Hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faMoneyBill,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
// Form Libraries
import { useForm, Controller, useFieldArray, Form } from "react-hook-form";
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
} from "@/helper/helper";
import { useModal } from "@/context/ModalContext";
import ModalComponent from "@/components/ModalComponent";
import { useSelectModal } from "@/context/SelectModalContext";
import { API_HOSTS } from "@/lib/apihost";

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
  const { profileInitial, resourceInitial } = useInitial();
  const { profile } = useProfile();
  const { cartApiItems, idxCompCart, setIdxCompCart } = useCartApi();
  const { openModal } = useModal();
  const { selectModal, setSelectModal } = useSelectModal();

  resourceInitial.app_string = "newweb";

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart_api") || "[]");
    if (cart.length > 0) {
      setIdxCompCart(cart[0].company_id);
    }
  }, []);

  useEffect(() => {
    console.log("idx comp cart", idxCompCart);
    if (idxCompCart != "") {
      fetch(`/mobile/data/${idxCompCart}.json`, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Payment Data:", data);
          setPayment(data.payment); // ✅ langsung set array-nya
          if (data.onepay_param != null) {
            setOnepayParam(data.onepay_param);
          }
        })
        .catch((err) => console.error(err));
    }

    // if (resourceInitial.url_fo != "") {
    //   fetch(`${resourceInitial.url_fo}/mobile/data.json`, {
    //     cache: "no-store",
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       console.log("Payment Data:", data);
    //       setPayment(data.payment); // ✅ langsung set array-nya
    //       if (data.onepay_param != null) {
    //         setOnepayParam(data.onepay_param);
    //       }
    //     })
    //     .catch((err) => console.error(err));
    // }
    loadCart();
  }, [cartApiItems, idxCompCart]);

  useEffect(() => {
    fetch(`${API_HOSTS.host1}/mobile/corev2.json`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setCorev2(data); // ✅ langsung set array-nya
        console.log(data);
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
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart_api") || "[]");
    console.log(cart);
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
      subTotal += parseInt(item.priceori);
      discTotal += parseInt(item.disc);
      subTotalLocal += parseInt(item.price_local);
      if (index == 0) {
        setLocalCurrencyMF(item.currency_local);
        setBuyCurrencyMF(item.currency);
      }
    });
    setSubtotalSummeryOrder(subTotal);
    setDiscTotalSummerOrder(discTotal);
    setSubtotalSummeryOrderLocal(subTotalLocal);
  }

  async function submitPayment() {
    const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
    if (profileData.temp == "true") {
      setSelectModal("ProfilAsGuest");
      openModal();
      return null;
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
    console.log(confPayment.provider);

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
      // resourceInitial.url_b2c=window.location.origin.toString();
      // let grandtotal = subtotalSummeryOrder - discTotalSummerOrder;
      let grandtotal = subtotalSummeryOrderLocal; //idr
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
      console.log("HTML PAYMENT :", html);
      if (
        confPayment.provider == "onepay" ||
        confPayment.provider == "Sathapana"
      ) {
        const newWindow = window.open("", "");
        if (newWindow && newWindow.document) {
          newWindow.document.open();
          newWindow.document.write(html);
          newWindow.document.close();
        } else {
          toast.error("Gagal membuka jendela baru. Mungkin diblokir browser.");
          console.error(
            "Gagal membuka jendela baru. Mungkin diblokir browser."
          );
        }
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
      console.log("pay on tour");
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
      console.log(response);
      const html = await response.text();
      console.log(html);

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
    ListCart.map((items, index) => {
      handleOnChangeCard(items, true);
    });
  }, [ListCart]);

  useEffect(() => {
    if (!isLoading && ListCart.length === 0) {
      router.back();
      toast.success("Cart is empty");
    }
  }, [isLoading, ListCart]);

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
              <button
                type="button"
                onClick={submitPayment}
                className="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer"
              >
                {isSubmitting && <Spinner />} Checkout
              </button>
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
                          {item.currency_local} {item.price_local_in_format}
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
                  {" "}
                  {formatRibuanInternational(subtotalSummeryOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 font-semibold">Disc</p>
                <p className="text-sm text-gray-700 font-semibold">
                  {" "}
                  {formatRibuanInternational(discTotalSummerOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-gray-700 font-semibold">Grand Total</p>
                <p className="text-gray-700 font-semibold">
                  {" "}
                  {formatRibuanInternational(
                    subtotalSummeryOrder - discTotalSummerOrder
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={submitPayment}
                className="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer"
              >
                {isSubmitting && <Spinner />} Checkout
              </button>
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
        <ModalComponent title="Log in?" icon={faUser}>
          <ProfileAsGuestContent />
        </ModalComponent>
      )}

      {/* Modal Profile */}
      {selectModal == "GoPayment" && (
        <ModalComponent title="Pay as guest?" icon={faUser}>
          <GoPaymentContent
            onClick={() => {
              submitPayment(); // ✅ sekarang submitPayment() jalan
            }}
          />
        </ModalComponent>
      )}
    </div>
  );
}

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
  return (
    <div className="flex flex-row mb-2 p-2 md:p-0">
      <div className="w-[100%] rounded-sm">
        {/* Apply */}
        <div className="mb-3">
          <button
            type="button"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-3xl text-sm px-5 py-2.5 text-center w-full cursor-pointer"
            onClick={() => {
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
            your GetYourGuide account.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("email")}
                type="email"
                id="email"
                defaultValue=""
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                placeholder="Email"
              />
              {errors.firstname && (
                <p className="text-red-500">{errors.firstname.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="text-red-800 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-3xl text-sm px-5 py-2.5 text-center w-full cursor-pointer"
            >
              Continue with email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

type GoPaymentContentProps = {
  onClick?: () => void; // sesuai tipe function submitPayment
};

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log(data);
    // Simpan ke localStorage
    localStorage.setItem("profileData", JSON.stringify(data));
    setProfile(data);
    toast.success("Save Profile, Success");
    toast.success(`Hai, ${data.firstname}, Welcome!`);
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
              defaultValue=""
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
              defaultValue=""
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
            <input
              {...register("phone")}
              type="number"
              id="phone"
              defaultValue=""
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Phone Number"
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
              defaultValue=""
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
