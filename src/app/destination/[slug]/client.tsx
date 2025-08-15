// import Image from "next/image";
"use client";
// Hooks
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
// Component
import JumbotronComponent from "@/components/Jumbotron";
import DestinationCard from "@/components/DestinationCard";
import EcommersCard from "@/components/EcommersCard";
import SkeletonImage from "@/components/SkeletonImage";
import SkeletonCard from "@/components/SkeletonCard";
// Global Context
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useInitial } from "@/context/InitialContext";
import { useProfile } from "@/context/ProfileContext";
import { useDate } from "@/context/DateContext";
import { useCartApi } from "@/context/CartApiContext";
// Helper
import { getCountryImageUrl, getHostImageUrl } from "@/helper/helper";
import { API_HOSTS } from "@/lib/apihost";

type Props = {
  slug: string;
};

type LocalDestinationItem = {
  idx_comp: string;
  Country: string;
  State: string;
  idx_state: string;
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
  Gbr?: string;
  code_exc: string;
};

type RecomendedDestinationApiItem = {
  excursion_id: string;
  excursion_code: string;
  excursion_name: string;
  location_state: string;
  location_country: string;
  picture: string;
  currency_id: string;
  currency: string;
  price_in_raw: string;
  price_in_format: string;
  cmd: string;
};

