// import Image from "next/image";
"use client";

import { useEffect, useState } from "react";
import JumbotronComponent from "@/components/Jumbotron";
import DestinationCard from "@/components/DestinationCard";
import EcommersCard from "@/components/EcommersCard";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryEmpty,
  faCar,
  faHeart,
  faInbox,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
// Params Query
import { useSearchParams } from "next/navigation";
import SkeletonImage from "@/components/SkeletonImage";
import SkeletonCard from "@/components/SkeletonCard";

type Props = {
  slug: string;
};

type LocalDestinationItem = {
  idx_comp: string;
  Country: string;
  State: string;
  Name_excursion: string;
  qty: string;
};

type RecomendedDestinationItem = {
  idx_comp: string;
  Idx_excursion: string;
  Country: string;
  State: string;
  Name_excursion: string;
  Duration_Type: string;
  Holiday_Type: string;
  PriceFrom: string;
  Currency: string;
};

export default function DestinationClient({ slug }: Props) {
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //ini dari idx_comp_alias
  const country = searchParams.get("country"); //ini dari idx_comp_alias

  const [isLoadingDest, setIsLoadingDest] = useState(true);
  const [localDestination, setLocalDestination] = useState<
    LocalDestinationItem[]
  >([]);

  const [isLoadingRecom, setIsLoadingRecom] = useState(true);

  const [recomdedDestination, setRecomendedDestination] = useState<
    RecomendedDestinationItem[]
  >([]);

  useEffect(() => {
    fetch(`/api/excursion/local_destination/${idx_comp}`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("EXCUR:", data); // ← ini langsung array
        setLocalDestination(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoadingDest(false);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/excursion/recomended_destination/${idx_comp}`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("EXCUR:", data); // ← ini langsung array
        setRecomendedDestination(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoadingRecom(false);
      });
  }, []);

  return (
    // Destination Page
    <div>
      {/* Jumbotron */}
      <JumbotronComponent
        image={`/images/destination/${slug}.jpg`}
        destination={slug}
      />

      {/* Section Destination */}
      <section className="py-6 px-4 max-w-screen-xl mx-auto">
        <p className="text-red-gvi font-bold text-3xl mt-10">
          {" "}
          <FontAwesomeIcon
            icon={faMapLocationDot}
            className="w-10 h-10 text-red-gvi 0 pl-2"
          />{" "}
          Local Destinations :
        </p>
      </section>
      <section className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible whitespace-nowrap flex-nowrap px-4">
        {localDestination.length > 0 ? (
          localDestination.map((item, index) => (
            <DestinationCard
              key={index}
              image={`/images/destination/${slug}.jpg`}
              title={`${item.State}`}
              activities={item.qty}
              link={`/list?id=${idx_comp}&state=${item.State}&country=${country}`}
            />
          ))
        ) : (
          <>
            <SkeletonImage />
            <SkeletonImage />
            <SkeletonImage />
            <SkeletonImage />
          </>
        )}
      </section>

      {/* Section Favorite Tour */}
      <div className="bg-gray-100 my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-red-gvi font-bold text-3xl">
            {" "}
            <FontAwesomeIcon
              icon={faHeart}
              className="w-10 h-10 text-red-gvi 0 pl-2"
            />{" "}
            Recomended
          </p>
        </section>
        <section className="max-w-screen-xl mx-auto flex gap-4 overflow-x-auto flex-nowrap px-4 md:grid md:grid-cols-4">
          {isLoadingRecom ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : recomdedDestination.length > 0 ? (
            recomdedDestination.map((item, index) => (
              <EcommersCard
                key={index}
                idx_comp={item.idx_comp}
                idx_excursion={item.Idx_excursion}
                image={`https://picsum.photos/800/600?random=${index}`}
                title={`${item.State}, ${item.Name_excursion}`}
                sub_title={`${item.Duration_Type}, ${item.Holiday_Type}`}
                price={`${item.PriceFrom}`}
                currency={item.Currency}
              />
            ))
          ) : (
            <p className="col-span-4 text-gray-500 text-center">
              <FontAwesomeIcon
                icon={faInbox}
                className="w-10 h-10 text-red-gvi 0 pl-2"
              />{" "}
              Recomended is empty.
            </p>
          )}
        </section>

        {/* Last Your Search */}
      </div>

      {/* Section Last Your Search */}
      <div className="bg-white my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-red-gvi font-bold text-3xl">
            {" "}
            <FontAwesomeIcon
              icon={faCar}
              className="w-10 h-10 text-red-gvi 0 pl-2"
            />{" "}
            Tour in {slug}
          </p>
        </section>
        <section className="max-w-screen-xl mx-auto flex gap-4 overflow-x-auto flex-nowrap px-4  md:grid md:grid-cols-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <EcommersCard
              key={index}
              idx_comp={index.toString()}
              idx_excursion={index.toString()}
              image={`https://picsum.photos/800/600?random=${index}`}
              title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
              sub_title="10 hours • Skip the line • Pickup availables"
              price={"2000"}
              currency="EUR"
            />
          ))}
        </section>
      </div>
    </div>
  );
}
