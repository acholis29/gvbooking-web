import React from "react";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type JumbotronProps = {
  image: string;
  destination?: String;
};

const JumbotronComponent: React.FC<JumbotronProps> = ({
  image,
  destination,
}) => {
  const arrDestination: Record<string, string> = {
    cambodia: "https://www.go-vacation.com/destinations/destination-cambodia/",
    indonesia:
      "https://www.go-vacation.com/destinations/destination-indonesia/",
    india: "https://www.go-vacation.com/destinations/destination-india/",
    srilangka:
      "https://www.go-vacation.com/destinations/destination-sri-langka/",
    thailand: "https://www.go-vacation.com/destinations/destination-thailand/",
    vietnam: "https://www.go-vacation.com/destinations/destination-vietnam/",
  };

  const destinationUrl = destination
    ? arrDestination[destination.toLowerCase()]
    : "https://www.go-vacation.com/";

  return (
    <section
      className="relative w-full h-[600px] bg-center bg-cover flex items-center justify-center"
      style={{ backgroundImage: `url('${image}')` }}
    >
      {/* Overlay hitam */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Konten */}
      <div className="relative z-10 text-center px-4 max-w-screen-xl">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white drop-shadow-md md:text-5xl lg:text-6xl">
          {destination?.toUpperCase()}
        </h1>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white drop-shadow-md md:text-5xl lg:text-6xl">
          Discover and book activities from around the world
        </h1>
        <p className="mb-8 text-lg font-normal text-white drop-shadow-sm lg:text-xl sm:px-16 lg:px-48">
          &quot; Dream Vacation Starts Here: The Ultimate Travel Experience,
          Just for You. &quot;
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          {/* <a
            href="/list"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-white rounded-lg bg-red-gvi hover:bg-red-900 focus:ring-4 focus:ring-blue-300"
          >
            Book Now
            <FontAwesomeIcon
              icon={faArrowRight}
              className="w-4 h-4 text-white pl-2"
            />
          </a> */}

          
          {/* <a
            href={destinationUrl}
            target="blank"
            className="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-900 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Learn more{" "}
            <FontAwesomeIcon
              icon={faArrowRight}
              className="w-4 h-4 text-gray-900 pl-2"
            />
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default JumbotronComponent;
