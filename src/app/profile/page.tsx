"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { parse } from "path";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// Context Global
import { useProfile } from "@/context/ProfileContext";
import { useCartApi } from "@/context/CartApiContext";
// Library
import { signIn, signOut, useSession } from "next-auth/react";
import { API_HOSTS } from "@/lib/apihost";
import { useInitial } from "@/context/InitialContext";

export default function Profile() {
  // Login with Google
  const { data: session, status } = useSession();
  // Redirect
  const router = useRouter();
  // Context global
  const { profileInitial, resourceInitial, coreInitial } = useInitial();

  type FormData = {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    temp: string;
  };

  const { profile, setProfile } = useProfile();
  const { saveCartApi, idxCompCart } = useCartApi();

  // Update Email
  async function updateEmail(email: string) {
    try {
      const formBody = new URLSearchParams({
        shared_key: idxCompCart, // Indo Or Others
        xml: "false",
        id_master_file: profileInitial[0].idx_mf,
        email: email,
      });

      let url = `${API_HOSTS.host1}/excursion.asmx/v2_updateemail`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error("update email failed");

      // Response Html
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Simpan ke localStorage
    if (profile.email != data.email) {
      saveCartApi([]);
    }

    localStorage.setItem("profileData", JSON.stringify(data));
    localStorage.setItem("profilePay", JSON.stringify(data));
    setProfile(data);

    if (idxCompCart != "" || idxCompCart != null) {
      await updateEmail(data.email);
    }
    toast.success("Success Update Profile");
    toast.success(`Hai,${data.firstname} Welcome!`);
    router.push("/");
  };

  useEffect(() => {}, [profile]);

  // Kalo sudah login google jangan masuk profil
  useEffect(() => {
    if (status == "authenticated") {
      router.back();
    }
  });
  // Kalo dipaksa return null
  if (status == "authenticated") {
    return null;
  }

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
                    defaultValue={
                      profile.temp.toLocaleLowerCase() == "true"
                        ? ""
                        : profile.firstname
                    }
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
                    defaultValue={
                      profile.temp.toLocaleLowerCase() == "true"
                        ? ""
                        : profile.lastname
                    }
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
                    defaultValue={
                      profile.temp.toLocaleLowerCase() == "true"
                        ? ""
                        : profile.phone
                    }
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
                    defaultValue={
                      profile.temp.toLocaleLowerCase() == "true"
                        ? ""
                        : profile.email
                    }
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
                <input
                  {...register("temp")}
                  type="hidden"
                  id="temp"
                  defaultValue={"false"}
                />
              </div>
            </div>
          </div>
          {/* Booking Options */}
          {/* <h1 className="text-gray-700 font-semibold ml-2">Booking Options</h1>
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
                  </div> */}
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
