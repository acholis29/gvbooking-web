"use client";
// State
import { useState, useEffect, useRef } from "react";
import React from "react";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendarDays,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
// Helper
import { capitalizeWords, truncateText } from "@/helper/helper"; // sesuaikan path
import SearchWithDropdownAsyncSelect from "./SearchWithDropdownAsyncSelect";
// Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Context Global
import { useDate } from "@/context/DateContext";

type SearchProps = {
  country?: string;
  idx_comp?: string;
  onChange: (value: string) => void;
  state: string;
};

type LocalDestinationItem = {
  idx_comp: string;
  Country: string;
  State: string;
  Name_excursion: string;
  qty: string;
};

const Search: React.FC<SearchProps> = ({
  country,
  idx_comp,
  onChange,
  state,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(`${state}`);
  const [localDestination, setLocalDestination] = useState<
    LocalDestinationItem[]
  >([]);

  // Date
  const { date, setDate } = useDate();
  // Timeout Delay
  let timeout: NodeJS.Timeout;
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

  useEffect(() => {
    fetch(`/api/excursion/local_destination/${idx_comp}`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setLocalDestination(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (state == "") {
      setSelectedCategory(`All ${country}`);
    }
  });

  const handleSelectState = (value: string) => {
    onChange(value); // kirim value ke parent
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    setIsOpenDate(!isOpenDate);
  };

  return (
    <form className="max-w-xl w-full mx-auto">
      <div className="flex">
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
          type="button"
        >
          {truncateText(selectedCategory, 20)}
          <span className="ml-2">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-4 h-4 text-gray-600"
            />
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-100 mt-11">
            <ul className="py-2 text-sm text-gray-700">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(`All ${country}`);
                    setDropdownOpen(false);
                    handleSelectState("");
                  }}
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                >
                  All {country}
                </button>
              </li>
              {localDestination.length > 0 ? (
                localDestination.map((item, index) => (
                  <li key={item.State}>
                    {/* Tambahkan key di sini */}
                    <button
                      onClick={() => {
                        setSelectedCategory(capitalizeWords(item.State));
                        setDropdownOpen(false);
                        handleSelectState(`${item.State}`);
                      }}
                      type="button"
                      className="inline-flex w-full px-4 py-2 hover:bg-gray-100 truncate"
                    >
                      {capitalizeWords(item.State)}
                    </button>
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </div>
        )}

        <div className="relative w-full">
          <SearchWithDropdownAsyncSelect />

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
  );
};

export default Search;
