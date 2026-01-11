"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Check,
  Eye,
  EyeClosed,
  LinkIcon,
  Search,
  Store,
  Users,
  X,
} from "lucide-react";
import { NextPage } from "next";
import React, { createContext, useContext, useState } from "react";
import RegisterStep from "../components/RegisterStep";
import Link from "next/link";

interface Props {}

type StepContextType = {
  stepNumber: number;
  setStepNumber: React.Dispatch<React.SetStateAction<number>>;
};

const StepContext = createContext<StepContextType | null>(null);
const role = "seller";

const Page: NextPage<Props> = ({}) => {
  const [stepNumber, setStepNumber] = useState(1);
  return (
    <StepContext.Provider value={{ stepNumber, setStepNumber }}>
      <div className="flex relative md:flex-row flex-col-reverse bg-light">
        <Breadcrumbs />
        <div className="flex flex-col gap-4 px-[5%] py-[10%] md:py-[5%] md:w-[50vw] min-h-screen h-fit">
          {stepNumber === 1 && <Register />}
          {stepNumber === 2 && <Profile />}
          {stepNumber === 3 && <AdditionalInfo />}
          <div className="flex relative top-4 md:hidden justify-center items-center">
            <RegisterStep active={stepNumber} invert={true} />
          </div>
        </div>
        <div className="relative">
          <Breadcrumbs />
        </div>
        <div className="flex md:fixed right-0 justify-center md:flex-col py-6 gap-5 items-center bg-dark md:w-[50vw] md:h-screen">
          <div className="p-4 rounded-2xl bg-highlight/22">
            <Store className="text-highlight lg:w-15 lg:h-15 md:w-10 md:h-10 w-8 h-8" />
          </div>
          <div className="flex flex-col justify-center gap-2 items-center">
            <h1 className="text-highlight text-center font-semibold text-2xl md:text-4xl lg:text-[40px]">
              Join as a Seller
            </h1>
            <p className="lg:text-xl md:text-lg text-[8px] md:max-w-[80%] text-center text-highlight">
              Manage inventory, reach millions, and scale your storefront
              globally.
            </p>
          </div>
        <div className="hidden justify-center items-center md:flex">
          <RegisterStep active={stepNumber} />
        </div>
        </div>
      </div>
    </StepContext.Provider>
  );
};

export default Page;

