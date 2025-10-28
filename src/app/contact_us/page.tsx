"use client";
import Breadcrumb from "@/components/Breadcrumb";
import {
  faChevronDown,
  faEnvelope,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ContactUs() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="Contact Us" />
      <section className="flex flex-col py-6 px-2 md:px-0 md:p-6gap-1">
        <form className="">
          {/* Form Contact Us */}
          <h1 className="text-gray-700 font-semibold ml-2 text-2xl">
            Contact Us
          </h1>
          <p className="text-gray-600 ml-2 text-sm font-semibold">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <p className="text-gray-600 ml-2 text-sm mb-3">
            Fill out the form below and we'll get back to you soon.
          </p>
          <div className="flex flex-row mb-2 p-2 md:p-0">
            <div className="w-[100%] md:w-1/2 rounded-sm p-3 md:p-0 md:ml-2">
              <div className="flex col md:flex-row gap-2 w-full">
                <div className="mb-5 w-full">
                  <label
                    htmlFor="fullname"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Fullname
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    defaultValue=""
                    className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Fullname"
                    required
                  />
                </div>
              </div>
              <div className="flex col md:flex-row gap-2 w-full">
                <div className="mb-5 w-full">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue=""
                    className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Username@gmail.com"
                    required
                  />
                </div>
              </div>
              <div className="mb-5 w-full">
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
            </div>
          </div>

          {/* Apply */}
          <div className="flex flex-row mb-2 w-[100%] md:w-1/2 p-2 md:p-0 md:ml-2">
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
          </div>
        </form>
      </section>
    </div>
  );
}
