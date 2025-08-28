// components/DestinationCard.tsx
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useCartApi } from "@/context/CartApiContext";
import Swal from "sweetalert2";

type DestinationCardProps = {
  image: string;
  title: string;
  activities: string;
  link?: string; // optional
};

const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  title,
  activities,
  link = "#",
}) => {
  // Redirect
  const router = useRouter();
  // Cart API Counter
  const { cartApiCount } = useCartApi();

  return (
    // <Link href={link} className="block group">
    <div
      className="block group"
      onClick={() => {
        if (cartApiCount > 0) {
          Swal.fire({
            title: "Are you sure?",
            text: "Your cart is not finished!",
            icon: "warning",
            showCancelButton: false,
            showDenyButton: true,
            confirmButtonColor: "#ef4444", // red-500
            denyButtonColor: "#6b7280", // gray-500
            confirmButtonText: "Payment",
            denyButtonText: "Back To Cart",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Payment",
                text: "Your file has been deleted.",
                icon: "success",
              });
            } else if (result.isDenied) {
              router.push("/cart");
            }
          });
        } else {
          router.push(link);
        }
      }}
    >
      <div className="relative shrink-0 md:shrink h-48 w-72 md:w-full rounded-xl overflow-hidden shadow-lg">
        <img
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-150"
          src={image}
          alt={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/images/icon/android-chrome-512x512.png";
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-4">
          <h3
            className="text-white text-lg font-bold uppercase truncate"
            title={title}
          >
            {title}
          </h3>
          <p className="text-white text-sm font-bold">
            {activities} Activities
          </p>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};

export default DestinationCard;
