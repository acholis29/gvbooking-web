"use client";

import { useEffect, useState } from "react";

import JumbotronComponent from "@/components/Jumbotron";
import DestinationCard from "@/components/DestinationCard";
import EcommersCard from "@/components/EcommersCard";
import FooterComponent from "@/components/Footer";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMapLocationDot,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import SkeletonImage from "@/components/SkeletonImage";

export default function Home() {
  type DestinationItem = {
    idx_comp_alias: string;
    name: string;
    country: string;
    countryCode: string;
    url_img_team: string;
  };

  type ActivityCountryItem = {
    idx_comp: string;
    country: string;
    qty: string;
  };

  const [destination, setDestination] = useState<DestinationItem[]>([]);

  useEffect(() => {
    fetch("https://api.govacation.biz/mobile/corev2.json", {
      cache: "no-store", // ⛔ jangan ambil dari cache
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data); // ← ini langsung array
        setDestination(data); // ✅ langsung set array-nya
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
        console.log("activity country:", data); // ← ini langsung array
        setActivityCountry(data); // ✅ langsung set array-nya
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    // Home Page
    <div>
      {/* Jumbotron */}
      <JumbotronComponent image="/images/hero/hero.jpg" />

      {/* Section Destination */}
      <section className="py-6 px-4 max-w-screen-xl mx-auto">
        <p className="text-red-gvi font-bold text-3xl mt-10">
          {" "}
          <FontAwesomeIcon
            icon={faMapLocationDot}
            className="w-10 h-10 text-red-gvi 0 pl-2"
          />{" "}
          Destinations
        </p>
      </section>
      <section className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible whitespace-nowrap flex-nowrap px-4">
        {destination.length > 0 ? (
          destination.map((item) => {
            const activity = activityCountry.find(
              (ac) => ac.idx_comp === item.idx_comp_alias
            );

            console.log(activity?.qty);

            return (
              <DestinationCard
                key={item.idx_comp_alias}
                image={`/images/destination/${item.country.toLowerCase()}.jpg`}
                title={item.country}
                activities={`${activity?.qty ?? "0"}`}
                link={`/destination/${item.country
                  .toLowerCase()
                  .replace(/\s+/g, "-")}?id=${item.idx_comp_alias}`}
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
          <p className="text-red-gvi font-bold text-3xl">
            {" "}
            <FontAwesomeIcon
              icon={faHeart}
              className="w-10 h-10 text-red-gvi 0 pl-2"
            />{" "}
            Favorite Tours
          </p>
        </section>
        {/* <section className="max-w-screen-xl mx-auto flex gap-6 overflow-x-auto md:overflow-x-visible flex-nowrap md:flex-wrap px-4"> */}
        <section className="max-w-screen-xl mx-auto flex gap-4 overflow-x-auto flex-nowrap px-4  md:grid md:grid-cols-4">
          <EcommersCard
            image="/images/destination/thailand.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/india.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/vietnam.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/srilangka.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/bali.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/thailand.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />
        </section>

        {/* Last Your Search */}
      </div>

      {/* Section Last Your Search */}
      <div className="bg-white my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-red-gvi font-bold text-3xl">
            {" "}
            <FontAwesomeIcon
              icon={faSearch}
              className="w-10 h-10 text-red-gvi 0 pl-2"
            />{" "}
            Last your search
          </p>
        </section>
        <section className="max-w-screen-xl mx-auto flex gap-4 overflow-x-auto flex-nowrap px-4  md:grid md:grid-cols-4">
          <EcommersCard
            image="/images/destination/thailand.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/india.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/vietnam.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/srilangka.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/bali.jpg"
            title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
            sub_title="10 hours • Skip the line • Pickup availables"
            price={"2.000.000"}
          />
        </section>
      </div>
    </div>
  );
}