function Register() {
  const context = useContext(StepContext);
  if (!context) return null;
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sentEmailOTP, setSentEmailOTP] = useState(false);
  const [sentPhoneOTP, setSentPhoneOTP] = useState(false);
  const [confirmEmailOTP, setConfirmEmailOTP] = useState(false);
  const [confirmPhoneOTP, setConfirmPhoneOTP] = useState(false);
  const { stepNumber, setStepNumber } = context;

  const handleSendEmailOTP = () => {
    setSentEmailOTP(true);
  };
  const handleSendPhoneOTP = () => {
    setSentPhoneOTP(true);
  };
  const handleConfirmEmailOTP = () => {
    setConfirmEmailOTP(true);
  };
  const handleConfirmPhoneOTP = () => {
    setConfirmPhoneOTP(true);
  };
  const handleSubmit = () => {
    if (stepNumber === 1) {
      setStepNumber(2);
    }
  };
  return (
    <>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
            />
            {!sentEmailOTP && (
              <button
                onClick={handleSendEmailOTP}
                className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-sm md:text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
              >
                Send OTP
              </button>
            )}
            {confirmEmailOTP && (
              <div className="p-2 text-white bg-dark/90 rounded-full absolute right-5">
                <Check size={20} />
              </div>
            )}
          </div>
        </div>
        {sentEmailOTP && !confirmEmailOTP && (
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="email" className="font-medium text-xl text-dark">
              Email OTP
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                value={emailOTP}
                onChange={(e) => setEmailOTP(e.target.value)}
                type="email"
                id="email"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
              <button
                onClick={handleConfirmEmailOTP}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
                value={phoneOTP}
                onChange={(e) => setPhoneOTP(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
        <button
          onClick={handleSubmit}
          className="text-xl my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark"
        >
          Submit
        </button>
        <Link href={"/signin"} className="text-dark underline hover:no-underline">Already Registered?</Link>
      </div>
    </>
  );
}

function Profile() {
  const context = useContext(StepContext);
  if (!context) return null;

  const { stepNumber, setStepNumber } = context;
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [inceptionDate, setInceptionDate] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [pastLegalAction, setPastLegalAction] = useState(false);
  const [pastLegalExplanation, setPastLegalExplanation] = useState("");

  const handleSubmit = () => {
    setStepNumber(3);
  };

  return (
    <>
      <div className=" text-dark mb-5">
        <h1 className="font-bold text-4xl">Add Profile Details</h1>
        <p>Complete your buyer profile by filling necessary details</p>
      </div>
      <div className="w-full flex justify-center items-center flex-col gap-4">
        <div className="w-full flex justify-center flex-col">
          <label htmlFor="company" className="font-medium text-xl text-dark">
            Company Name
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
            />
          </div>
        </div>
        <div className="w-full flex justify-center flex-col">
          <label htmlFor="company" className="font-medium text-xl text-dark">
            GST Number
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              id="gst"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
            />
          </div>
        </div>
        <div className="w-full flex justify-center flex-col">
          <label htmlFor="address1" className="font-medium text-xl text-dark">
            Address Line 1
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              id="address1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
            />
          </div>
        </div>
        <div className="w-full flex justify-center flex-col">
          <label htmlFor="address2" className="font-medium text-xl text-dark">
            Address Line 2
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              id="address2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
            />
          </div>
        </div>
        <div className="flex justify-between w-full gap-6">
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="city" className="font-medium text-xl text-dark">
              City
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
            </div>
          </div>
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="state" className="font-medium text-xl text-dark">
              State
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                id="state"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
            </div>
          </div>
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="zip" className="font-medium text-xl text-dark">
              Zip Code
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                id="zip"
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={6}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full gap-6">
          <div className="w-full flex justify-center flex-col">
            <label
              htmlFor="inception"
              className="font-medium text-xl text-dark"
            >
              Inception Date
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                type="date"
                id="inception"
                value={inceptionDate}
                onChange={(e) => setInceptionDate(e.target.value)}
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
            </div>
          </div>
          <div className="w-full flex justify-center flex-col">
            <label
              htmlFor="employeeCount"
              className="font-medium text-xl text-dark"
            >
              Employee Count
            </label>
            <div className="relative">
              <select
                id="employeeCount"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 pl-10 w-full"
              >
                <option value="" disabled>
                  Select Employee Count
                </option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
              <Users className="left-5 top-1/2 -translate-1/2 text-dark absolute" />
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <p className="font-medium text-dark">
            Any past legal action/specification that may affect seller in
            future?
          </p>
          <div>
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                className="form-radio text-highlight"
                name="legalAction"
                value="yes"
                checked={pastLegalAction === true}
                onChange={() => setPastLegalAction(true)}
              />
              <span className="ml-2 text-dark">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-highlight"
                name="legalAction"
                value="no"
                checked={pastLegalAction === false}
                onChange={() => setPastLegalAction(false)}
              />
              <span className="ml-2 text-dark">No</span>
            </label>
          </div>
        </div>
        {pastLegalAction && (
          <div className="w-full flex justify-center flex-col">
            <label
              htmlFor="legalExplanation"
              className="font-medium text-xl text-dark"
            >
              Please explain
            </label>
            <div className="flex justify-center relative items-center w-full">
              <textarea
                id="legalExplanation"
                value={pastLegalExplanation}
                onChange={(e) => setPastLegalExplanation(e.target.value)}
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
              />
            </div>
          </div>
        )}
        <button
          onClick={handleSubmit}
          className="text-xl my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark"
        >
          Submit
        </button>
      </div>
    </>
  );
}

function AdditionalInfo() {
  const [interestedCategories, setInterestedCategories] = useState<string[]>(
    []
  );
  const [search, setSearch] = useState("");

  const dummyCategories = [
    "Cloud Services",
    "AI & Machine Learning",
    "DevOps Tools",
    "Cybersecurity",
    "Data Analytics",
    "IoT Solutions",
    "Blockchain Technology",
    "Mobile App Development",
    "E-commerce Platforms",
    "Collaboration Software",
  ];

  const filteredCategories = dummyCategories.filter(
    (cat) =>
      cat.toLowerCase().includes(search.toLowerCase()) &&
      !interestedCategories.includes(cat)
  );

  const addCategory = (cat: string) => {
    if (interestedCategories.length >= 5) return;
    setInterestedCategories([...interestedCategories, cat]);
    setSearch("");
  };

  const removeCategory = (cat: string) => {
    setInterestedCategories(interestedCategories.filter((c) => c !== cat));
  };

  const handleSubmit = () => {
    console.log("Selected:", interestedCategories);
  };

  return (
    <>
      <div className="text-dark mb-5">
        <h1 className="font-bold text-4xl">Add Additional Details</h1>
        <p>(Optional)</p>
      </div>

      <div className="w-full flex flex-col gap-4">
        {/* CATEGORY SEARCH */}
        <div className="w-full flex flex-col">
          <label className="font-medium text-xl text-dark">
            Interested Categories
          </label>

          <div className="relative w-full">
            <input
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 pl-12 w-full"
              placeholder="Search Categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark" />
          </div>

          {/* Dropdown */}
          {search && filteredCategories.length > 0 && (
            <div className="border mt-2 rounded-md bg-white shadow-md max-h-40 overflow-y-auto">
              {filteredCategories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => addCategory(cat)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {cat}
                </div>
              ))}
            </div>
          )}

          {/* Selected badges */}
          {interestedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {interestedCategories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center gap-2 bg-dark font-medium text-white px-3 py-1 rounded-full text-sm"
                >
                  {cat}
                  <button onClick={() => removeCategory(cat)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-dark/90 mt-1">
            {interestedCategories.length}/5 selected
          </p>
        </div>

        {/* ADDRESS */}
        <div className="w-full flex flex-col">
          <label className="font-medium text-xl text-dark">
            Link for company website
          </label>
          <div className="relative">
            <input className="border border-dark pl-12 text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full" />
            <LinkIcon className="absolute text-dark left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="text-xl my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark"
        >
          Submit
        </button>
      </div>
    </>
  );
}
