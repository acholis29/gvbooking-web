// components/CardAccordion.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faChevronDown,
  faEdit,
  faTrash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

type CardAccordionProps = {
  bgColor?: string;
  textColor?: string;
  title?: string;
};

const CardAccordion: React.FC<CardAccordionProps> = ({
  bgColor = "bg-gray-500",
  textColor = "text-white",
  title = "Badge",
}) => {
  const [isOpenAccordion, setAccordion] = useState(false);
  return (
    <div
      className="relative md:max-w-3xl mb-4"
      onClick={() => {
        // aksi untuk toggle accordion
        console.log("toggle accordion");
        setAccordion(!isOpenAccordion);
      }}
    >
      {/* Tombol pojok kanan atas */}
      <button
        className="absolute top-2 right-2 z-10  text-white text-sm px-1 py-1 rounded hover:bg-gray-100"
        onClick={() => {
          // aksi untuk toggle accordion
          console.log("toggle accordion");
          setAccordion(!isOpenAccordion);
        }}
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className="w-10 h-10 text-gray-500"
          size="lg"
        />
      </button>
      <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
        <div className="flex items-center flex-row">
          <img
            className="object-cover w-full rounded-tl-sm h-96 md:h-auto md:w-48"
            src="/images/destination/indonesia.jpg"
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              NUSA PENIDAS OUTKUTSE
            </h5>
            <div className="flex flex-row"></div>
            <p className="mb-3 font-normal text-gray-700 ">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
          </div>
        </div>
        <div className="flex flex-row space-x-4 w-full bg-gray-100">
          <div className="basis-1/4 grow p-4 text-left">
            <p className="text-black text-sm font-bold">SUB TOTAL</p>
            <p className="text-red-700 text-sm font-semibold">IDR 2.000.000</p>
          </div>
          <div className="basis-3/8 grow p-4 text-left">
            <p className="text-black text-sm font-bold">DISC</p>
            <p className="text-red-700 text-sm font-semibold">3.00</p>
          </div>
          <div className="basis-3/8 grow p-4 text-left">
            <p className="text-black text-sm font-bold">TOTAL</p>
            <p className="text-red-700 text-sm font-semibold">2.000.000</p>
          </div>
        </div>
        <div
          className={`${isOpenAccordion ? "flex flex-row" : "hidden"} w-full`}
        >
          <div className="w-[5%] py-4 text-left">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="w-10 h-10 text-gray-500"
              size="sm"
            />
          </div>
          <div className="w-[95%] p-4  text-left">
            <p className="text-black text-xs font-bold">Pickup date</p>
            <p className="text-black text-xs">Sunday, 30 July 2025</p>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <p className="text-black text-xs font-bold">Adult</p>
            <p className="text-black text-xs">1 Adult</p>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <p className="text-black text-xs font-bold">Room Number</p>
            <p className="text-black text-xs">1 Child</p>
            <hr className="my-2 border border-gray-400 opacity-50" />
          </div>
        </div>
        <div
          className={`${isOpenAccordion ? "flex flex-row" : "hidden"} w-full`}
        >
          <div className="w-[5%] py-4  text-left">
            <FontAwesomeIcon
              icon={faUsers}
              className="w-10 h-10 text-gray-500"
              size="sm"
            />
          </div>
          <div className="w-[95%] p-4  text-left">
            <p className="text-black text-xs font-bold">Traveler</p>
            <p className="text-black text-xs font-bold">1 Person</p>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <div className="flex flex-row justify-between">
              <p className="text-black text-xs">1 Adult</p>
              <p className="text-black text-xs font-bold">IDR 0.00</p>
            </div>
            <hr className="my-2 border border-gray-400 opacity-50" />
            <div className="flex flex-row justify-between">
              <p className="text-black text-xs">1 Service</p>
              <p className="text-black text-xs font-bold">IDR 2.000.000.00</p>
            </div>
            <hr className="my-2 border border-gray-400 opacity-50" />
          </div>
        </div>
        <div
          className={`${isOpenAccordion ? "flex flex-row" : "hidden"} w-full`}
        >
          <div className="w-[5%] py-4  text-left"></div>
          <div className="w-[95%] p-4  flex flex-row justify-start items-center gap-3">
            <a href="#" className="flex flex-row items-center gap-2 group">
              <FontAwesomeIcon
                icon={faTrash}
                className="w-5 h-5 text-gray-500 group-hover:text-red-700"
                size="sm"
              />
              <p className="text-gray-600 text-sm group-hover:text-red-700">
                Remove
              </p>
            </a>
            <a href="#" className="flex flex-row items-center gap-2 group">
              <FontAwesomeIcon
                icon={faEdit}
                className="w-5 h-5 text-gray-500 group-hover:text-red-700"
                size="sm"
              />
              <p className="text-gray-600 text-sm group-hover:text-red-700">
                Change
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAccordion;
