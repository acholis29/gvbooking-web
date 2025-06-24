// import Image from "next/image";
import JumbotronComponent from "@/components/Jumbotron";
import DestinationCard from "@/components/DestinationCard";
import EcommersCard from "@/components/EcommersCard";
import FooterComponent from "@/components/Footer";

export default function Home() {
  return (
    // Home Page
    <div>
      {/* Jumbotron */}
      <JumbotronComponent image="/images/hero/hero.jpg" />

      {/* Section Destination */}
      <section className="py-6 px-4 max-w-screen-xl mx-auto">
        <p className="text-gray-500 font-bold">Destinations :</p>
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
          link="/destination/bali"
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
          <p className="text-gray-600 font-bold">Favorite Tours :</p>
        </section>
        <section className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto md:overflow-x-visible flex-nowrap md:flex-wrap px-4">
          <EcommersCard
            image="/images/destination/thailand.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/india.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/vietnam.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/srilangka.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/bali.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/thailand.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />
        </section>

        {/* Last Your Search */}
      </div>

      {/* Section Last Your Search */}
      <div className="bg-white my-6 pb-6">
        <section className="py-6 px-4 max-w-screen-xl mx-auto">
          <p className="text-gray-600 font-bold">Last Your Search :</p>
        </section>
        <section className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto md:overflow-x-visible flex-nowrap md:flex-wrap px-4">
          <EcommersCard
            image="/images/destination/thailand.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/india.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/vietnam.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/srilangka.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />

          <EcommersCard
            image="/images/destination/bali.jpg"
            title="Name Of Tour"
            sub_title="Sort Description sort Des 
sort Des"
            price={2000}
          />
        </section>
      </div>
    </div>
  );
}
