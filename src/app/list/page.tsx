import Badge from "@/components/Badge";
import Chips from "@/components/Chips";
import Range from "@/components/Range";
import Checkbox from "@/components/Checkbox";
import Search from "@/components/Search";
import ListCard from "@/components/ListCard";

export default function List() {
  return (
    // List Page
    <div className="max-w-screen-xl mx-auto">
      <section className="flex flex-col md:flex-row px-6 pb-6 bg-white gap-6">
        {/* Search List Mobile  */}
        <div className="md:hidden flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Search akan full width di HP */}
          <div className="">
            <Search />
          </div>

          {/* Badge akan di bawah search di HP, dan di samping saat md */}
          <div className="flex flex-wrap gap-1">
            <Badge title="New" />
            <Badge title="Price Ascending" />
            <Badge title="Price Descending" />
            <Badge title="Rating" />
          </div>
        </div>
        {/* Konten Kiri */}
        <div className="md:w-1/6 text-gray-700">
          <p className="text-sm mb-2 font-semibold">Keywords</p>
          <Chips title="Spring" id="badge1" />
          <Chips title="Smart" id="badge2" />
          <Chips title="Modern" id="badge3" />
          <Range />

          <div className="flex flex-row gap-3 md:flex-col">
            <div>
              <p className="text-sm mb-2 font-semibold">Color</p>
              <Checkbox title="Label" />
              <Checkbox title="Label" />
              <Checkbox title="Label" />
            </div>
            <div>
              <p className="text-sm mb-2 font-semibold">Size</p>
              <Checkbox title="Label" />
              <Checkbox title="Label" />
              <Checkbox title="Label" />
            </div>
          </div>
        </div>
        {/* Konten Kanan */}
        <div className="md:w-5/6 text-black">
          {/* Baris Search dan Badge */}
          <div className="hidden md:flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Search akan full width di HP */}
            <div className="w-md">
              <Search />
            </div>

            {/* Badge akan di bawah search di HP, dan di samping saat md */}
            <div className="flex flex-wrap gap-1">
              <Badge title="New" />
              <Badge title="Price Ascending" />
              <Badge title="Price Descending" />
              <Badge title="Rating" />
            </div>
          </div>

          {/* Baris Card */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            <ListCard
              image="/images/destination/thailand.jpg"
              title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
              sub_title="10 hours • Skip the line • Pickup availables"
              price={"2.000.000"}
              link="/destination/detail/thailand"
            />

            <ListCard
              image="/images/destination/india.jpg"
              title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
              sub_title="10 hours • Skip the line • Pickup availables"
              price={"2.000.000"}
            />

            <ListCard
              image="/images/destination/vietnam.jpg"
              title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
              sub_title="10 hours • Skip the line • Pickup availables"
              price={"2.000.000"}
            />

            <ListCard
              image="/images/destination/srilangka.jpg"
              title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
              sub_title="10 hours • Skip the line • Pickup availables"
              price={"2.000.000"}
            />

            <ListCard
              image="/images/destination/bali.jpg"
              title="Vegas: Grand Canyon, Hoover Dam, Skywalk Option, & Two Meals"
              sub_title="10 hours • Skip the line • Pickup availables"
              price={"2.000.000"}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
