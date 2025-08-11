"use client";
// Hooks
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
// Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faInbox } from "@fortawesome/free-solid-svg-icons";
// component
import Breadcrumb from "@/components/Breadcrumb";
import CardAccordion from "@/components/CardAccordion";
import HorizontalCard from "@/components/HorizontalCard";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
// Context global
import { useCartApi } from "@/context/CartApiContext";
import { useInitial } from "@/context/InitialContext";
import { useProfile } from "@/context/ProfileContext";

// Helper
import {
  formatRibuan,
  capitalizeWords,
  truncateText,
  formatRibuanInternational,
} from "@/helper/helper";
import toast from "react-hot-toast";
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

export default function Cart() {
  const router = useRouter(); // ✅ ini sekarang valid
  // State Data Detail Destination
  const [ListCart, setCart] = useState<CartApiItem[]>([]);
  const [ChekedCart, setCheckedCart] = useState<CartApiItem[]>([]);

  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isRemove, setIsRemove] = useState(true);
  const { cartApiItems } = useCartApi();
  const [isOpenAccordion, setAccordion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtotalSummeryOrder, setSubtotalSummeryOrder] = useState(0);
  const [discTotalSummerOrder, setDiscTotalSummerOrder] = useState(0);
  // Context global
  const { profileInitial, resourceInitial } = useInitial();
  const { profile } = useProfile();

  useEffect(() => {
    loadCart();
  }, [cartApiItems]); // tetap kosong, agar hanya dijalankan sekali saat mount

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart_api") || "[]");
    console.log(cart);
    setCart(cart);
    setIsLoading(false);
  }

  async function handleOnChangeCard(item: CartApiItem, checked: boolean) {
    console.log("====CART CHANGE====");
    console.log("Cheked :", checked);
    console.log(item);

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
    console.log("==REMOVE==");
    console.log(item);
    setIsRemove(true);
    await handleOnChangeCard(item, false);
    setIsRemove(false);
    // Hapus Dari List Dan ChekedList
  }

  function hitungSubtotalSummeryOrder(items: CartApiItem[]) {
    let subTotal = 0;
    let discTotal = 0;
    items.map((item, index) => {
      subTotal += parseInt(item.price_local);
      discTotal += parseInt(item.disc);
    });
    setSubtotalSummeryOrder(subTotal);
    setDiscTotalSummerOrder(discTotal);
  }

  async function handlePaymentGateway() {
    if (isSubmitting) {
      toast.success("Please Wait");
      return null;
    }

    if (isRemove) {
      toast.success("Please Wait Remove Finished!");
      return null;
    }

    setIsSubmitting(true);
    try {
      let grandtotal = subtotalSummeryOrder - discTotalSummerOrder;
      const formBody = new URLSearchParams({
        IDMF: profileInitial[0].idx_mf, //dari idx_mf profil "eee9a3a6cfae456b9467420029f54de6"
        VOUCHER: profileInitial[0].voucher, //dari voucher profil "250759791"
        NAME: `${profile.firstname} ${profile.lastname}`,
        FIRST_NAME: profile.firstname,
        LAST_NAME: profile.lastname,
        EMAIL: profileInitial[0].email,
        MOBILEPHONE: profile.phone,
        AMOUNT: grandtotal.toString(),
        PASSPORT: "",
        forurl: "excursion.govacation-indonesia.com",
        stsapp: "appsv2",
        statusapp: "",
        In: "DE",
        pay_provider: "docu",
        intl: "gvi",
      });

      // "https://internetpaygate.com/mIPGDetail.aspx"
      const response = await fetch(resourceInitial.url_payment, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error("Payment failed");

      // const result = await response.json();
      const html = await response.text();
      console.log("Payment page HTML:", html);

      // Jika mau render HTML ini di iframe atau window baru:

      const newWindow = window.open("", "_blank");

      if (newWindow && newWindow.document) {
        newWindow.document.open();
        newWindow.document.write(html);
        newWindow.document.close();
      } else {
        console.error("Gagal membuka jendela baru. Mungkin diblokir browser.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment gagal. Silakan coba lagi.");
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
                        {/* {item.currency} {item.price_in_format} */}
                        {item.currency_local} {item.price_local_in_format}
                      </p>
                    </div>
                  );
                })}
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 font-bold">Subtotal</p>
                <p className="text-sm text-gray-700 font-semibold">
                  {formatRibuanInternational(subtotalSummeryOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 font-semibold">Disc</p>
                <p className="text-sm text-gray-700 font-semibold">
                  {formatRibuanInternational(discTotalSummerOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-gray-700 font-semibold">Grand Total</p>
                <p className="text-gray-700 font-semibold">
                  {formatRibuanInternational(
                    subtotalSummeryOrder - discTotalSummerOrder
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePaymentGateway}
                className="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                {isSubmitting && <Spinner />} Payment
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
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="w-10 h-10 text-gray-500"
                    size="lg"
                  />
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
                          {item.currency} {item.price_in_format}
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
                  {formatRibuan(subtotalSummeryOrder)}
                </p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-sm text-gray-700 font-semibold">Disc</p>
                <p className="text-sm text-gray-700 font-semibold">0</p>
              </div>
              <hr className="my-2 border border-gray-400 opacity-50" />
              <div className="flex flex-row justify-between mb-2">
                <p className="text-gray-700 font-semibold">Grand Total</p>
                <p className="text-gray-700 font-semibold">
                  {" "}
                  {formatRibuan(subtotalSummeryOrder)}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePaymentGateway}
                className="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                {isSubmitting && <Spinner />} Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
