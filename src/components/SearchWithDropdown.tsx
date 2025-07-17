"use client";
// State
import { useState, useEffect, useRef } from "react";
import React from "react";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
// Helper
import { capitalizeWords, truncateText } from "@/helper/helper"; // sesuaikan path
import SearchWithDropdownAsyncSelect from "./SearchWithDropdownAsyncSelect";

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
          {/* <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-red-500 focus:border-red-500 "
            placeholder={`Search your destinations in ${country} ...`}
            required
          /> */}
          <SearchWithDropdownAsyncSelect />
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
  );
};

export default Search;