export default function DestinationClient({ slug }: Props) {
  // Parameter GET
  const searchParams = useSearchParams();
  const idx_comp = searchParams.get("id"); //ini dari idx_comp_alias
  const country = searchParams.get("country"); //ini dari idx_comp_alias

  // State Local
  const [localDestination, setLocalDestination] = useState<
    LocalDestinationItem[]
  >([]);
  const [isLoadingRecom, setIsLoadingRecom] = useState(true);
  const [isLoadingRecomApi, setIsLoadingRecomApi] = useState(true);
  const [recomdedDestination, setRecomendedDestination] = useState<
    RecomendedDestinationItem[]
  >([]);
  const [recomdedDestinationApi, setRecomendedDestinationApi] = useState<
    RecomendedDestinationApiItem[]
  >([]);

  //  State Global Context
  const { setLanguage, setMasterLanguage, language } = useLanguage();
  const { setCurrency, setMasterCurrency, currency } = useCurrency();
  const { profile } = useProfile();
  const { date } = useDate();
  const { saveCartApi } = useCartApi();
  const {
    setAgent,
    setRepCode,
    setResourceInitial,
    setProfileInitial,
    coreInitial,
  } = useInitial();

  // host sesuai country
  const host_img = getHostImageUrl(coreInitial, idx_comp ?? "");

  // First Load API Mobile Initial
  useEffect(() => {
    const fetchDataInitial = async () => {
      const formBody = new URLSearchParams({
        shared_key: idx_comp ?? "", // examp : "4D340942-88D3-44DD-A52C-EAF00EACADE8"
        xml: "false",
      });

      try {
        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const json = await res.json();
          console.log(json);
          fetchSecondDataInitial(json.msg);
          setRepCode(json.msg.default_rep_code); //R-BC
        }
      } catch (err: any) {
        // setError(err.message || "Error");
        console.error("Fetch error:", err);
      }
    };

    const fetchSecondDataInitial = async (param: any) => {
      setIsLoadingRecomApi(true);
      try {
        const formBody = new URLSearchParams({
          shared_key: idx_comp ?? "",
          xml: "false",
          keyword: `|${profile.email}`,
          date: date ?? "",
          code_of_language: language ?? param.default_language,
          code_of_currency: currency ?? param.default_currency,
          promo_code: param.default_rep_code,
          email: profile.email ?? "",
          mobile: profile.phone ?? "",
        });

        const res = await fetch(
          `${API_HOSTS.host1}/excursion.asmx/v2_product_search_initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        const json = await res.json();
        console.log("Response 2:", json.msg);
        const languageList = json.msg.company_language.map((item: any) => ({
          MSLanguage: item.language_code,
        }));
        const currencyList = json.msg.company_currency.map((item: any) => ({
          Currency: item.currency_code,
        }));
        // Set dari api v2_product_search_initialize
        setMasterLanguage(languageList);
        setLanguage(param.default_language);
        // set recomendation api
        setRecomendedDestinationApi(json.msg.product_search_recommendation);
        setMasterCurrency(currencyList);
        let presentCurrency = localStorage.getItem("currency") ?? "";
        if (presentCurrency == "") {
          setCurrency(param.default_currency);
          localStorage.setItem("currency", param.default_currency); // simpan ke localStorage
        } else {
          const isPresentCurrency = currencyList.some(
            (item: any) => item.Currency === presentCurrency
          );
          if (isPresentCurrency) {
            setCurrency(presentCurrency);
            localStorage.setItem("currency", presentCurrency); // simpan ke localStorage
          } else {
            setCurrency(param.default_currency);
            localStorage.setItem("currency", param.default_currency); // simpan ke localStorage
          }
        }
        setAgent(json.msg.resource.agent_id);
        setResourceInitial(json.msg.resource);
        setProfileInitial(json.msg.profile);
        // proses hasil dari fetch kedua di sini
        localStorage.setItem("language", param.default_language); // simpan ke localStorage
        localStorage.setItem(
          "resource_initial",
          JSON.stringify(json.msg.resource)
        );
        localStorage.setItem(
          "profile_initial",
          JSON.stringify(json.msg.profile)
        );
        saveCartApi(json.msg.cart_item);
      } catch (err: any) {
        console.error("Fetch kedua error:", err);
      } finally {
        setIsLoadingRecomApi(false);
      }
    };
    if (date != "") {
      fetchDataInitial();
    }
  }, [date, language, currency]);

  useEffect(() => {
    fetch(`/api/excursion/local_destination/${idx_comp}`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        setLocalDestination(data);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`/api/excursion/attr/recomended?idxcomp=${idx_comp}`, {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
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
              link={`/list?id=${idx_comp}&country=${country}&state=${item.State}&id-state=${item.idx_state}`}
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

      {/* Section Recomended Tour Dari API Inisialize*/}
      <div className="bg-gray-100 my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-red-gvi font-bold text-3xl">Recomended</p>
        </section>
        <section className="max-w-screen-xl mx-auto flex gap-4 overflow-x-auto flex-nowrap px-4 md:grid md:grid-cols-4">
          {isLoadingRecomApi ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : recomdedDestinationApi.length > 0 ? (
            recomdedDestinationApi.map((item, index) => (
              <EcommersCard
                key={index}
                idx_comp={idx_comp ?? ""}
                idx_excursion={item.excursion_id}
                image={`${host_img}/${item.picture}`} // image={`https://picsum.photos/800/600?random=${index}`}
                title={`${item.location_state}, ${item.excursion_name}`}
                sub_title={`${item.location_state}, ${item.location_country}`.toUpperCase()}
                price={`${item.price_in_format}`}
                currency={item.currency}
                // link="/destination/detail/indonesia"
                link={`/destination/detail/${
                  item.location_country
                }?id=${idx_comp}&country=${item.location_country.toLowerCase()}&state=${item.location_state.toLowerCase()}&exc=${
                  item.excursion_id
                }`}
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

      {/* Section Recomended Tour Dari Database Pak Anang */}
      {/* <div className="bg-gray-100 my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-red-gvi font-bold text-3xl">Recomended</p>
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
                // image={`https://picsum.photos/800/600?random=${index}`}
                image={`${host_img}/media/${item.code_exc}/TN_400_${item.Gbr}`}
                title={`${item.State}, ${item.Name_excursion}`}
                sub_title={`${item.Holiday_Type} • ${item.Duration_Type} | ${item.State}, ${item.Country}`.toUpperCase()}
                price={`${item.PriceFrom}`}
                currency={item.Currency}
                // link="/destination/detail/indonesia"
                link={`/destination/detail/${item.Country}?id=${
                  item.idx_comp
                }&country=${item.Country.toLowerCase()}&state=${item.State.toLowerCase()}&exc=${
                  item.Idx_excursion
                }`}
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
      </div> */}

      {/* Section Last Your Search */}
      <div className="bg-white my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-red-gvi font-bold text-3xl">
            {/* {" "}
            <FontAwesomeIcon
              icon={faCar}
              className="w-10 h-10 text-red-gvi 0 pl-2"
            />{" "} */}
            <span className="transform: uppercase;">Tour in {slug}</span>
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
                  // image={`${host_img}/media/${item.code_exc}/TN_400_${item.Gbr}`}
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
              Tour is empty.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
