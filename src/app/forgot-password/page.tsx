"use client";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [email, setEmail] = useState("");
  return (
    <div className="bg-light w-screen h-screen flex justify-center items-center">
      <Navbar solid />
      <div className="bg-white py-5 px-5 md:px-10 max-w-[90%] rounded-lg flex flex-col relative bottom-[2%] gap-5 w-fit border text-dark">
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-2xl text-center">Forgot Password?</h1>
          <p className="text-xs text-center">
            No worries, we'll send you reset instructions.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <label htmlFor="email" className="font-bold text-sm text-dark/80">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="john.doe@xyz.com"
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-sm md:text-[16px] bg-white w-full p-2"
            />
          </div>
          <button className="bg-dark text-white py-2 px-5 w-full my-3 rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer">
            Submit
          </button>
          <Link href={"/signin"} className="flex w-fit mx-auto flex-col group justify-center items-center gap-2 text-sm cursor-pointer">
            <div className="flex justify-center pl-2 pr-5 items-center gap-2">
                <ArrowLeft size={16} /> Back to sign in
            </div>
            <div className="h-0.5 rounded w-full bg-dark/40 group-hover:opacity-100 transition-all duration-300 opacity-0"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
