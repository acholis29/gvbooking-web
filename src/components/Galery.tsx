// components/DestinationCard.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import React from "react";

type GaleryProps = {
  bgColor?: string;
  textColor?: string;
  title?: string;
};

const Galery: React.FC<GaleryProps> = ({
  bgColor = "bg-gray-500",
  textColor = "text-white",
  title = "Galery",
}) => {
  return (
    <div className="grid gap-4 py-5">
      {/* Gambar Utama */}
      <div>
        <img
          className="w-full h-96 object-cover rounded-lg"
          src="/images/destination/tanah-lot/tanah-lot6.jpg"
          alt=""
        />
      </div>

      {/* Grid Kecil */}
      <div className="grid grid-cols-5 gap-4">
        {[
          "tanah-lot5.jpg",
          "tanah-lot4.jpg",
          "tanah-lot3.jpg",
          "tanah-lot3.jpg",
          "tanah-lot1.jpg",
        ].map((img, i) => (
          <div key={i}>
            <img
              className="w-full h-30 object-cover rounded-lg"
              src={`/images/destination/tanah-lot/${img}`}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Galery;
