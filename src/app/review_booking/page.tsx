import { Suspense } from "react";
import ReviewBookingClient from "./ReviewBookingClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Review Booking...</div>}>
      <ReviewBookingClient />
    </Suspense>
  );
}
