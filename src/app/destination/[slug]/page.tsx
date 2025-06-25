// import Image from "next/image";
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
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

type PageProps = {
  params: {
    slug?: string;
  };
};

export default async function Destination({ params }: PageProps) {
  const { slug } = await params; // "thailand" dari /destination/thailand

  return (
    // Destination Page
    <div>
      {/* Jumbotron */}
      <JumbotronComponent
        image="/images/destination/thailand.jpg"
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
      <section className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto md:overflow-x-visible whitespace-nowrap flex-nowrap px-4">
        <DestinationCard
          image="/images/destination/thailand.jpg"
          title="Bangkok, Thailand"
          activities={334}
          link="/destination/thailand"
        />

        <DestinationCard
          image="/images/destination/bali.jpg"
          title="Bali, Indonesia"
          activities={334}
          link="/destination/indonesia"
        />

        <DestinationCard
          image="/images/destination/vietnam.jpg"
          title="Vietnam"
          activities={334}
          link="/destination/vietnam"
        />

        <DestinationCard
          image="/images/destination/srilangka.jpg"
          title="Srilangka"
          activities={334}
          link="/destination/srilangka"
        />

        <DestinationCard
          image="/images/destination/india.jpg"
          title="India"
          activities={334}
          link="/destination/india"
        />
      </section>

      {/* Section Favorite Tour */}
      <div className="bg-gray-100 my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-red-gvi font-bold text-3xl">
            {" "}
            <FontAwesomeIcon
              icon={faMapLocationDot}
              className="w-10 h-10 text-red-gvi 0 pl-2"
            />{" "}
            Recomended in {slug}
          </p>
        </section>
        <section className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto md:overflow-x-visible flex-nowrap md:flex-wrap px-4">
          <EcommersCard
            image="/images/destination/thailand/thailand-phuket.jpg"
            title="Phuket, Thailand"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/thailand/thailand-chiang-mai.jpg"
            title="Chiang Mai, Thailand"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/thailand/thailand-bangkok.jpg"
            title="Bangkok, Thailand"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/srilangka.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/bali.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/thailand.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
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
              icon={faMapLocationDot}
              className="w-10 h-10 text-red-gvi 0 pl-2"
            />{" "}
            Tour in {slug}
          </p>
        </section>
        <section className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto md:overflow-x-visible flex-nowrap md:flex-wrap px-4">
          <EcommersCard
            image="/images/destination/thailand.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/india.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/vietnam.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/srilangka.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />

          <EcommersCard
            image="/images/destination/bali.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={"2.000.000"}
          />
        </section>
      </div>
    </div>
  );
}
