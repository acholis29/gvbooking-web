"use client";
// State
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

// Link Href
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterComponent() {
  const [isDropdownLangOpen, setDropdownLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English (US)");
  const [selectedPathLang, setSelectedPathLang] = useState(
    "/images/flag/amerika.png"
  );

  const dropdownWrapperRef = useRef<HTMLDivElement>(null);

  // ✅ Tutup dropdown jika klik di luar wrapper
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownWrapperRef.current &&
        !dropdownWrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { name: "English (US)", flag: "amerika" },
    { name: "Germany", flag: "germany" },
    { name: "Indonesia", flag: "indonesia" },
    { name: "Thailand", flag: "thailand" },
    { name: "Vietnam", flag: "vietnam" },
    { name: "Srilangka", flag: "srilangka" },
    { name: "India", flag: "india" },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const hideSearch =
    pathname.startsWith("/cart") ||
    (pathname.startsWith("/review_booking") && isMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // anggap ≤768px sebagai mobile
    };

    handleResize(); // cek saat pertama kali render
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!hideSearch && (
        <footer className="bg-gray-100 pb-20">
          <div className="mx-auto w-full max-w-screen-xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 px-4 py-6 lg:py-8">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                  Help center
                </h2>
                <ul className="text-gray-900 font-medium">
                  <li className="mb-4">
                    <a
                      href="https://www.instagram.com/govacation.indonesia/?hl=en"
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="https://www.youtube.com/watch?v=YiiTcKbcIOk"
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Youtube
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="https://www.facebook.com/govacation.indonesia"
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </li>
                  <li className="mb-4">
                    <Link href="/contact_us" className="hover:underline">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                  Legal
                </h2>
                <ul className="text-gray-900  font-medium">
                  <li className="mb-4">
                    <a
                      href="/legal?m=privacy policy"
                      className="hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="/legal?m=licensing" className="hover:underline">
                      Licensing
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="/legal?m=terms and conditions"
                      className="hover:underline"
                    >
                      Terms &amp; Conditions
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                  Download
                </h2>
                <ul className="text-gray-900  font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      iOS
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Android
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex justify-start mt-4 gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.yourapp.package"
                  target="_blank"
                >
                  <Image
                    className="h-12"
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    width={250}
                    height={38}
                    priority
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.yourapp.package"
                  target="_blank"
                >
                  <Image
                    className="h-12"
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    width={260}
                    height={38}
                    priority
                  />
                </a>
              </div>
            </div>
            <hr className="text-gray-200" />
            <div className="px-4 py-6 bg-gray-100  md:flex md:items-center md:justify-between">
              <span className="text-sm text-gray-900">
                © {new Date().getFullYear()}{" "}
                <a href="https://go-vacation.com/" target="_blank">
                  GoVacation™
                </a>
                . All Rights Reserved. <br />
                <small className="italic text-gray-500">
                  Last update : 2025-12-08
                </small>
              </span>
              <div className="flex mt-4 justify-between items-center md:mt-0 space-x-5 rtl:space-x-reverse">
                <a
                  href="https://www.facebook.com/govacation.indonesia"
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 8 19"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Facebook page</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.083 1.5c.28 2.007 1.764 3.527 3.667 3.667v3.553a7.8 7.8 0 0 1-4.125-1.203v6.86a6.542 6.542 0 1 1-6.542-6.543c.29 0 .573.022.85.065v3.655a2.91 2.91 0 1 0 2.098 2.787V1.5h4.052Z" />
                  </svg>
                  <span className="sr-only">TikTok</span>
                </a>
                <a
                  href="https://www.youtube.com/watch?v=YiiTcKbcIOk"
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a2.997 2.997 0 0 0-2.112-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.386.566A2.997 2.997 0 0 0 .502 6.186 31.372 31.372 0 0 0 0 12a31.372 31.372 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.112 2.12C4.495 20.5 12 20.5 12 20.5s7.505 0 9.386-.566a2.997 2.997 0 0 0 2.112-2.12A31.372 31.372 0 0 0 24 12a31.372 31.372 0 0 0-.502-5.814ZM9.75 15.02V8.98l6 3.02-6 3.02Z" />
                  </svg>
                  <span className="sr-only">YouTube</span>
                </a>
                <a
                  href="https://www.instagram.com/govacation.indonesia/?hl=en"
                  className="text-gray-400 hover:text-pink-600 dark:hover:text-white"
                  aria-label="Instagram account"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5Zm8.5 1.5A4.25 4.25 0 0 1 20.5 7.75v8.5A4.25 4.25 0 0 1 16.25 20.5h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5h8.5ZM12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10Zm0 1.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7ZM17.5 6a1 1 0 1 0 0 2a1 1 0 0 0 0-2Z" />
                  </svg>
                  <span className="sr-only">Instagram account</span>
                </a>

                {/* <div ref={dropdownWrapperRef} className="relative">
                <button
                  onClick={() => setDropdownLangOpen(!isDropdownLangOpen)}
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="dropdown"
                  className="text-gray-900 bg-gray-200  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center cursor-pointer"
                  type="button"
                >
                  <img src={selectedPathLang} className="w-7 mr-2" alt="" />
                  {selectedLang}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="w-4 h-4 text-gray-600 pl-2"
                  />
                </button>
                {isDropdownLangOpen && (
                  <div className="absolute z-20 bg-gray-200 divide-y divide-gray-100 rounded-lg shadow-sm w-40 -mt-80">
                    <ul className="py-2 text-sm text-gray-700">
                      {languages.map(({ name, flag }) => (
                        <li key={flag}>
                          <button
                            onClick={() => {
                              setSelectedLang(name);
                              setSelectedPathLang(`/images/flag/${flag}.png`);
                              setDropdownLangOpen(false);
                            }}
                            type="button"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <img
                              src={`/images/flag/${flag}.png`}
                              className="w-7 mr-2"
                              alt={name}
                            />
                            {name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div> */}
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
