"use client";
// State
import { useState, useEffect, useRef } from "react";
// Context State Global
import { useCart } from "@/context/CartContext";
import { useWish } from "@/context/WishContext";
// Next Image
import Image from "next/image";
// Drawer
import DrawerComponent from "@/components/Drawer";
// Path
import { usePathname } from "next/navigation";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  // faSearch,
  // faEllipsisV,
  faBars,
  faChevronDown,
  faDollarSign,
  faHeart,
  faSearch,
  faShoppingCart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
// Link Href
import Link from "next/link";

export default function NavbarComponent() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Destinations");

  const pathname = usePathname();
  const hideSearch = ["/list", "/cart", "/wishlist"].some((route) =>
    pathname.startsWith(route)
  );

  // Cart Counter
  const { cartCount } = useCart();
  // Wish Counter
  const { wishCount } = useWish();

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/home"
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
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                id="dropdown-button"
                data-dropdown-toggle="dropdown-category"
                className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 cursor-pointer"
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
                <div className="absolute z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 mt-11">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("All Destinations");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        All Destinations
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("Indonesia");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Indonesia
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("Thailand");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Thailand
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("Vietnam");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Vietnam
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("Cambodia");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Cambodia
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-red-500 focus:border-red-500 "
                  placeholder="Search your destinations..."
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-red-gvi rounded-e-lg border border-red-600 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 cursor-pointer "
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="w-4 h-4 text-gray-100"
                  />

                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Icon */}
        <div className="relative">
          {/* Desktop/Tablet: Show full icon menu */}
          <div className="hidden lg:flex gap-6 p-2 rounded-xl">
            <IconItem icon={faDollarSign} label="ID/IDR RP" />
            {/* <IconItem icon={faHeart} label="WISHLIST" /> */}
            <IconItemCartWish
              icon={faHeart}
              label="WISHLIST"
              link="/wishlist"
              badgeCount={wishCount}
            />
            <IconItemCartWish
              icon={faShoppingCart}
              label="CART"
              link="/cart"
              badgeCount={cartCount}
            />
            <IconItem icon={faUser} label="PROFILE" />
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
                if (drawer.classList.contains("-translate-x-full")) {
                  drawer.classList.remove("-translate-x-full");
                } else {
                  drawer.classList.add("-translate-x-full");
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
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                id="dropdown-button"
                data-dropdown-toggle="dropdown"
                className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
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
                <div className="absolute z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 mt-11">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("All Destinations");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                      >
                        All Destinations
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("Indonesia");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                      >
                        Indonesia
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("Template");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                      >
                        Templates
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("Design");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                      >
                        Design
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory("Logos");
                          setDropdownOpen(false);
                        }}
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                      >
                        Logos
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-red-500 focus:border-red-500 "
                  placeholder="Search your destinations..."
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-red-gvi rounded-e-lg border border-red-gvi hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 "
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>

                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
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
          <FontAwesomeIcon icon={icon} className="text-2xl text-gray-500" />
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
