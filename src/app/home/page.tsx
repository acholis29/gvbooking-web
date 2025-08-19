"use client";

import { useEffect, useState } from "react";

import JumbotronComponent from "@/components/Jumbotron";
import DestinationCard from "@/components/DestinationCard";
import EcommersCard from "@/components/EcommersCard";
import FooterComponent from "@/components/Footer";
import { GLOBAL_VAR } from "@/lib/globalVar";

import { Geist, Geist_Mono } from "next/font/google";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faInbox,
  faMapLocationDot,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import SkeletonImage from "@/components/SkeletonImage";
import { log } from "console";
import SkeletonCard from "@/components/SkeletonCard";
import { API_HOSTS } from "@/lib/apihost";
import { useInitial } from "@/context/InitialContext";
import { getCountryImageUrl } from "@/helper/helper";

export default function Home() {
  type DestinationItem = {
    app_name: string;
    country: string;
    countryCode: string;
    def_curr: string;
    idx_comp: string;
    idx_comp_alias: string;
    intl: string;
    min_daypayontour: number;
    name: string;
    payontour: boolean;
    phone_code: string;
    status: boolean;
    url_img: string;
    url_img_team: string;
  };

  type ActivityCountryItem = {
    idx_comp: string;
    country: string;
    qty: string;
  };

  type WishItem = {
    idx_comp: string;
    idx_excursion: string;
    title: string;
    sub_title: string;
    price: string;
    currency?: string;
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
    Gbr?: string;
    code_exc: string;
  };

  const { coreInitial } = useInitial();
  // State Data WistList
  const [ListWist, setWish] = useState<WishItem[]>([]);

  const [destination, setDestination] = useState<DestinationItem[]>([]);

  const [recomdedDestination, setRecomendedDestination] = useState<
    RecomendedDestinationItem[]
  >([]);

  const [LastSearch, setLastSearch] = useState<RecomendedDestinationItem[]>([]);

  const [isLoadingRecom, setIsLoadingRecom] = useState(true);
  const [isLoadingLastSearch, setIsLoadingLastSearch] = useState(true);

  useEffect(() => {
    fetch(`${API_HOSTS.host1}/mobile/corev2.json`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setDestination(data); // ✅ langsung set array-nya
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const [activityCountry, setActivityCountry] = useState<ActivityCountryItem[]>(
    []
  );

  useEffect(() => {
    fetch("/api/excursion/activity_country", {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setActivityCountry(data); // ✅ langsung set array-nya
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    loadWishlish();
  }, []); // tetap kosong, agar hanya dijalankan sekali saat mount

  function loadWishlish() {
    const wish = JSON.parse(localStorage.getItem("wish") || "[]");
    setWish(wish);
  }

  useEffect(() => {
    fetch(
      "/api/excursion/attr/recomended", // gunakan '' untuk mendapatkan semua rekomendasi
      {
        cache: "no-store", // ⛔ jangan ambil dari cache
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setRecomendedDestination(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoadingRecom(false);
      });
  }, []);

  useEffect(() => {
    // Ambil dari localStorage
    let lastSearch = JSON.parse(localStorage.getItem("last-search") || "[]");
    // Pastikan bentuknya array
    if (!Array.isArray(lastSearch)) {
      lastSearch = [lastSearch];
    }
    // Gabung jadi string dipisah koma
    const joined = lastSearch.join(",");

    console.log(joined);
    fetch(
      `/api/excursion/attr/last-search?exc_j=${joined}`, // gunakan '' untuk mendapatkan semua rekomendasi
      {
        cache: "no-store", // ⛔ jangan ambil dari cache
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setLastSearch(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoadingLastSearch(false);
      });
  }, []);

  return (
    // Home Page
    <div>
      {/* Jumbotron */}
      <JumbotronComponent image="/images/hero/hero.jpg" />

      {/* Section Destination */}
      <section className="py-6 px-4 max-w-screen-xl mx-auto">
        <p className="text-red-gvi font-bold text-3xl mt-10">
          {/* {" "}
          <FontAwesomeIcon
            icon={faMapLocationDot}
            className="w-10 h-10 text-red-gvi 0 pl-2"
          />{" "} */}
          Destinations
        </p>
      </section>
      <section className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible whitespace-nowrap flex-nowrap px-4">
        {destination.length > 0 ? (
          destination.map((item) => {
            const activity = activityCountry.find(
              (ac) =>
                ac.idx_comp === item.idx_comp ||
                ac.idx_comp === item.idx_comp_alias
            );

            return (
              <DestinationCard
                key={item.idx_comp}
                image={`/images/destination/${item.country.toLowerCase()}.jpg`}
                title={item.country}
                activities={`${activity?.qty ?? "0"}`}
                link={`/destination/${item.country
                  .toLowerCase()
                  .replace(/\s+/g, "-")}?id=${
                  item.idx_comp
                }&country=${item.country.toLowerCase()}`}
              />
            );
          })
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
          <p className="text-red-gvi font-bold text-3xl">Favorite Tours</p>
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
            recomdedDestination.map((item, index) => {
              let imgUrl = "/images/icon/android-chrome-512x512.png";
              if (item.Gbr != "") {
                imgUrl =
                  getCountryImageUrl(
                    coreInitial,
                    item.idx_comp,
                    `media/${item.code_exc}/TN_400_${item.Gbr}`
                  ) ?? "/images/icon/android-chrome-512x512.png";
              }

              return (
                <EcommersCard
                  key={index}
                  idx_comp={item.idx_comp}
                  idx_excursion={item.Idx_excursion}
                  // image={`https://picsum.photos/800/600?random=${index}`}
                  // image={`https://bo.govacation.biz/media/${item.code_exc}/TN_400_${item.Gbr}`}
                  image={imgUrl}
                  title={`${item.State}, ${item.Name_excursion}`}
                  sub_title={`${item.Holiday_Type} • ${item.Duration_Type} | ${item.State}, ${item.Country}`.toUpperCase()}
                  price={`${item.PriceFrom}`}
                  currency={item.Currency}
                  // link="/destination/detail/indonesia"
                  link={`/destination/detail/${item.Country}?id=${item.idx_comp}&country=${item.Country}&state=${item.State}&exc=${item.Idx_excursion}`}
                />
              );
            })
          ) : (
            <p className="col-span-4 text-gray-500 text-center">
              <FontAwesomeIcon
                icon={faInbox}
                className="w-10 h-10 text-red-gvi 0 pl-2"
              />{" "}
              Favorite is empty.
            </p>
          )}
        </section>

        {/* Last Your Search */}
      </div>

      {/* Section Last Your Search */}
      <div className="bg-white my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-red-gvi font-bold text-3xl">Last view</p>
        </section>

        <section className="max-w-screen-xl mx-auto flex gap-4 overflow-x-auto flex-nowrap px-4 md:grid md:grid-cols-4">
          {isLoadingLastSearch ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : LastSearch.length > 0 ? (
            LastSearch.map((item, index) => {
              let imgUrl = "/images/icon/android-chrome-512x512.png";
              if (item.Gbr != "") {
                imgUrl =
                  getCountryImageUrl(
                    coreInitial,
                    item.idx_comp,
                    `media/${item.code_exc}/TN_400_${item.Gbr}`
                  ) ?? "/images/icon/android-chrome-512x512.png";
              }
              return (
                <EcommersCard
                  key={index}
                  idx_comp={item.idx_comp}
                  idx_excursion={item.Idx_excursion}
                  // image={`https://picsum.photos/800/600?random=${index}`}
                  // image={`https://bo.govacation.biz/media/${item.code_exc}/TN_400_${item.Gbr}`}
                  image={imgUrl}
                  title={`${item.State}, ${item.Name_excursion}`}
                  sub_title={`${item.Holiday_Type} • ${item.Duration_Type} | ${item.State}, ${item.Country}`.toUpperCase()}
                  price={`${item.PriceFrom}`}
                  currency={item.Currency}
                  // link="/destination/detail/indonesia"
                  link={`/destination/detail/${item.Country}?id=${item.idx_comp}&country=${item.Country}&state=${item.State}&exc=${item.Idx_excursion}`}
                />
              );
            })
          ) : (
            <p className="col-span-4 text-gray-500 text-center">
              <FontAwesomeIcon
                icon={faInbox}
                className="w-10 h-10 text-red-gvi 0 pl-2"
              />{" "}
              Last view is empty.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
