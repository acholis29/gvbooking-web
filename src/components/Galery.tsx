"use client";
import { useState } from "react";
import * as React from "react";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhotoFilm } from "@fortawesome/free-solid-svg-icons";

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

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 py-5">
        {/* Gambar Utama */}
        <div className="">
          <img
            className="w-full h-full object-cover rounded-tl-sm rounded-bl-sm"
            src={galleryArray[0]}
            alt="Jumbotron"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/images/icon/android-chrome-512x512.png";
            }}
          />
        </div>
        <div className="">
          <img
            className="w-full h-full object-cover"
            src={galleryArray[1]}
            alt="Jumbotron"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/images/icon/android-chrome-512x512.png";
            }}
          />
        </div>
        <div className="grid grid-rows-2 gap-2">
          <div className="">
            <img
              className="w-full h-full object-cover rounde"
              src={galleryArray[2]}
              alt="Jumbotron"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/images/icon/android-chrome-512x512.png";
              }}
            />
          </div>
          <div className="relative">
            <img
              className="w-full h-full object-cover"
              src={galleryArray[3]}
              alt="Jumbotron"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/images/icon/android-chrome-512x512.png";
              }}
            />
            {/* Button pojok kanan bawah */}
            <button
              className="absolute bottom-2 right-2 
             px-3 py-1.5 text-sm 
             md:px-5 md:py-2 md:text-base
             border rounded-2xl 
             bg-black/40 hover:bg-black/60 
             shadow-md transition text-white cursor-pointer"
              title="Lihat Galeri"
              onClick={() => setOpen(true)}
            >
              <FontAwesomeIcon
                icon={faPhotoFilm}
                className="w-4 h-4 text-white mr-1 md:mr-2"
              />
              <span className="hidden md:inline">More</span> +12
            </button>
          </div>
        </div>
      </div>

      {/* LightBox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .8)" } }}
        className="tailwind-lightbox"
        slides={[
          {
            src: "/images/destination/tanah-lot/tanah-lot2.jpg",
            width: 3840,
            height: 2560,
          },
          {
            src: "/images/destination/tanah-lot/tanah-lot3.jpg",
            width: 3840,
            height: 2560,
          },
          {
            src: "/images/destination/tanah-lot/tanah-lot4.jpg",
            width: 3840,
            height: 2560,
          },
          // ...
        ]}
      />

      {/* Grid Thumbnail */}
      {/* <div className="max-w-screen-xl mx-auto px-4 pb-4">
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
      </div> */}
    </>
  );
};

export default Galery;
