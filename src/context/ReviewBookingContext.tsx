"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ReviewBooking = {
  idx_comp: string;
  exc_id: string;
  sub_exc_id: string;
  sub_exc_name: string;
  pickup_id: string;
  pickup_name: string;
  pickup_time_from: string;
  room: string;
  adult: string;
  child: string;
  infant: string;
  state: string;
  country: string;
  agent_id: string;
  rep_code: string;
  transaction_id: string;
  sub_exc_booking_date: string;
};

type ReviewBookingContextType = {
  reviewBookingObj: ReviewBooking | null;
  setReviewBookingObj: (reviewBooking: ReviewBooking) => void;
};

const ReviewBookingContext = createContext<
  ReviewBookingContextType | undefined
>(undefined);

export const ReviewBookingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reviewBookingObj, setReviewBookingObj] =
    useState<ReviewBooking | null>(null);

  return (
    <ReviewBookingContext.Provider
      value={{ reviewBookingObj, setReviewBookingObj }}
    >
      {children}
    </ReviewBookingContext.Provider>
  );
};

export const useReviewBooking = (): ReviewBookingContextType => {
  const context = useContext(ReviewBookingContext);
  if (!context)
    throw new Error(
      "useReviewBooking must be used within a ReviewBookingProvider"
    );
  return context;
};
