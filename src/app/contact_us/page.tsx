"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { useInitial } from "@/context/InitialContext";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

export default function ContactUs() {
  // Initial Global (AgentId dan RepCode)
  const { representative, resourceInitial } = useInitial();
  useEffect(() => {
    if (representative.length > 0) {
      console.log(representative);
    }
  }, [representative]);

  return (
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="Contact Us" />
      <section className="flex flex-col md:flex-row py-6 px-2 md:px-6 gap-6">
        {/* Kiri: Info & Representative */}
        <div className="md:w-1/2">
          <div className="ml-2 mb-5 max-w-screen-md">
            <h1 className="text-gray-700 font-semibold text-2xl">Contact Us</h1>
            <p className="font-bold text-gray-500 text-sm">
              Email : cs@govation-indonesia.com
            </p>
            <p className="font-bold text-gray-500 text-sm">
              Hotline Number : +628123801503
            </p>

            <p className="font-bold text-gray-500 text-md mt-4">
              Representative
            </p>
            <hr />

            {representative && representative.length > 0 ? (
              representative.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center mt-3 border-b border-gray-200 pb-3"
                >
                  {/* Foto Kiri */}
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 mr-4 flex-shrink-0">
                    <img
                      src={
                        item.photo && item.photo !== ""
                          ? resourceInitial.url_img_team + item.photo
                          : "/images/icon/android-chrome-192x192.png"
                      }
                      alt={item.representative_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info Kanan */}
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-700">
                      {item.representative_name}
                    </p>
                    <p className="font-normal text-sm text-gray-500">
                      {item.email}
                    </p>
                    <p className="font-normal text-sm text-gray-500">
                      {item.mobile1}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No representative data available.
              </p>
            )}
          </div>
        </div>

        {/* Kanan: Form Contact */}
        <div className="md:w-1/2 bg-white rounded-lg p-4 md:p-6">
          <form>
            <p className="text-gray-600 text-sm font-semibold">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <p className="text-gray-600 text-sm mb-3">
              Fill out the form below and we'll get back to you soon.
            </p>

            {/* Fullname */}
            <div className="mb-4">
              <label
                htmlFor="fullname"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Fullname
              </label>
              <input
                type="text"
                id="fullname"
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Fullname"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="username@gmail.com"
                required
              />
            </div>

            {/* Message */}
            <div className="mb-5">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center w-full"
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className="w-4 h-4 text-white mr-1"
              />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
