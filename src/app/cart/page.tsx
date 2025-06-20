import HorizontalCard from "@/components/HorizontalCard";

export default function Cart() {
  return (
    // Cart Page
    <div className="max-w-screen-xl mx-auto">
      <section className="flex flex-col md:flex-row p-6 bg-white gap-6">
        {/* Konten Kiri */}
        <div className="md:w-3/6 text-gray-700">
          <HorizontalCard
            image="/images/destination/tanah-lot/tanah-lot6.jpg"
            title="Tanah Lot, Bali Indonesia"
            sub_title="lorem"
            link="/cart"
            price="200000"
          />
          <HorizontalCard
            image="/images/destination/tanah-lot/tanah-lot6.jpg"
            title="Tanah Lot, Bali Indonesia"
            sub_title="lorem"
            link="/cart"
            price="200000"
          />
        </div>
        {/* Konten Kanan */}
        <div className="md:w-2/6 text-black">
          <div className="border p-3 rounded-2xl mt-3 bg-gray-600">
            <div className="flex flex-row justify-between">
              <div className="">
                <p className="font-bold text-lg  text-white">Total (2 Item)</p>
              </div>
              <div className="">
                <p className="font-bold text-lg  text-white">IDR 1.234.998</p>
                <p className="text-sm  text-white">*include tax and service</p>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 w-full text-white bg-red-500 hover:bg-red-900 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              PAYMENT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
