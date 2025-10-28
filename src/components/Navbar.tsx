"use client";
// Hooks
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Context State Global
import { useCart } from "@/context/CartContext";
import { useCartApi } from "@/context/CartApiContext";
import { useWish } from "@/context/WishContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useModal } from "@/context/ModalContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDate } from "@/context/DateContext";
import { useReviewBooking } from "@/context/ReviewBookingContext";
import { useProfile } from "@/context/ProfileContext";
import { useInitial } from "@/context/InitialContext";
import { useSelectModal } from "@/context/SelectModalContext";

// Component
import DrawerComponent from "@/components/Drawer";
import ModalComponent from "./ModalComponent";

// Library
import { signIn, signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleRight,
  faBars,
  faCalendarDays,
  faCheck,
  faChevronDown,
  faDollarSign,
  faGear,
  faGlobe,
  faHeart,
  faMoneyCheckDollar,
  faRightToBracket,
  faShoppingCart,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Helper
import { API_HOSTS } from "@/lib/apihost";
import {
  capitalizeFirst,
  generateTempEmail,
  toLowerCaseAll,
  truncateText,
} from "@/helper/helper";

// Select Search Autocomplate Component
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
const NavbarClientAsyncSelect = dynamic(
  () => import("@/components/NavbarClientAsyncSelect"),
  {
    ssr: false,
  }
);

// Penggunaa UseParams Harus Pakai Suspanse
function CountryWatcher({
  setSelectedCategory,
}: {
  setSelectedCategory: (v: string) => void;
}) {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") ?? "";

  useEffect(() => {
    setSelectedCategory(
      country ? capitalizeFirst(country) : "All Destinations"
    );
  }, [country, setSelectedCategory]);

  return null;
}

export default function NavbarComponent() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Destinations");
  const [isProfilDropdownOpen, setProfilDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { selectModal, setSelectModal } = useSelectModal();
  const [firstName, setFirstName] = useState("");
  // Login with Google
  const { data: session, status } = useSession();

  type CountryItem = {
    country: string;
    idx_comp: string;
  };
  const [countryMaster, setCountryMaster] = useState<CountryItem[]>([]);

  const pathname = usePathname();
  const hideSearch = ["/cart", "/wishlist", "/review_booking", "/profile"].some(
    (route) => pathname.startsWith(route)
  );

  const hideCurrency = pathname === "/" || pathname === "/home";
  const hideCartIcon = pathname === "/" || pathname === "/home";
  const redirectLocation = pathname === "/" || pathname === "/home";

  const menu_profil = [
    "Sign In",
    "Options",
    "Currency",
    "Language",
    "Sign Out",
  ];

  // Cart Counter
  const { cartCount } = useCart();
  // Cart API Counter
  const { cartApiCount, idxCompCart, setIdxCompCart } = useCartApi();
  // Wish Counter
  const { wishCount } = useWish();
  // Currency
  const { currency, setCurrency, masterCurrency, setMasterCurrency } =
    useCurrency();
  // Language
  const { language, setLanguage, masterLanguage, setMasterLanguage } =
    useLanguage();
  // Date
  const { date, setDate } = useDate();
  // Review Booking
  const { reviewBookingObj, setReviewBookingObj } = useReviewBooking();
  // Profile
  const { profile, setProfile } = useProfile();
  // Initial
  const {
    agent,
    setAgent,
    repCode,
    setRepCode,
    setResourceInitial,
    setProfileInitial,
    setCoreInitial,
    setRepresentative,
  } = useInitial();

  // Timeout Delay
  let timeout: NodeJS.Timeout;

  // Modal
  const { openModal } = useModal();

  // Redirect
  const router = useRouter();

  // Konversi string ke Date (atau fallback ke hari ini jika kosong)
  const initialDate = date ? new Date(date) : new Date();
  // Date Picker
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isOpenDate, setIsOpenDate] = useState(false);

  const handleChange = (e: any) => {
    setIsOpenDate(!isOpenDate);
    setSelectedDate(e);
    // Date Global
    // Format ke YYYY-MM-DD
    const formattedDate = e.toISOString().split("T")[0];
    // Date Global
    setDate(formattedDate); // hasil: 2025-07-17
    localStorage.setItem("booking_date", formattedDate);
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    setIsOpenDate(!isOpenDate);
  };

  useEffect(() => {
    fetch("/api/currency", {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setMasterCurrency(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("/api/language", {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setMasterLanguage(data);
      })
      .finally(() => {})
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${API_HOSTS.host1}/mobile/corev2.json`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setCountryMaster(data); // ✅ langsung set array-nya
        setCoreInitial(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const savedReviewBooking = sessionStorage.getItem("paramsReviewBooking");
    if (savedReviewBooking) {
      setReviewBookingObj(JSON.parse(savedReviewBooking));
    }

    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
      const parsedData = JSON.parse(savedProfile);
      setProfile(parsedData);
    }

    const savedDate = localStorage.getItem("booking_date");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split("T")[0];
    if (savedDate) {
      const saved = new Date(savedDate);
      saved.setHours(0, 0, 0, 0);

      if (saved <= today) {
        // Kalau saved date kemarin atau hari ini → pakai tomorrow
        setDate(formattedTomorrow);
        localStorage.setItem("booking_date", formattedTomorrow);
      } else {
        // Kalau besok atau lebih → pakai savedDate
        setDate(savedDate);
      }
    } else {
      // Kalau belum ada di localStorage → set ke tomorrow
      setDate(formattedTomorrow);
      localStorage.setItem("booking_date", formattedTomorrow);
    }

    const savedResourceInitial = localStorage.getItem("resource_initial");
    if (savedResourceInitial) {
      const parsedData = JSON.parse(savedResourceInitial);
      setResourceInitial(parsedData);
    }

    const savedProfileInitial = localStorage.getItem("profile_initial");
    if (savedProfileInitial) {
      const parsedData = JSON.parse(savedProfileInitial);
      setProfileInitial(parsedData);
    }

    const savedRepresentative = localStorage.getItem("representative");
    if (savedRepresentative) {
      const parsedData = JSON.parse(savedRepresentative);
      setRepresentative(parsedData);
    }

    const savedCart = JSON.parse(localStorage.getItem("cart_api") || "[]");
    if (savedCart.length > 0) {
      setIdxCompCart(savedCart[0].company_id);
    }
  }, []);

  useEffect(() => {
    const savedProfileData = localStorage.getItem("profileData");
    if (savedProfileData) {
      const parsedData = JSON.parse(savedProfileData);
      setFirstName(parsedData.firstname);

      if (parsedData.email == "") {
        let profile_temp = {
          firstname: "guest",
          lastname: "",
          email: generateTempEmail(),
          phone: "123456789",
          temp: "true", //temporary
        };

        // Simpan ke localStorage
        localStorage.setItem("profileData", JSON.stringify(profile_temp));
        setProfile(profile_temp);
      }
    } else {
      let profile_temp = {
        firstname: "guest",
        lastname: "",
        email: generateTempEmail(),
        phone: "123456789",
        temp: "true", //temporary
      };

      // Simpan ke localStorage
      localStorage.setItem("profileData", JSON.stringify(profile_temp));
      setProfile(profile_temp);
    }
  }, [profile]);

  useEffect(() => {
    // Set Date Picker Pada
    setSelectedDate(new Date(date));
  }, [date]);

  // Ukuran Mobile
  useEffect(() => {
    // Fungsi untuk update state berdasarkan lebar window
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // <768px dianggap mobile
    };

    // Cek pertama kali saat mount
    handleResize();

    // Tambahkan event listener
    window.addEventListener("resize", handleResize);

    // Bersihkan event listener saat unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (countryMaster.length == 0) return;

    const fetchCountry = async () => {
      try {
        let country = await checkCountry(location.lat, location.lng);
        countryMaster.map((item, index) => {
          if (item.country.toLowerCase() == country.toLowerCase()) {
            if (redirectLocation) {
              router.push(
                `/destination/${toLowerCaseAll(item.country)}?id=${
                  item.idx_comp
                }&country=${toLowerCaseAll(item.country)}`
              );
            }
          }
        });
      } catch (err) {
        console.error("Error ambil negara:", err);
      }
    };

    fetchCountry();
  }, [location, countryMaster]);

  // Function Get Country OpenStreetmap
  async function checkCountry(lat: number, lng: number) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.address.country; // contoh: "Indonesia"
  }

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <div className="w-[150px] h-auto">
            <Image
              src="/images/logo/gvi-logo-removebg-slim.svg"
              alt="GVI logo"
              width={180}
              height={38}
              className="w-full h-auto"
              priority
            />
          </div>
        </Link>
        {/* Search */}
        {!hideSearch && (
          <form className="max-w-xl w-full mx-auto hidden md:block">
            <div className="flex">
              <div
                className="relative group"
                onMouseLeave={() => {
                  timeout = setTimeout(() => setDropdownOpen(false), 200); // delay 200ms
                }}
                onMouseEnter={() => {
                  clearTimeout(timeout);
                  setDropdownOpen(true);
                }}
              >
                <button
                  // onClick={() => setDropdownOpen(!isDropdownOpen)}
                  id="dropdown-button"
                  data-dropdown-toggle="dropdown-category"
                  className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 cursor-pointer whitespace-nowrap"
                  type="button"
                >
                  {selectedCategory}
                  <span className="ml-2">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="w-4 h-4 text-gray-600"
                    />
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 mt-2">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={() => {
                            setSelectedCategory("All Destinations");
                            setDropdownOpen(false);
                            router.push("/home"); // Ganti dengan path yang diinginkan
                          }}
                          type="button"
                          className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          All Destinations
                        </button>
                      </li>
                      {countryMaster.map((item) => (
                        <li key={item.country}>
                          <button
                            onClick={() => {
                              if (
                                cartApiCount > 0 &&
                                item.idx_comp != idxCompCart
                              ) {
                                Swal.fire({
                                  title: "You still have items in your cart.",
                                  text: "Please complete your booking or empty your cart before continuing.",
                                  icon: "warning",
                                  showCancelButton: false,
                                  showDenyButton: false,
                                  confirmButtonColor: "#ef4444", // red-500
                                  denyButtonColor: "#6b7280", // gray-500
                                  confirmButtonText: "Go To Cart",
                                  // denyButtonText: "Back To Cart",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    router.push("/cart");
                                    // Swal.fire({
                                    //   title: "Payment",
                                    //   text: "Payment success!",
                                    //   icon: "success",
                                    // });
                                  } else if (result.isDenied) {
                                    router.push("/cart");
                                  }
                                });
                              } else {
                                setSelectedCategory(item.country);
                                setDropdownOpen(false);
                                router.push(
                                  `/destination/${toLowerCaseAll(
                                    item.country
                                  )}?id=${
                                    item.idx_comp
                                  }&country=${toLowerCaseAll(item.country)}`
                                );
                              }
                            }}
                            type="button"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {item.country}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Button */}
              <div
                className={`relative w-full border border-gray-300 bg-gray-100 rounded-tr-2xl rounded-br-2xl`}
              >
                {/* Select dropdown Desktop */}
                {isMobile == false && <NavbarClientAsyncSelect />}

                {/* Tombol Kalender */}
                <div
                  onMouseEnter={() => {
                    clearTimeout(timeout);
                    setIsOpenDate(true);
                  }}
                  onMouseLeave={() => {
                    timeout = setTimeout(() => setIsOpenDate(false), 200); // delay 200ms
                  }}
                >
                  <button
                    type="button"
                    className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-red-gvi rounded-e-lg border border-red-600 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 cursor-pointer"
                    title="Date"
                    onClick={handleClick}
                  >
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="w-4 h-4 text-gray-100"
                    />
                    <span className="sr-only">Date</span>
                  </button>
                  {isOpenDate && (
                    <div className="absolute top-full mt-2 right-0 z-50 bg-white shadow-lg rounded">
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleChange}
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
              </div>
            </div>
          </form>
        )}

        {/* Icon */}
        <div className="relative">
          {/* Desktop/Tablet: Show full icon menu */}
          <div className="hidden lg:flex gap-6 p-2 rounded-xl">
            {/* Icon Currency */}
            <IconItemCartWish
              icon={faHeart}
              label="WISHLIST"
              link="/wishlist"
              badgeCount={wishCount}
            />
            {!hideCartIcon && (
              <IconItemCartWish
                icon={faShoppingCart}
                label="CART"
                link="/cart"
                badgeCount={cartApiCount}
              />
            )}

            {/* Profile */}
            {/* <IconItem icon={faUser} label="PROFILE" /> */}
            <div
              className="relative group"
              onMouseLeave={() => {
                timeout = setTimeout(() => setProfilDropdownOpen(false), 200); // delay 200ms
              }}
              onMouseEnter={() => {
                clearTimeout(timeout);
                setProfilDropdownOpen(true);
              }}
            >
              <div
                className="flex flex-col items-center cursor-pointer"
                title={
                  status == "authenticated"
                    ? session.user?.name?.toLocaleUpperCase()
                    : ""
                }
                // onClick={() => setProfilDropdownOpen(!isProfilDropdownOpen)}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-2xl text-gray-500 hover:text-red-500"
                />
                <span className="text-xs text-gray-500 mt-1">
                  {" "}
                  {status == "authenticated"
                    ? truncateText(
                        session.user?.name?.toLocaleUpperCase() ?? "",
                        10
                      )
                    : firstName == ""
                    ? "PROFILE"
                    : firstName.toUpperCase()}
                  {/* {firstName == "" ? "PROFILE" : firstName.toUpperCase()} */}
                </span>
              </div>

              {isProfilDropdownOpen && (
                <div className="absolute z-30 mt-2 right-0 bg-white border border-gray-200 shadow-md rounded-md w-80 py-3">
                  <ul className="text-sm text-gray-700">
                    {menu_profil.map((item, index) => {
                      // Hidden Currency di route tertentu
                      if (item == "Currency" && hideCurrency) {
                        return null;
                      }

                      // Hidden Sign In Ketika Login
                      if (item == "Sign In" && status == "authenticated") {
                        return null;
                      }

                      if (item == "Sign Out" && status == "unauthenticated") {
                        return null;
                      }

                      if (item == "Options" && status == "authenticated") {
                        return null;
                      }

                      return (
                        <li
                          key={index}
                          className="flex items-center hover:bg-gray-100"
                          onClick={() => {
                            if (item == "Options") {
                              router.push("/profile");
                            } else if (item == "Sign Out") {
                              signOut();
                              sessionStorage.setItem("oauth", "false");
                            } else {
                              setSelectModal(`${item}`);
                              if (item == "Currency" && cartApiCount > 0) {
                                toast(
                                  "Currency can only be changed with an empty cart. Please clear your cart to switch currency.",
                                  {
                                    icon: "⚠️", // warning emoji
                                  }
                                );
                              } else {
                                openModal(); // ⬅️ Ini akan memunculkan modal
                              }
                            }
                          }}
                        >
                          <div className="ml-4 w-5 text-center">
                            <FontAwesomeIcon
                              icon={
                                item === "Sign In"
                                  ? faRightToBracket
                                  : item === "Currency"
                                  ? faDollarSign
                                  : item === "Options"
                                  ? faGear
                                  : item === "Sign Out"
                                  ? faSignOut
                                  : faGlobe
                              }
                              className="text-lg text-gray-500 shrink-0"
                            />
                          </div>
                          <div className="w-40">
                            <button className="w-full px-4 py-2  text-left flex items-center gap-x-2 truncate">
                              <span className="text-gray-700 truncate">
                                {item}{" "}
                              </span>
                            </button>
                          </div>
                          <div className="w-40 flex justify-end pr-4">
                            {item == "Currency" ? (
                              <span className="font-bold text-xs text-red-500 pr-1">{`(${currency})`}</span>
                            ) : (
                              ""
                            )}
                            {item == "Language" ? (
                              <span className="font-bold text-xs text-red-500 pr-1">{`(${language})`}</span>
                            ) : (
                              ""
                            )}
                            <FontAwesomeIcon
                              icon={faAngleRight}
                              className="text-lg text-gray-500 shrink-0"
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Show burger menu */}
          <div className="flex lg:hidden items-center">
            <FontAwesomeIcon
              icon={faBars}
              className="text-2xl text-gray-700"
              data-drawer-target="drawer-navigation"
              data-drawer-show="drawer-navigation"
              aria-controls="drawer-navigation"
              onClick={() => {
                const drawer = document.getElementById("drawer-navigation");
                if (!drawer) return;

                // Jika drawer saat ini disembunyikan, buka
                // if (drawer.classList.contains("-translate-x-full")) {
                //   drawer.classList.remove("-translate-x-full");
                // } else {
                //   drawer.classList.add("-translate-x-full");
                // }
                if (drawer.classList.contains("translate-x-full")) {
                  drawer.classList.remove("translate-x-full");
                  setDrawerOpen(true);
                } else {
                  drawer.classList.add("translate-x-full");
                }
              }}
            />
          </div>

          {/* Drawer */}
          <DrawerComponent
            isOpen={isDrawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        </div>

        {/* Search */}
        {!hideSearch && (
          <form className="max-w-xl w-full mx-auto md:hidden">
            <div className="flex">
              <div
                className="relative group"
                onMouseLeave={() => {
                  timeout = setTimeout(() => setDropdownOpen(false), 200); // delay 200ms
                }}
                onMouseEnter={() => {
                  clearTimeout(timeout);
                  setDropdownOpen(true);
                }}
              >
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  id="dropdown-button"
                  data-dropdown-toggle="dropdown"
                  className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 whitespace-nowrap"
                  type="button"
                >
                  {selectedCategory}
                  <span className="ml-2">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="w-4 h-4 text-gray-600"
                    />
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 mt-2">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={() => {
                            setSelectedCategory("All Destinations");
                            setDropdownOpen(false);
                            router.push("/home");
                          }}
                          type="button"
                          className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                        >
                          All Destinations
                        </button>
                      </li>
                      {countryMaster.map((item) => (
                        <li key={item.country}>
                          <button
                            onClick={() => {
                              if (
                                cartApiCount > 0 &&
                                item.idx_comp != idxCompCart
                              ) {
                                Swal.fire({
                                  title: "You still have items in your cart.",
                                  text: "Please complete your booking or empty your cart before continuing.",
                                  icon: "warning",
                                  showCancelButton: false,
                                  showDenyButton: true,
                                  confirmButtonColor: "#ef4444", // red-500
                                  denyButtonColor: "#6b7280", // gray-500
                                  confirmButtonText: "Go To Cart",
                                  // denyButtonText: "Back To Cart",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    router.push("/cart");
                                    // Swal.fire({
                                    //   title: "Payment",
                                    //   text: "Payment success!",
                                    //   icon: "success",
                                    // });
                                  } else if (result.isDenied) {
                                    router.push("/cart");
                                  }
                                });
                              } else {
                                setSelectedCategory(item.country);
                                setDropdownOpen(false);
                                router.push(
                                  `/destination/${toLowerCaseAll(
                                    item.country
                                  )}?id=${
                                    item.idx_comp
                                  }&country=${toLowerCaseAll(item.country)}`
                                );
                              }
                            }}
                            type="button"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {item.country}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Button */}
              <div className="relative w-full border border-gray-300 bg-gray-100 rounded-tr-2xl rounded-br-2xl">
                {/* Select dropdown kamu */}
                {isMobile == true && <NavbarClientAsyncSelect />}
                {/* Tombol Kalender */}
                <div
                  onMouseEnter={() => {
                    clearTimeout(timeout);
                    setIsOpenDate(true);
                  }}
                  onMouseLeave={() => {
                    timeout = setTimeout(() => setIsOpenDate(false), 200); // delay 200ms
                  }}
                >
                  <button
                    type="button"
                    className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-red-gvi rounded-e-lg border border-red-600 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 cursor-pointer"
                    title="Date"
                    onClick={handleClick}
                  >
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="w-4 h-4 text-gray-100"
                    />
                    <span className="sr-only">Date</span>
                  </button>
                  {isOpenDate && (
                    <div className="absolute top-full mt-2 right-0 z-50 bg-white shadow-lg rounded">
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleChange}
                        minDate={new Date()}
                        inline
                        className="p-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Modal */}
      {selectModal == "Currency" && (
        <ModalComponent title="Currency" icon={faMoneyCheckDollar}>
          {/* <CurrencyContent currencies={currencyMaster} /> */}
          <CurrencyContent currencies={masterCurrency} />
        </ModalComponent>
      )}

      {selectModal == "Language" && (
        <ModalComponent title="Language" icon={faGlobe}>
          {/* <LanguageContent languages={languageMaster} /> */}
          <LanguageContent languages={masterLanguage} />
        </ModalComponent>
      )}

      {selectModal == "Sign In" && (
        <ModalComponent title="Sign In" icon={faUser}>
          {/* <LanguageContent languages={languageMaster} /> */}
          <SignInContent />
        </ModalComponent>
      )}

      {/* watcher param */}
      <Suspense fallback={null}>
        <CountryWatcher setSelectedCategory={setSelectedCategory} />
      </Suspense>
    </nav>
  );
}

function IconItem({
  icon,
  label,
  link = "#",
}: {
  icon: IconDefinition;
  label: string;
  link?: string;
}) {
  return (
    <Link href={link}>
      <div className="flex flex-col items-center">
        <FontAwesomeIcon icon={icon} className="text-2xl text-gray-500" />
        <span className="text-xs text-gray-500 mt-1">{label}</span>
      </div>
    </Link>
  );
}

function IconItemCartWish({
  icon,
  label,
  link = "#",
  badgeCount,
}: {
  icon: IconDefinition;
  label: string;
  link?: string;
  badgeCount: number;
}) {
  return (
    <Link href={link}>
      <div className="flex flex-col items-center relative w-fit">
        <div className="relative">
          <FontAwesomeIcon
            icon={icon}
            className="text-2xl text-gray-500 hover:text-red-500"
          />
          {badgeCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {badgeCount}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
    </Link>
  );
}

const CurrencyContent = ({
  currencies = [],
}: {
  currencies: { Currency: string }[];
}) => {
  const { closeModal } = useModal();
  const { currency, setCurrency } = useCurrency();
  return (
    <ul className="space-y-3 list-none">
      {currencies.map((item, index) => (
        <li
          key={index}
          className={`${
            currency === item.Currency ? "bg-gray-200" : ""
          } text-base leading-relaxed text-gray-500 hover:bg-gray-100 hover:text-gray-800 p-2 rounded-lg cursor-pointer`}
          onClick={() => {
            setCurrency(item.Currency);
            localStorage.setItem("currency", item.Currency); // simpan ke localStorage
            closeModal();
          }}
        >
          <div className="flex justify-between items-center">
            <span>{item.Currency}</span>
            {currency === item.Currency && (
              <FontAwesomeIcon
                icon={faCheck}
                className="text-lg text-green-500"
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

const LanguageContent = ({
  languages = [],
}: {
  languages: { MSLanguage: string }[];
}) => {
  const { closeModal } = useModal();
  const { language, setLanguage } = useLanguage();

  return (
    <ul className="space-y-3 list-none">
      {languages.map((item, index) => (
        <li
          key={index}
          className={`${
            language === item.MSLanguage ? "bg-gray-200" : ""
          } text-base leading-relaxed text-gray-500 hover:bg-gray-100 hover:text-gray-800 p-2 rounded-lg cursor-pointer`}
          onClick={() => {
            setLanguage(item.MSLanguage);
            localStorage.setItem("language", item.MSLanguage); // simpan ke localStorage
            closeModal();
          }}
        >
          <div className="flex justify-between items-center">
            <span>{item.MSLanguage}</span>
            {language === item.MSLanguage && (
              <FontAwesomeIcon
                icon={faCheck}
                className="text-lg text-green-500"
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

const SignInContent = () => {
  const { closeModal } = useModal();

  return (
    <div>
      <form className="max-w-sm mx-auto">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@flowbite.com"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300"
              required
            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            Remember me
          </label>
        </div>

        {/* tombol submit biasa */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        >
          Sign In
        </button>

        {/* separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* tombol login dengan google */}
        <button
          type="button"
          onClick={() => {
            signIn("google");
            // sessionStorage.setItem("oauth", "true");
          }}
          className="flex items-center justify-center w-full px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        {/* link ke sign up */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};
