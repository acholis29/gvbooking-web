// components/DestinationCard.tsx
import React from "react";

type GaleryProps = {
  picture?: string;
  galery?: string;
};

const Galery: React.FC<GaleryProps> = ({
  picture = "/images/destination/tanah-lot/tanah-lot6.jpg",
  galery = "/images/destination/tanah-lot/tanah-lot6.jpg",
}) => {
  // Pecah string menjadi array dan filter yang tidak kosong
  const galleryArray = galery
    ? galery
        .split("|")
        .map((url) => url.trim())
        .filter((url) => url && url !== "" && url.startsWith("http"))
    : [];
  console.log(galleryArray.length);
  return (
    <div className="grid gap-4 py-5">
      {/* Gambar Utama */}
      <div>
        <img
          className="w-full h-auto object-cover rounded-lg"
          src={picture}
          alt=""
        />
      </div>

      {/* Grid Kecil */}
      <div className="overflow-x-auto md:overflow-visible">
        <div className="flex md:grid md:grid-cols-5 gap-4 min-w-max md:min-w-0">
          {galleryArray.map((img, i) => (
            <div key={i} className="flex-shrink-0 w-40 md:w-full">
              <img
                className="w-full h-28 object-cover rounded-lg"
                src={img}
                alt={`Gambar ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Galery;
