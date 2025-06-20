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
      <section className="flex flex-col md:flex-row p-6 bg-white gap-6">
        {/* Konten Kiri */}
        <div className="md:w-1/6 text-gray-700">
          <p className="text-sm mb-2 font-semibold">Keywords</p>
          <Chips title="Spring" />
          <Chips title="Smart" />
          <Chips title="Modern" />
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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

          {/* Baris Card */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            <ListCard
              image="/images/destination/thailand.jpg"
              title="Name Of Tour"
              sub_title="Sort Description sort Des 
sort Des"
              price={2000}
              link="/destination/detail/thailand"
            />

            <ListCard
              image="/images/destination/india.jpg"
              title="Name Of Tour"
              sub_title="Sort Description sort Des 
sort Des"
              price={2000}
            />

            <ListCard
              image="/images/destination/vietnam.jpg"
              title="Name Of Tour"
              sub_title="Sort Description sort Des 
sort Des"
              price={2000}
            />

            <ListCard
              image="/images/destination/srilangka.jpg"
              title="Name Of Tour"
              sub_title="Sort Description sort Des 
sort Des"
              price={2000}
            />

            <ListCard
              image="/images/destination/bali.jpg"
              title="Name Of Tour"
              sub_title="Sort Description sort Des 
sort Des"
              price={2000}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
