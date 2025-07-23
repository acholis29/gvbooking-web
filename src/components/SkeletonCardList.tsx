import React from "react";

type SkeletonCardListProps = {
  id?: string;
};

const SkeletonCardList: React.FC<SkeletonCardListProps> = ({ id }) => {
  const chipId = id || `badge-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <>
      <div
        role="status"
        className="hidden md:block max-w-sm border border-gray-200 rounded-sm shadow-sm animate-pulse"
      >
        <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded-sm">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
          </svg>
        </div>

        <div className="p-4 md:p-6">
          <div className="h-4 bg-gray-200 rounded-full w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>

          <div className="flex flex-row items-center justify-between mt-4 gap-2">
            <div className="h-4 bg-gray-200 rounded-full w-40 mb-4"></div>
            <div className=" bg-gray-200 rounded-md w-15 h-10 mb-4"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>

      <div
        role="status"
        className="space-y-8 flex flex-row gap-2  md:hidden animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:items-center p-4"
      >
        <div className=" flex items-center justify-center w-full h-40 bg-gray-300 rounded-sm">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>

        <div className="w-full">
          <div className="h-5 bg-gray-200 rounded-full w-48 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded-full max-w-[200px] mb-2.5"></div>
          <div className="h-1 bg-gray-200 rounded-full max-w-[50px] mb-2.5"></div>
          <div className="h-5 bg-gray-200 rounded-full max-w-[100px] mb-2.5"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export default SkeletonCardList;
