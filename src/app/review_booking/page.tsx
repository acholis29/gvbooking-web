"use client";
import { useEffect, useState } from "react";
import SkeletonCardHorizontal from "@/components/SkeletonCardHorizontal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/Breadcrumb";
import ReviewBookingCard from "@/components/ReviewBookingCard";

type ReviewBookingItem = {
  idx_comp: string;
  idx_excursion: string;
  image: string;
  title: string;
  sub_title: string;
  price: string;
  currency?: string;
  link?: string; // optional
};

export default function ReviewBooking() {
  // State Data Detail Destination
  const [ListReviewBooking, setReviewBooking] = useState<ReviewBookingItem[]>(
    []
  );

  // State Data Loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviewBooking();
  }, []); // tetap kosong, agar hanya dijalankan sekali saat mount

  function loadReviewBooking() {
    const review_booking = JSON.parse(
      localStorage.getItem("review_booking") || "[]"
    );
    setReviewBooking(review_booking);
    setIsLoading(false);
  }

  return (
    // Cart Page
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="Review Booking" />
      <h1 className="text-gray-500 px-6 pt-6 text-2xl font-bold">
        REVIEW BOOKING
      </h1>
      <section className="flex flex-col md:flex-row p-6 bg-white gap-1">
        {/* Konten Kiri */}
        <div className="md:w-full text-gray-700">
          <ReviewBookingCard
            key={1}
            idx_comp={"asas"}
            idx_excursion={"asas"}
            image="/images/destination/tanah-lot/tanah-lot6.jpg"
            title={"TANAH LOT, BALI INDONESIA"}
            sub_title_1={"Pickup Sanur Beach Hotel"}
            sub_title_2={"Room 132 Lt 2"}
            adult={"2"}
            child={"1"}
            infant={"0"}
            link="/cart"
            currency={`EURO`}
            price={`1202`}
            onDelete={loadReviewBooking} // ✅ ini dikirim ke anak
          />

          {/* Table Surgery */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-l md:max-w-3xl">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    # Surcharge
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white  hover:bg-gray-100 ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    <input
                      id="helper-radio"
                      aria-describedby="helper-radio-text"
                      type="radio"
                      value=""
                      className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2 "
                    />
                    <label
                      htmlFor="helper-radio"
                      className="w-full py-4 ms-2 text-sm font-medium text-gray-900 "
                    >
                      Guide Surcharge
                    </label>
                  </th>
                  <td className="px-6 py-4">$200</td>
                </tr>
                <tr className="bg-white  hover:bg-gray-100 ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    <input
                      id="helper-radio"
                      aria-describedby="helper-radio-text"
                      type="radio"
                      value=""
                      className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2 "
                    />
                    <label
                      htmlFor="helper-radio"
                      className="w-full py-4 ms-2 text-sm font-medium text-gray-900 "
                    >
                      Guide Surcharge
                    </label>
                  </th>
                  <td className="px-6 py-4">$200</td>
                </tr>
                <tr className="bg-white  hover:bg-gray-100 ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    <input
                      id="helper-radio"
                      aria-describedby="helper-radio-text"
                      type="radio"
                      value=""
                      className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2 "
                    />
                    <label
                      htmlFor="helper-radio"
                      className="w-full py-4 ms-2 text-sm font-medium text-gray-900 "
                    >
                      Guide Surcharge
                    </label>
                  </th>
                  <td className="px-6 py-4">$200</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Text Area Note */}
          <div className="md:max-w-3xl my-3">
            <label
              htmlFor="message"
              className="block mb-2 text-sm text-gray-500 font-semibold"
            >
              Special Note
            </label>
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Write your note here..."
            ></textarea>
          </div>

          <div className="md:max-w-3xl flex h-20 w-full bg-gray-200 mt-15 rounded-sm">
            <div className="basis-[60%] flex flex-col items-start justify-center pl-3">
              {/* Kolom 1 (60%) */}
              <p className="font-semibold text-gray-700">Total</p>
              <p className="font-bold text-gray-800">IDR 1.200.000</p>
            </div>
            <div className="basis-[20%] flex items-center justify-center">
              {/* Kolom 2 (20%) */}
              <button
                type="button"
                className="text-gray-700 font-bold  shadow-2xl bg-amber-300 w-full hover:bg-amber-400 focus:ring-4 focus:ring-amber-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
              >
                Add Cart
              </button>
            </div>
            <div className="basis-[20%]  flex items-center justify-center">
              {/* Kolom 3 (20%) */}
              <button
                type="button"
                className="text-white font-bold shadow-2xl bg-red-700 w-full hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
              >
                Payment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
