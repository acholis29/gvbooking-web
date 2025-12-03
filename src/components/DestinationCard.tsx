// components/DestinationCard.tsx
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartApi } from "@/context/CartApiContext";
import Swal from "sweetalert2";
import Image from "next/image";
import { safeSrc, sanitizeImage } from "@/helper/helper";

type DestinationCardProps = {
  image: string;
  title: string;
  activities: string;
  idx_comp: string;
  link?: string; // optional
};

const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  title,
  activities,
  idx_comp,
  link = "#",
}) => {
  // Redirect
  const router = useRouter();
  // Cart API Counter
  const { cartApiCount, idxCompCart } = useCartApi();
  // Image
  const [imgSrc, setImgSrc] = useState(sanitizeImage(safeSrc(image)));
  const [hasError, setHasError] = useState(false);

  return (
    // <Link href={link} className="block group">
    <div
      className="block group cursor-pointer"
      onClick={() => {
        if (cartApiCount > 0 && idx_comp != idxCompCart) {
          Swal.fire({
            title: "You still have items in your cart.",
            text: "Please complete your booking or empty your cart before continuing.",
            icon: "warning",
            showCancelButton: false,
            showDenyButton: false,
            confirmButtonColor: "#ef4444", // red-500
            denyButtonColor: "#6b7280", // gray-500
            confirmButtonText: "Go To Cart",
            // denyButtonText: "Back To Cart",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/cart");
              // Swal.fire({
              //   title: "Payment",
              //   text: "Your file has been deleted.",
              //   icon: "success",
              // });
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
        <div className="relative w-full h-full">
          <Image
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-150"
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 260px, 25vw"
            // onError={(e) => {
            //   const target = e.target as HTMLImageElement;
            //   target.onerror = null;
            //   target.src = "/images/icon/android-chrome-512x512.png";
            // }}
            onError={() => {
              if (!hasError) {
                setHasError(true);
                setImgSrc("/images/icon/android-chrome-512x512.png");
              }
            }}
          />
        </div>
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
