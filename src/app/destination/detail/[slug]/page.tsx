"use client";
// State
import { useState, useEffect, useRef } from "react";

import Galery from "@/components/Galery";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
export default function DetailDestination() {
  const [isDropdownPersonOpen, setDropdownPersonOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ❗ Detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownPersonOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* Baris Title */}
      <div className="flex flex-row justify-between items-center mt-4">
        <div className="text-gray-700 w-1/2">
          <h3 className="text-xl md:text-5xl font-bold">TANAH LOT, BALI</h3>
          <p className="text-sm md:font-semibold">
            Beraban, Kediri, Kabupaten Tabanan, Bali
          </p>
        </div>
        <div className="text-gray-700 w-1/2">
          <h3 className="text-small md:text-4xl font-semibold md:font-bold text-right">
            07:00 - 19:00 WITA
          </h3>
        </div>
      </div>
      {/* Baris Galery */}
      <Galery />
      {/* Baris Content */}
      <div className="flex flex-col md:flex-row pb-5 gap-5">
        {/* Kontent Kiri */}
        <div className="order-2 md:order-1 w-full md:flex-[5] text-gray-600">
          <p className="font-bold text-lg">
            The Legendary Charm of Tanah Lot Temple: Bali's Eternal Wonder
          </p>
          <p>
            Welcome to Tanah Lot, one of Bali’s most stunning icons! Perched on
            a giant rock formation in the middle of the sea, Tanah Lot Temple is
            a natural and spiritual masterpiece that is not only a feast for the
            eyes but also a soothing place for the soul. This destination is a
            must-visit for every traveler who wants to experience the true
            mystical beauty of Bali. This temple is not only famous for its
            legendary sunset views, where the silhouette of the temple looks so
            dramatic amidst the orange twilight, but also for its spiritual
            stories and unique culture. When the tide is high, the temple looks
            like a floating island, adding a magical touch to the landscape.
            When the tide is low, visitors can get close to the temple and feel
            its spiritual energy firsthand.
          </p>
          <br />
          <p>
            This temple is not only famous for its legendary sunset views, where
            the silhouette of the temple looks so dramatic amidst the orange
            twilight, but also for its spiritual stories and unique culture.
            When the tide is high, the temple looks like a floating island,
            adding a magical touch to the landscape. When the tide is low,
            visitors can get close to the temple and feel its spiritual energy
            firsthand.
          </p>
          {/* About Activity */}
          <p className="font-bold text-lg mt-3">About this activity</p>
          <div className="border p-3 rounded-2xl w-full md:w-1/2">
            <p className="font-bold text-lg">Order now and pay later</p>
            <p>
              Keep your travel plans flexible - book your place and pay nothing
              today.
            </p>
            <p className="font-bold text-lg">Free cancellation</p>
            <p>
              Cancel up to 24 hours before the activity starts for a full
              refund.
            </p>
            <p className="font-bold text-lg">Duration 3 - 4 hours</p>
            <p>Check availability to see start times.</p>
            <p className="font-bold text-lg">Live tour guide</p>
            <p>English</p>
          </div>

          <p className="font-bold text-lg mt-3">Destination</p>
          <div className="w-full md:w-1/2">
            <p>
              <span className="font-bold">
                Witnessing the Beauty of Sunset:
              </span>
              Don't miss the stunning sunset moment. Find the best spot in the
              cliff area or the surrounding coffee shops to enjoy this
              unforgettable view.
            </p>
            <br />
            <p>
              <span className="font-bold">Visiting Batu Bolong Temple:</span>
              Just a few steps from Tanah Lot, you will find Pura Batu Bolong, a
              small temple with a hole at the bottom, which also offers
              beautiful sea views.
            </p>
            <br />
            <p>
              <span className="font-bold">
                Interacting with the Sacred Snake:
              </span>
              In the lower coral area, there is a small cave inhabited by sacred
              sea snakes. You can touch them (with a guide) and it is believed
              to bring good luck.
            </p>
          </div>
        </div>
        {/* Kontent Kanan */}
        <div className="order-1 md:order-2 w-full md:flex-[1] text-gray-600">
          <div className="border p-3 rounded-2xl">
            <p className="font-bold text-lg">FROM</p>
            <p>
              <span className="font-bold text-2xl">IDR 1.234.567 /</span>{" "}
              <small>PERSON</small>
            </p>
          </div>
          <div className="border p-3 rounded-2xl mt-3 bg-gray-600">
            <p className="font-bold text-lg text-center text-white">
              Select date and participants
            </p>
            <div className="flex justify-between gap-2">
              {/* date */}
              <div className="w-1/2">
                <input
                  type="date"
                  className="bg-white p-2 rounded-2xl w-full"
                />
              </div>
              {/* Dropdown */}
              <div className="w-1/2" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownPersonOpen(!isDropdownPersonOpen)}
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="dropdown"
                  className="w-40 rounded-2xl text-gray-600 bg-white hover:bg-gray-300 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
                  type="button"
                >
                  Persons {selectedPerson}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="w-4 h-4 text-gray-600"
                  />
                </button>

                {isDropdownPersonOpen && (
                  <div className="absolute z-20 bg-gray-400 divide-y divide-gray-100 rounded-lg shadow-sm w-50 mt-2">
                    <ul className="py-2 text-sm text-gray-700">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (num) => (
                          <li key={num}>
                            <button
                              onClick={() => {
                                setSelectedPerson(num.toString());
                                setDropdownPersonOpen(false);
                              }}
                              type="button"
                              className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                            >
                              {num} Person{num > 1 && "s"}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className="mt-3 w-full text-white bg-red-500 hover:bg-red-900 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              CHECK AVAILABALITY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
