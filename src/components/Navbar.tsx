"use client";
// State
import { useState } from "react";
// Next Image
import Image from "next/image";
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
  faShoppingCart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a
          href="/home"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="/images/logo/gvi-logo-removebg-slim.svg"
            alt="GVI logo"
            width={180}
            height={38}
            priority
          />
        </a>

        {/* Search */}
        <form className="max-w-xl w-full mx-auto hidden md:block">
          <div className="flex">
            <button
              id="dropdown-button"
              data-dropdown-toggle="dropdown"
              className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
              type="button"
            >
              All categories{" "}
              <span className="ml-2">
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="w-4 h-4 text-gray-600"
                />
              </span>
            </button>
            <div
              id="dropdown"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 "
            >
              <ul
                className="py-2 text-sm text-gray-700 "
                aria-labelledby="dropdown-button"
              >
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Mockups
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Templates
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Design
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Logos
                  </button>
                </li>
              </ul>
            </div>

            <div className="relative w-full">
              <input
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Search your destinations..."
                required
              />
              <button
                type="submit"
                className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-red-800 rounded-e-lg border border-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 "
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

        {/* Icon */}
        <div className="relative">
          {/* Desktop/Tablet: Show full icon menu */}
          <div className="hidden lg:flex gap-6 p-2 rounded-xl">
            <IconItem icon={faDollarSign} label="ID/IDR RP" />
            <IconItem icon={faHeart} label="WISHLIST" />
            <IconItem icon={faShoppingCart} label="CART" />
            <IconItem icon={faUser} label="PROFILE" />
          </div>

          {/* Mobile: Show burger menu */}
          <div className="flex lg:hidden items-center">
            <FontAwesomeIcon
              icon={faBars}
              className="text-2xl text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>

          {/* Dropdown for burger */}
          {isOpen && (
            <div className="absolute top-10 left-0 bg-white shadow-md p-4 rounded-xl w-40 z-50 flex flex-col gap-4">
              <IconItem icon={faDollarSign} label="ID/IDR RP" />
              <IconItem icon={faHeart} label="WISHLIST" />
              <IconItem icon={faShoppingCart} label="CART" />
              <IconItem icon={faUser} label="PROFILE" />
            </div>
          )}
        </div>

        {/* Search */}
        <form className="max-w-xl w-full mx-auto md:hidden">
          <div className="flex">
            <button
              id="dropdown-button"
              data-dropdown-toggle="dropdown"
              className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
              type="button"
            >
              All categories{" "}
              <span className="ml-2">
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="w-4 h-4 text-gray-600"
                />
              </span>
            </button>
            <div
              id="dropdown"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 "
            >
              <ul
                className="py-2 text-sm text-gray-700 "
                aria-labelledby="dropdown-button"
              >
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Mockups
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Templates
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Design
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Logos
                  </button>
                </li>
              </ul>
            </div>

            <div className="relative w-full">
              <input
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Search your destinations..."
                required
              />
              <button
                type="submit"
                className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-red-800 rounded-e-lg border border-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 "
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
      </div>
    </nav>
  );
}

function IconItem({ icon, label }: { icon: IconDefinition; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <FontAwesomeIcon icon={icon} className="text-2xl text-gray-500" />
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}
