// components/HorizontalCard.tsx
import React, { useEffect, useState } from "react";
// Font Awesome
import { faClock, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// State Global / Context
import { useCart } from "@/context/CartContext";
// Link Href
import Link from "next/link";

type ReviewBookingCardProps = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title_1: string;
  sub_title_2: string;
  sub_title_3: string;
  pickup_time_from: string;
  adult: string;
  child: string;
  infant: string;
  onRoomChange: (value: string) => void; // Ubah ini
  onTimeChange: (value: string) => void; // Ubah ini
};

const ReviewBookingCard: React.FC<ReviewBookingCardProps> = ({
  idx_comp,
  idx_excursion,
  image,
  title,
  sub_title_1,
  sub_title_2,
  sub_title_3,
  pickup_time_from,
  adult,
  child,
  infant,
  onRoomChange,
  onTimeChange,
}) => {
  const { addToCart, removeFromCart } = useCart();
  const [pickupTimeFrom, setPickupTimeFrom] = useState<string>(
    pickup_time_from || ""
  );

  useEffect(() => {
    setPickupTimeFrom(pickup_time_from ?? "");
  }, [pickup_time_from]);

  return (
    <div className="relative w-full flex flex-row items-start bg-white border border-gray-200 rounded-lg shadow-sm md:max-w-3xl hover:bg-gray-100 mb-3">
      <img
        className="w-30 h-35 p-2 object-cover rounded-2xl"
        src={image}
        alt={image}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/images/icon/android-chrome-512x512.png";
        }}
      />

      <div className="flex flex-col w-full p-2 leading-normal">
        <h5 className="mb-2 text-sm md:text-lg font-bold tracking-tight text-gray-900">
          {title}
        </h5>
        <p className="text-xs md:text-md font-semibold text-gray-700">
          {sub_title_1}
        </p>
        <p className="text-xs md:text-md font-semibold text-gray-700">
          {sub_title_2}
        </p>
        <input
          type="text"
          defaultValue={"Lobby"}
          className="text-gray-600 text-sm border-gray-300 w-full h-8 bg-gray-100 rounded-md mt-2 focus:outline-none focus:ring-0 focus:border-blue-300 focus:border-2"
          placeholder="Room number (optional)..."
          onChange={(e) => onRoomChange(e.target.value)}
        />
        <div className="relative">
          <div className="absolute inset-y-0 end-20 md:end-48 top-2 flex items-center pe-3.5 pointer-events-none">
            <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-600" />{" "}
          </div>
          <input
            type="time"
            id="time"
            value={pickupTimeFrom}
            onChange={(e) => {
              setPickupTimeFrom(e.target.value);
              onTimeChange(e.target.value);
            }}
            className="text-gray-600 text-sm border-gray-300 w-30 h-8 bg-gray-100 rounded-md mt-2 focus:outline-none focus:ring-0 focus:border-blue-300 focus:border-2"
            required
            disabled={
              pickup_time_from == "00:00" || pickup_time_from == ""
                ? false
                : true
            }
          />
        </div>
      </div>
      <div className="hidden md:flex flex-row w-full p-2 leading-normal my-auto"></div>
      {/* <div className="flex flex-row w-full p-2 leading-normal my-auto">
        <div className="">
          {adult != "" && (
            <div className="text-xs md:text-md font-semibold text-gray-700 mb-2">
              <FontAwesomeIcon
                icon={faUsers}
                className="w-4 h-4 text-gray-600"
              />{" "}
              <div className="px-2 inline-block w-13">Adult</div>x{" "}
              <span className="ml-2">{adult}</span>
            </div>
          )}

          {child != "" && (
            <div className="text-xs md:text-md font-semibold text-gray-700 mb-2">
              <FontAwesomeIcon
                icon={faUsers}
                className="w-4 h-4 text-gray-600"
              />{" "}
              <div className="px-2 inline-block w-13">Child</div>x{" "}
              <span className="ml-2">{child}</span>
            </div>
          )}

          {infant != "" && (
            <div className="text-xs md:text-md font-semibold text-gray-700 mb-2">
              <FontAwesomeIcon
                icon={faUsers}
                className="w-4 h-4 text-gray-600"
              />{" "}
              <div className="px-2 inline-block w-13">Infant</div>x{" "}
              <span className="ml-2">{infant}</span>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default ReviewBookingCard;
