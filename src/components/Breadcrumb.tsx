// components/DestinationCard.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type BreadcrumbProps = {
  pageName?: string;
  country?: string;
  state?: string;
  idx_comp?: string;
  idx_excursion?: string;
  link?: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  pageName = "",
  country = "",
  state = "",
  idx_excursion = "",
  idx_comp = "",
  link = "/",
}) => {
  return (
    <nav className="flex pl-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 md:gap-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex uppercase items-center text-xs md:text-sm  font-medium text-gray-700 hover:text-red-500"
          >
            <svg
              className="w-3 h-3 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            Home
          </Link>
        </li>

        {country != "" && (
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                href={`/destination/${country}?id=${idx_comp}&country=${country}`}
                className="ms-1 uppercase text-xs md:text-sm font-medium text-gray-500 md:ms-2"
              >
                {country}
              </Link>
            </div>
          </li>
        )}

        {state != "" && (
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                href={`/list?id=${idx_comp}&country=${country}&state=${state}`}
                className="ms-1 uppercase text-xs md:text-sm font-medium text-gray-500 md:ms-2"
              >
                {state}
              </Link>
            </div>
          </li>
        )}

        {idx_excursion != "" && (
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                href={`/destination/details/${country}?id=${idx_comp}&country=${country.toLowerCase()}&state=${state.toLowerCase()}&exc=${idx_excursion}`}
                className="ms-1 uppercase text-xs md:text-sm font-medium text-gray-500 md:ms-2"
              >
                Activity
              </Link>
            </div>
          </li>
        )}

        {pageName != "" && (
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ms-1 uppercase text-xs md:text-sm font-medium text-gray-500 md:ms-2">
                {pageName}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
