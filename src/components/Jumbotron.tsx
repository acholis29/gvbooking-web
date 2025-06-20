import React from "react";

type JumbotronProps = {
  image: string;
};

const JumbotronComponent: React.FC<JumbotronProps> = ({ image }) => {
  return (
    <section
      className="relative bg-cover bg-center h-96 w-full"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white drop-shadow-md md:text-5xl lg:text-6xl">
          Discover and book activities from around the world
        </h1>
        <p className="mb-8 text-lg font-normal text-white drop-shadow-sm lg:text-xl sm:px-16 lg:px-48">
          &quote;Dream Vacation Starts Here: The Ultimate Travel Experience,
          Just for You. &quot;
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          <a
            href="/list"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-red-800 hover:bg-red-900 focus:ring-4 focus:ring-blue-300"
          >
            Book Now
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
          <a
            href="#"
            className="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-900 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
};

export default JumbotronComponent;
