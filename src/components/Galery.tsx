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
      <div>
        <img
          className="h-auto max-w-full rounded-lg"
          src="/images/destination/tanah-lot/tanah-lot6.jpg"
          alt=""
        />
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div>
          <img
            className="h-auto md:h-50 max-w-full rounded-lg"
            src="/images/destination/tanah-lot/tanah-lot5.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto md:h-50 max-w-full rounded-lg"
            src="/images/destination/tanah-lot/tanah-lot4.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto md:h-50 max-w-full rounded-lg"
            src="/images/destination/tanah-lot/tanah-lot3.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto md:h-50 max-w-full rounded-lg"
            src="/images/destination/tanah-lot/tanah-lot3.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto md:h-50 max-w-full rounded-lg"
            src="/images/destination/tanah-lot/tanah-lot1.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Galery;
