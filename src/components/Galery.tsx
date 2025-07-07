"use client";
import React, { useState } from "react";

type GaleryProps = {
  picture?: string;
  galery?: string;
};

const Galery: React.FC<GaleryProps> = ({
  picture = "/images/destination/tanah-lot/tanah-lot6.jpg",
  galery = "/images/destination/tanah-lot/tanah-lot6.jpg",
}) => {
  const galleryArray = galery
    ? galery
        .split("|")
        .map((url) => url.trim())
        .filter((url) => url && url !== "" && url.startsWith("http"))
    : [];

  // State gambar utama
  const [mainImage, setMainImage] = useState<string>(picture);

  return (
    <>
      <div className="grid gap-4 py-5">
        {/* Gambar Utama */}
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={mainImage}
            alt="Jumbotron"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/images/icon/android-chrome-512x512.png";
            }}
          />
        </div>
      </div>

      {/* Grid Thumbnail */}
      <div className="max-w-screen-xl mx-auto px-4 pb-4">
        <div className="overflow-x-auto md:overflow-visible">
          <div className="flex md:grid md:grid-cols-5 gap-4 min-w-max md:min-w-0">
            {galleryArray.map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 md:w-full cursor-pointer"
              >
                <img
                  className="w-full h-28 object-cover rounded-lg hover:opacity-80 transition"
                  src={img}
                  alt={`Gambar ${i + 1}`}
                  onClick={() => setMainImage(img)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/images/icon/android-chrome-512x512.png";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Galery;
