"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { parse } from "path";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// Context Global
import { useProfile } from "@/context/ProfileContext";
import { useCartApi } from "@/context/CartApiContext";

export default function Profile() {
  type FormData = {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
  };

  const { profile, setProfile } = useProfile();
  const { saveCartApi } = useCartApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Simpan ke localStorage
    if (profile.email != data.email) {
      saveCartApi([]);
    }

    localStorage.setItem("profileData", JSON.stringify(data));
    setProfile(data);
    toast.success("Success Update Profile");
  };

  useEffect(() => {}, [profile]);

  // Cart Page
  return (
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="Profile" />
      <section className="flex flex-col py-6 md:p-6gap-1">
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          {/* Profile */}
          <h1 className="text-gray-700 font-semibold ml-2">Profile</h1>
          <div className="flex flex-row mb-2 p-2 md:p-0">
            <div className="w-[100%] md:w-1/2 bg-gray-300 rounded-sm p-3 md:p-6">
              <div className="flex col md:flex-row gap-2 w-full">
                <div className="mb-5 w-full">
                  <label
                    htmlFor="first-name"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    {...register("firstname", {
                      required: "firstname is required",
                    })}
                    type="text"
                    id="first-name"
                    defaultValue={profile.firstname}
                    className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="first name"
                    required
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-xs pl-2">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
                <div className="mb-5 w-full">
                  <label
                    htmlFor="last-name"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    {...register("lastname", {
                      required: "lastname is required",
                    })}
                    type="text"
                    id="last-name"
                    defaultValue={profile.lastname}
                    className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="last name"
                    required
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-xs pl-2">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex col md:flex-row gap-2 w-full">
                <div className="mb-5 w-full">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Mobile Phone
                  </label>
                  <input
                    {...register("phone")}
                    type="number"
                    id="phone"
                    defaultValue={profile.phone}
                    className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="phone number (optional)"
                  />
                </div>
                <div className="mb-5 w-full">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: "email is required",
                    })}
                    type="email"
                    id="email"
                    defaultValue={profile.email}
                    className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="name@flowbite.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs pl-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Booking Options */}
          <h1 className="text-gray-700 font-semibold ml-2">Booking Options</h1>
          <div className="flex flex-row mb-2 p-2 md:p-0">
            <div className="w-[100%] md:w-1/2 bg-gray-300 rounded-sm p-6">
              <div className="mb-5">
                <label
                  htmlFor="destination"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Destination"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="currency"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Currency
                </label>
                <input
                  type="text"
                  id="currency"
                  className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Currency"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="language"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Language
                </label>
                <input
                  type="text"
                  id="language"
                  className="shadow-xs bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Language"
                />
              </div>
            </div>
          </div>
          {/* Apply */}
          <div className="flex flex-row mb-2 w-[100%] md:w-1/2 p-2 md:p-0">
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center w-full"
            >
              Apply
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
