import React from "react";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type SearchProps = {
  bgColor?: string;
  textColor?: string;
  title?: string;
};

const Search: React.FC<SearchProps> = ({
  bgColor = "bg-gray-500",
  textColor = "text-white",
  title = "Search",
}) => {
  return (
    <form className="flex items-center max-w-lg mx-auto">
      <div className="relative w-full">
        <input
          type="text"
          id="voice-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full md:w-md ps-10 p-2.5"
          placeholder="Search"
          required
        />

        <button
          type="button"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </form>
  );
};

export default Search;
