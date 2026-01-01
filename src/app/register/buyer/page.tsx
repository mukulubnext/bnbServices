"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Check, Eye, EyeClosed, ShoppingBag } from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sentMailOTP, setSentMailOTP] = useState(false);
  const [sentPhoneOTP, setSentPhoneOTP] = useState(false);
  const [confirmMailOTP, setConfirmMailOTP] = useState(false);
  const [confirmPhoneOTP, setConfirmPhoneOTP] = useState(false);

  const handleSendMailOTP = () => {
    setSentMailOTP(true);
  };
  const handleSendPhoneOTP = () => {
    setSentPhoneOTP(true);
  };
  const handleConfirmMailOTP = () => {
    setConfirmMailOTP(true);
  };
  const handleConfirmPhoneOTP = () => {
    setConfirmPhoneOTP(true);
  };

  return (
    <div className="flex relative md:flex-row flex-col-reverse bg-light">
      <Breadcrumbs />
      <div className="flex flex-col gap-4 px-[5%] py-[10%] md:py-[5%] md:w-[50vw] h-screen">
        <div className=" text-dark mb-5">
          <h1 className="font-bold text-4xl">Register with Us</h1>
          <p>Become a part of Solaris by entering the details below</p>
        </div>
        <div className="w-full flex justify-center items-center flex-col gap-4">
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="email" className="font-medium text-xl text-dark">
              Email Address
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                type="email"
                id="email"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
              {!sentMailOTP && (
                <button
                  onClick={handleSendMailOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-sm md:text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  Send OTP
                </button>
              )}
              {confirmMailOTP && (
                <div className="p-2 text-white bg-dark/90 rounded-full absolute right-5">
                  <Check size={20} />
                </div>
              )}
            </div>
          </div>
          {sentMailOTP && !confirmMailOTP && (
            <div className="w-full flex justify-center flex-col">
              <label htmlFor="email" className="font-medium text-xl text-dark">
                Email OTP
              </label>
              <div className="flex justify-center relative items-center w-full">
                <input
                  type="email"
                  id="email"
                  className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
                />
                <button
                  onClick={handleConfirmMailOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  <Check />
                </button>
              </div>
            </div>
          )}
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="phone" className="font-medium text-xl text-dark">
              Phone Number
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                type="tel"
                id="phone"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
              {!sentPhoneOTP && (
                <button
                  onClick={handleSendPhoneOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-sm md:text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  Send OTP
                </button>
              )}
              {confirmPhoneOTP && (
                <div className="p-2 text-white bg-dark/90 rounded-full absolute right-5">
                  <Check size={20} />
                </div>
              )}
            </div>
          </div>
          {sentPhoneOTP && !confirmPhoneOTP && (
            <div className="w-full flex justify-center flex-col">
              <label htmlFor="email" className="font-medium text-xl text-dark">
                Phone OTP
              </label>
              <div className="flex justify-center relative items-center w-full">
                <input
                  type="email"
                  id="email"
                  className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
                />
                <button
                  onClick={handleConfirmPhoneOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  <Check />
                </button>
              </div>
            </div>
          )}
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="confirm" className="font-medium text-xl text-dark">
              Password
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                type={showPass ? "text" : "password"}
                id="confirm"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
              <button
                onClick={() => setShowPass((e) => !e)}
                className="absolute cursor-pointer text-dark px-6 right-0"
              >
                {showPass ? <EyeClosed size={32} /> : <Eye size={32} />}
              </button>
            </div>
          </div>
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="password" className="font-medium text-xl text-dark">
              Confirm Password
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                type={showConfirm ? "text" : "password"}
                id="password"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
              <button
                onClick={() => setShowConfirm((e) => !e)}
                className="absolute cursor-pointer text-dark px-6 right-0"
              >
                {showConfirm ? <EyeClosed size={32} /> : <Eye size={32} />}
              </button>
            </div>
          </div>
          <button className="text-xl my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark">
            Submit
          </button>
        </div>
      </div>
      <div className="relative">
          <Breadcrumbs/>
      </div>
      <div className="flex justify-center md:flex-col py-6 gap-5 items-center bg-dark md:w-[50vw] md:h-screen">
        <div className="p-4 rounded-2xl bg-highlight/22">
          <ShoppingBag className="text-highlight lg:w-15 lg:h-15 md:w-10 md:h-10 w-8 h-8" />
        </div>
        <div className="flex flex-col justify-center gap-2 items-center">
          <h1 className="text-highlight text-center font-semibold text-2xl md:text-4xl lg:text-[40px]">
            Join as a Buyer
          </h1>
          <p className="lg:text-xl md:text-lg text-[8px] md:max-w-[80%] text-center text-highlight">
            Browse tools, manage subscriptions, and enjoy exclusive marketplace
            benefits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
