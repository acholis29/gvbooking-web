import Galery from "@/components/Galery";
export default function DetailDestination() {
  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Baris Title */}
      <div className="flex flex-row justify-between items-center">
        <div className="text-gray-700">
          <h3 className="text-4xl font-bold">TANAH LOT, BALI</h3>
          <p className="text-sm font-semibold">
            Beraban, Kediri, Kabupaten Tabanan, Bali
          </p>
        </div>
        <div className="text-gray-700">
          <h3 className="text-4xl font-bold">07:00 - 19:00 WITA</h3>
        </div>
      </div>
      {/* Baris Galery */}
      <Galery />
      {/* Baris Content */}
      <div className="flex flex-row pb-5 gap-5">
        {/* Kontent Kiri */}
        <div className="w-4/6 text-gray-600">
          <p className="font-bold text-lg">
            The Legendary Charm of Tanah Lot Temple: Bali's Eternal Wonder
          </p>
          <p>
            Welcome to Tanah Lot, one of Bali’s most stunning icons! Perched on
            a giant rock formation in the middle of the sea, Tanah Lot Temple is
            a natural and spiritual masterpiece that is not only a feast for the
            eyes but also a soothing place for the soul. This destination is a
            must-visit for every traveler who wants to experience the true
            mystical beauty of Bali. This temple is not only famous for its
            legendary sunset views, where the silhouette of the temple looks so
            dramatic amidst the orange twilight, but also for its spiritual
            stories and unique culture. When the tide is high, the temple looks
            like a floating island, adding a magical touch to the landscape.
            When the tide is low, visitors can get close to the temple and feel
            its spiritual energy firsthand.
          </p>
          <br />
          <p>
            This temple is not only famous for its legendary sunset views, where
            the silhouette of the temple looks so dramatic amidst the orange
            twilight, but also for its spiritual stories and unique culture.
            When the tide is high, the temple looks like a floating island,
            adding a magical touch to the landscape. When the tide is low,
            visitors can get close to the temple and feel its spiritual energy
            firsthand.
          </p>

          <p className="font-bold text-lg">About this activity</p>
          <div className="border p-3 rounded-2xl w-1/2">
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
          </div>

          <p className="font-bold text-lg">Destination</p>
          <p>
            This temple is not only famous for its legendary sunset views, where
            the silhouette of the temple looks so dramatic amidst the orange
            twilight, but also for its spiritual stories and unique culture.
            When the tide is high, the temple looks like a floating island,
            adding a magical touch to the landscape. When the tide is low,
            visitors can get close to the temple and feel its spiritual energy
            firsthand.
          </p>
        </div>
        {/* Kontent Kanan */}
        <div className="w-2/6">
          <div className="border p-3 rounded-2xl">
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
          </div>
          <div className="border p-3 rounded-2xl">
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
            <p className="font-bold text-lg">About this activity</p>
            <p>
              This temple is not only famous for its legendary sunset views,
              where the silhouette of the temple looks so dramatic amidst the
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
