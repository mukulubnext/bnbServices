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
import React, { createContext, useContext, useEffect, useState } from "react";
import RegisterStep from "../components/RegisterStep";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import InterestedCategories from "@/components/InterestedCategories";
import { usePersistedState } from "@/hooks/usePersistedState";

interface Props {}

type StepContextType = {
  stepNumber: number;
  setStepNumber: React.Dispatch<React.SetStateAction<number>>;
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
};

const StepContext = createContext<StepContextType | null>(null);
const role = "seller";

const Page: NextPage<Props> = ({}) => {
  const [stepNumber, setStepNumber] = useState(1);
  const [data, setData] = useState<any>({});
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [user, loading, router]);
  return (
    <StepContext.Provider value={{ stepNumber, setStepNumber, data, setData }}>
      <ToastContainer />
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
  const [email, setEmail] = usePersistedState("register_seller_email", "");
  const [phone, setPhone] = usePersistedState("register_seller_phone", "");
  const [password, setPassword] = usePersistedState(
    "register_seller_password",
    "",
  );
  const [confirmPassword, setConfirmPassword] = usePersistedState(
    "register_seller_confirmPassword",
    "",
  );
  const [phoneOTP, setPhoneOTP] = usePersistedState(
    "register_seller_phoneOTP",
    "",
  );
  const [emailOTP, setEmailOTP] = usePersistedState(
    "register_seller_emailOTP",
    "",
  );
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sentEmailOTP, setSentEmailOTP] = useState(false);
  const [sendingMailOTP, setSendingMailOTP] = useState(false);
  const [confirmingMailOTP, setConfirmingMailOTP] = useState(false);
  const [sentPhoneOTP, setSentPhoneOTP] = useState(false);
  const [confirmMailOTP, setConfirmMailOTP] = useState(false);
  const [confirmPhoneOTP, setConfirmPhoneOTP] = useState(false);
  const { stepNumber, setStepNumber, data, setData } = context;
  const [sellerType, setSellerType] = useState<"manufacturer" | "supplier">(
    "manufacturer",
  );
  const [isLoading, setLoading] = useState(false);

  const handleSendMailOTP = async () => {
    try {
      setSendingMailOTP(true);
      if (!email) {
        toast.error("Please enter email.");
        setSentEmailOTP(false);
        return;
      }
      const res = await axios.post("/api/v1/otp/email", { email: email });
      if (res.data.status === "success") {
        toast.success("OTP sent successfully.");
        setSentEmailOTP(true);
      } else {
        toast.error(res.data.message);
        setSentEmailOTP(false);
      }
    } catch (err) {
      toast.error("Something went wrong.");
      setSentEmailOTP(false);
    } finally {
      setSendingMailOTP(false);
    }
  };
  const handleSendPhoneOTP = () => {
    setSentPhoneOTP(true);
  };
  const handleconfirmMailOTP = async () => {
    try {
      setConfirmingMailOTP(true);
      const res = await axios.post("/api/v1/otp/email/verify", {
        email: email,
        otp: emailOTP,
      });
      if (res.data.status === "success") {
        toast.success("OTP verified successfully.");
        setConfirmMailOTP(true);
      } else {
        toast.error(res.data.message);
        setConfirmMailOTP(false);
      }
    } catch (err) {
      toast.error("Something went wrong.");
      setConfirmMailOTP(false);
    } finally {
      setConfirmingMailOTP(false);
    }
  };
  const handleConfirmPhoneOTP = () => {
    setConfirmPhoneOTP(true);
  };
  const handleSubmit = async () => {
    if (!email || !password || !phone || !role) {
      toast.error("Please fill all the fields!");
      return;
    }
    if (!confirmMailOTP || !confirmPhoneOTP) {
      toast.error("Please confirm with OTP!");
      return;
    }
    if (password === confirmPassword) {
      setLoading(true);
      const check = {
        email: email,
        phone: phone,
      };
      const res = await axios.post(`/api/v1/auth/checkExisting`, check);
      if (res.data.status === "success") {
        if (res.data.exists) {
          toast.error("User already exists with this email/phone!");
          setLoading(false);
          return;
        }
      }
      const body = {
        email: email,
        password: password,
        phone: phone,
        isEmailVerified: confirmMailOTP,
        isPhoneVerified: confirmPhoneOTP,
        role: role,
        sellerType: sellerType,
      };
      setData((e: any) => ({ ...e, ...body }));
      setStepNumber(2);
    } else {
      toast.warning("Password and Confirm Password must be same");
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
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
            />
            {!sendingMailOTP ? (
              !sentEmailOTP && (
                <button
                  onClick={handleSendMailOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-sm md:text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  Send OTP
                </button>
              )
            ) : (
              <button className="h-full cursor-not-allowed transition-all duration-300 rounded-md border border-dark absolute text-sm md:text-lg bg-white px-6 right-0 font-bold text-white">
                <Spinner light={false} />
              </button>
            )}
            {confirmMailOTP && (
              <div className="p-2 text-white bg-dark/90 rounded-full absolute right-5">
                <Check size={20} />
              </div>
            )}
          </div>
        </div>
        {sentEmailOTP && !confirmMailOTP && (
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
              />
              {!confirmingMailOTP ? (
                <button
                  onClick={handleconfirmMailOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  <Check />
                </button>
              ) : (
                <button
                  onClick={handleconfirmMailOTP}
                  className="h-full cursor-pointer transition-all duration-300 rounded-md border border-dark absolute text-lg bg-white px-6 right-0 font-bold text-white"
                >
                  <Spinner light={false} />
                </button>
              )}
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
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
          <label
            htmlFor="password"
            className="font-medium flex gap-2 items-center text-xl text-dark"
          >
            Confirm Password{" "}
            {password !== confirmPassword &&
              confirmPassword !== "" &&
              password !== "" && (
                <p className="text-xs text-red-500">
                  Doesnt match with password
                </p>
              )}
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirm ? "text" : "password"}
              id="password"
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
            />
            <button
              onClick={() => setShowConfirm((e) => !e)}
              className="absolute cursor-pointer text-dark px-6 right-0"
            >
              {showConfirm ? <EyeClosed size={32} /> : <Eye size={32} />}
            </button>
          </div>
        </div>
        <div className="flex justify-start gap-2 w-full items-center">
          <p className="text-dark font-semibold">Choose your seller type:</p>
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setSellerType("manufacturer")}
              className={`flex justify-center items-center ${sellerType === "manufacturer" ? "bg-dark text-white" : "text-dark"} transition-all duration-300 font-bold py-2 px-4 rounded-lg`}
            >
              Manufacturer
            </button>
            <p className="text-lg text-dark">/</p>
            <button
              onClick={() => setSellerType("supplier")}
              className={`flex justify-center items-center ${sellerType === "supplier" ? "bg-dark text-white" : "text-dark"} transition-all duration-300 font-bold py-2 px-4 rounded-lg`}
            >
              Supplier
            </button>
          </div>
        </div>
        {!isLoading ? (
          <button
            onClick={handleSubmit}
            className="text-xl my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="text-xl my-6 flex justify-center items-center font-bold bg-muted w-full py-4 ring-1 ring-dark transition-all duration-300"
          >
            <Spinner light={false} />
          </button>
        )}
        <Link
          href={"/signin"}
          className="text-dark underline hover:no-underline"
        >
          Already Registered?
        </Link>
      </div>
    </>
  );
}

function Profile() {
  const context = useContext(StepContext);
  if (!context) return null;

  const { stepNumber, setStepNumber, data, setData } = context;
  const [companyName, setCompanyName] = usePersistedState(
    "register_seller_companyName",
    "",
  );
  const [gstNumber, setGstNumber] = usePersistedState(
    "register_seller_gstNumber",
    "",
  );
  const [addressLine1, setAddressLine1] = usePersistedState(
    "register_seller_addressLine1",
    "",
  );
  const [addressLine2, setAddressLine2] = usePersistedState(
    "register_seller_addressLine2",
    "",
  );
  const [city, setCity] = usePersistedState("register_seller_city", "");
  const [stateName, setStateName] = usePersistedState(
    "register_seller_stateName",
    "",
  );
  const [zipCode, setZipCode] = usePersistedState(
    "register_seller_zipCode",
    "",
  );
  const [inceptionDate, setInceptionDate] = usePersistedState(
    "register_seller_inceptionDate",
    "",
  );
  const [employeeCount, setEmployeeCount] = usePersistedState(
    "register_seller_employeeCount",
    "",
  );
  const [pastLegalAction, setPastLegalAction] = usePersistedState(
    "register_seller_pastLegalAction",
    false,
  );
  const [pastLegalExplanation, setPastLegalExplanation] = usePersistedState(
    "register_seller_pastLegalExplanation",
    "",
  );

  const handleSubmit = () => {
    if (
      !companyName ||
      !gstNumber ||
      !addressLine1 ||
      !city ||
      !stateName ||
      !zipCode ||
      !inceptionDate ||
      !employeeCount
    ) {
      toast.error("Please fill all the fields!");
      return;
    }
    const body = {
      companyName: companyName,
      address: addressLine1 + " " + addressLine2,
      gstNumber: gstNumber,
      city: city,
      state: stateName,
      zipCode: zipCode,
      inceptionDate: inceptionDate,
      employeeCount: employeeCount,
      pastLegalAction: pastLegalAction,
      pastLegalExplanation: pastLegalExplanation,
    };
    setData((e: any) => ({ ...e, ...body }));
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
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full pl-10"
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full"
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
  const [interestedCategories, setInterestedCategories] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [website, setWebsite] = useState("");
  const context = useContext(StepContext);
  if (!context) return null;
  const { stepNumber, setStepNumber, data, setData } = context;

  const handleSubmit = async () => {
    setLoading(true);
    if (
      website !== "" &&
      !website.includes("https://") &&
      !website.includes("http://")
    ) {
      toast.error("Please enter full website url with https:// or http://");
      return;
    }
    const interestedSubCategories = interestedCategories.flatMap((cat)=>cat.subCategories);
    const body = {
      interestedCategories: interestedCategories,
      interestedSubCategories: interestedSubCategories,
      companyWebsite: website,
    };
    const payload = {
      ...data,
      ...body,
    };
    try {
      const res = await axios.post("/api/v1/auth/register", payload);

      if (res.data.status === "success") {
        toast.success("Registered successfully!");
        window.location.href = `/signin`;
      } else {
        toast.error(res.data.message ?? "Something went wrong!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-dark mb-5">
        <h1 className="font-bold text-4xl">Add Additional Details</h1>
        <p>(Optional)</p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col">
          <label className="font-medium text-xl text-dark">
            Interested Categories
          </label>
          <InterestedCategories
            interestedCategories={interestedCategories}
            setInterestedCategories={setInterestedCategories}
          />
        </div>
        <div className="w-full flex flex-col">
          <label className="font-medium text-xl text-dark">
            Link for company website
          </label>
          <div className="relative">
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-3.5 px-4 w-full pl-12"
            />
            <LinkIcon className="absolute text-dark left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {!isLoading ? (
          <button
            onClick={handleSubmit}
            className="text-xl my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark"
          >
            {website === "" && interestedCategories.length === 0
              ? "Skip"
              : "Submit"}
          </button>
        ) : (
          <button className="text-xl my-6 font-bold bg-muted flex justify-center items-center w-full py-4 ring-1 ring-dark transition-all duration-300 ">
            <Spinner light={false} />
          </button>
        )}
      </div>
    </>
  );
}
