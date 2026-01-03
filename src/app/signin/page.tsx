"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Eye, EyeClosed, LogIn } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = () => {
  }

  return (
    <div className="flex relative md:flex-row flex-col-reverse bg-light">
      <Breadcrumbs />
      <div className="flex flex-col gap-4 px-[5%] py-[10%] relative md:py-[5%] md:w-[50vw] min-h-screen h-fit">
        <div className=" text-dark mb-5">
          <h1 className="font-bold text-4xl">Sign In</h1>
          <p>Access your Buyer/Seller account </p>
        </div>
        <div className="flex flex-col">
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="email" className="font-medium text-xl text-dark">
              Email Address
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
            </div>
          </div>
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="password" className="font-medium text-xl text-dark">
              Password
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                id="password"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
              <button
                onClick={() => setShowPass((e) => !e)}
                className="absolute cursor-pointer text-dark px-6 right-0"
              >
                {showPass ? <EyeClosed size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
          <Link
            href={"/forgot-password"}
            className="text-dark underline hover:no-underline transition-all duration-300"
          >
            Forgot Password?
          </Link>
          <Link href={"/home"} className="text-xl text-center my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark">
            Submit
          </Link>
        </div>
        <div className="flex relative top-4 md:hidden justify-center items-center"></div>
      </div>
      <div className="relative">
        <Breadcrumbs />
      </div>
      <div className="flex md:fixed right-0 justify-center md:flex-col py-6 gap-5 items-center bg-dark md:w-[50vw] md:h-screen">
        <div className="p-4 rounded-2xl bg-highlight/22">
          <LogIn className="text-highlight lg:w-15 lg:h-15 md:w-10 md:h-10 w-8 h-8" />
        </div>
        <div className="flex flex-col justify-center gap-2 items-center">
          <h1 className="text-highlight text-center font-semibold text-2xl md:text-4xl lg:text-[40px]">
            Sign In into your Account
          </h1>
          <p className="lg:text-xl md:text-lg text-[8px] md:max-w-[80%] text-center text-highlight">
            Browse tools, manage subscriptions, and enjoy exclusive marketplace
            benefits.
          </p>
        </div>
        <div className="hidden justify-center items-center md:flex"></div>
      </div>
    </div>
  );
};

export default Page;
