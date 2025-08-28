"use client";
// DrawerComponent.tsx
// Hooks
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
// Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronDown,
  faClose,
  faDollar,
  faGear,
  faGlobe,
  faHeart,
  faMoneyCheckDollar,
  faShoppingCart,
  faSign,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
// Context State Global
import { useCart } from "@/context/CartContext";
import { useCartApi } from "@/context/CartApiContext";
import { useWish } from "@/context/WishContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useModal } from "@/context/ModalContext";
import { useLanguage } from "@/context/LanguageContext";
import { useProfile } from "@/context/ProfileContext";
// Component
import ModalComponent from "./ModalComponent";
// Helper
import { capitalizeWords } from "@/helper/helper";

export default function DrawerComponent({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Cart Counter
  const { cartCount } = useCart();
  const { cartApiCount } = useCartApi();
  const { wishCount } = useWish();
  // Currency
  const { currency, setCurrency, masterCurrency, setMasterCurrency } =
    useCurrency();
  // Language
  const { language, setLanguage, masterLanguage, setMasterLanguage } =
    useLanguage();
  // Profile
  const { profile, setProfile } = useProfile();

  const [isDropdownProfilOpen, setDropdownProfilOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  // Modal
  const { openModal } = useModal();
  const [menuSelected, setMenuSelected] = useState("");
  const pathname = usePathname();
  const hideCartIcon = pathname === "/" || pathname === "/home";

  useEffect(() => {
    fetch("/api/currency", {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
      .finally(() => {
        console.log(masterLanguage);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const savedProfileData = localStorage.getItem("profileData");
    if (savedProfileData) {
      const parsedData = JSON.parse(savedProfileData);
      setFirstName(parsedData.firstname);
    }
  }, [profile]);

  return (
    <>
      <div
        id="drawer-navigation"
        // className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-64 "
        className="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-64 "
        tabIndex={-1}
        aria-labelledby="drawer-navigation-label"
      >
        <h5
          id="drawer-navigation-label"
          className="text-base font-semibold text-gray-500 uppercase "
        >
          Menu
        </h5>
        <button
          type="button"
          data-drawer-hide="drawer-navigation"
          aria-controls="drawer-navigation"
          className="text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center "
          onClick={() => {
            const drawer = document.getElementById("drawer-navigation");
            // if (drawer) drawer.classList.add("-translate-x-full");
            if (drawer) drawer.classList.add("translate-x-full");
          }}
        >
          <FontAwesomeIcon
            icon={faClose}
            className="w-5 h-5 text-xl text-gray-400"
          />
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
                aria-controls="dropdown-example"
                data-collapse-toggle="dropdown-example"
                onClick={() => {
                  setDropdownProfilOpen(!isDropdownProfilOpen);
                }}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-5 h-5 text-xl text-gray-400"
                />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap text-gray-500">
                  {firstName == "" ? "Profile" : capitalizeWords(firstName)}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="w-5 h-5 text-md text-gray-400"
                />
              </button>

              <ul
                id="dropdown-example"
                className={`${
                  isDropdownProfilOpen ? "block" : "hidden"
                } py-2 space-y-2`}
              >
                <li>
                  <a
                    href="/profile"
                    onClick={() => {
                      openModal(); // ⬅️ Ini akan memunculkan modal
                      setMenuSelected(`SignIn`);
                    }}
                    className="flex items-center w-full p-2 text-gray-500 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 "
                  >
                    <FontAwesomeIcon
                      icon={faGear}
                      className="w-5 h-5 text-sm text-gray-400"
                    />{" "}
                    Options
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      openModal(); // ⬅️ Ini akan memunculkan modal
                      setMenuSelected(`Currency`);
                    }}
                    className="flex items-center w-full p-2 text-gray-500 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 "
                  >
                    <FontAwesomeIcon
                      icon={faDollar}
                      className="w-5 h-5 text-sm text-gray-400"
                    />{" "}
                    Currency
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      openModal(); // ⬅️ Ini akan memunculkan modal
                      setMenuSelected(`Language`);
                    }}
                    className="flex items-center w-full p-2 text-gray-500 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 "
                  >
                    <FontAwesomeIcon
                      icon={faGlobe}
                      className="w-5 h-5 text-sm text-gray-400"
                    />{" "}
                    Language
                  </a>
                </li>
              </ul>
            </li>
            {!hideCartIcon && (
              <li>
                <Link
                  href="/cart"
                  className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                  onClick={() => {
                    const drawer = document.getElementById("drawer-navigation");
                    if (drawer) drawer.classList.add("translate-x-full");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="w-5 h-5 text-lg text-gray-400"
                  />
                  <span className="flex-1 ms-3 text-gray-500 whitespace-nowrap">
                    Cart
                  </span>
                  {cartApiCount > 0 && (
                    <span className="inline-flex items-center text-white justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-white-800 bg-red-gvi rounded-full">
                      {cartApiCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            <li>
              <Link
                href="/wishlist"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                onClick={() => {
                  const drawer = document.getElementById("drawer-navigation");
                  if (drawer) drawer.classList.add("translate-x-full");
                }}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className="w-5 h-5 text-lg text-gray-400"
                />
                <span className="flex-1 ms-3 text-gray-500 whitespace-nowrap">
                  Wishlist
                </span>
                {wishCount > 0 && (
                  <span className="inline-flex items-center text-white justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-white-800 bg-red-gvi rounded-full">
                    {wishCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                onClick={() => {
                  const drawer = document.getElementById("drawer-navigation");
                  if (drawer) drawer.classList.add("translate-x-full");
                }}
              >
                <FontAwesomeIcon
                  icon={faSign}
                  className="w-5 h-5 text-lg text-gray-400"
                />
                <span className="flex-1 ms-3 text-gray-500 whitespace-nowrap">
                  Sign Up
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {menuSelected == "Currency" && (
        <ModalComponent title="Currency" icon={faMoneyCheckDollar}>
          {/* <CurrencyContent /> */}
          <CurrencyContent currencies={masterCurrency} />
        </ModalComponent>
      )}

      {menuSelected == "Language" && (
        <ModalComponent title="Language" icon={faMoneyCheckDollar}>
          {/* <LanguageContent /> */}
          <LanguageContent languages={masterLanguage} />
        </ModalComponent>
      )}
    </>
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
