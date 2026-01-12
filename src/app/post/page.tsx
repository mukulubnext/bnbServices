"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const {user, loading} = useAuth();
  return (
    <div className="min-h-screen pt-[10vh] items-center relative bg-light">
      <Navbar solid />
      <LiquidGlassMenu />
      <ToastContainer/>
      {
        !loading && user.role === "buyer" ? (
          <div className="bg-white py-20 md:py-10 flex p-6 flex-col min-h-[80vh] w-[90vw] md:w-[60vw] border border-dark rounded-lg mx-auto">
        <h1 className="text-dark font-semibold text-3xl">Add a requirement</h1>
        <div>
          <form className="flex flex-col gap-4 mt-6">

            <div className="flex items-center justify-center w-full">
              <label
                className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong border-dark rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
              >
                <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-dark"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm">
                    <span className="font-semibold text-dark">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-dark font-medium">Title:</span>
              <input
                type="text"
                placeholder="Cartons"
                className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-dark font-medium">Description:</span>
              <textarea
                placeholder="Need high quality cartons for packaging of Wooden Artifacts"
                className="border border-dark/20 rounded-md p-2 h-32 focus:outline-none focus:border-dark transition-all"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-dark font-medium">More Details:</span>
              <input
                type="text"
                placeholder="Size, Material, Type etc."
                className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-dark font-medium">Quantity:</span>
              <input
                type="number"
                placeholder="1, 5, 10, 100 etc."
                className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-dark font-medium">Budget:</span>
              <input
                type="number"
                placeholder="Budget for whole order (in INR)"
                className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
              />
            </label>
            <button className="bg-dark text-highlight font-bold py-2 hover:bg-transparent border border-dark hover:text-dark transition-all duration-300 rounded-lg mt-4 w-fit px-6">
              Submit
            </button>
          </form>
        </div>
      </div>
        )
        :
        (
          <div className="flex justify-center items-center">
            <Spinner light={false} />
          </div>
        )
      }
    </div>
  );
};

export default Page;
