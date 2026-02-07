"use client";
import { StepContext } from "@/app/register/buyer/page";
import RegisterStep from "@/app/register/components/RegisterStep";
import Breadcrumbs from "@/components/Breadcrumbs";
import InterestedCategories from "@/components/InterestedCategories";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import { usePersistedState } from "@/hooks/usePersistedState";
import axios from "axios";
import { LinkIcon, ShoppingBag, Users } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [stepNumber, setStepNumber] = useState(1);
  const [data, setData] = useState<any>({});
  const { user, loading } = useAuth();
  const isAuthReady = !loading && user;
  const router = useRouter();
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    const hasProfile =
      user.companyName &&
      user.address &&
      user.city &&
      user.state &&
      user.zipCode &&
      user.inceptionDate &&
      user.employeeCount;

    if (!hasProfile) {
      setStepNumber(1);
      return;
    }

    if (!user.interestedCategories || user.interestedCategories.length === 0) {
      setStepNumber(2);
      return;
    }

    router.replace("/home");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="bg-light w-screen h-screen flex justify-center items-center">
        <Spinner light={false} />
      </div>
    );
  }
  return (
    <StepContext.Provider value={{ stepNumber, setStepNumber, data, setData }}>
      <ToastContainer />
      <div className="flex relative md:flex-row flex-col-reverse bg-light">
        <Breadcrumbs />
        <div className="flex flex-col gap-4 px-[5%] py-[10%] relative md:py-[5%] md:w-[50vw] min-h-screen h-fit">
          {!loading ? (
            <>
              {stepNumber === 1 && <Profile user={user} />}
              {stepNumber === 2 && <AdditionalInfo />}
            </>
          ) : (
            <div className="flex justify-center items-center">
              <Spinner light={false} />
            </div>
          )}
        </div>
        <div className="relative">
          <Breadcrumbs />
        </div>
        <div className="flex md:fixed right-0 justify-center md:flex-col py-6 gap-5 items-center bg-dark md:w-[50vw] md:h-screen">
          <div className="p-4 rounded-2xl bg-highlight/22">
            <ShoppingBag className="text-highlight lg:w-15 lg:h-15 md:w-10 md:h-10 w-8 h-8" />
          </div>
          <div className="flex flex-col justify-center gap-2 items-center">
            <h1 className="text-highlight text-center font-semibold text-2xl md:text-4xl lg:text-[40px]">
              Join as a{" "}
              <span className="capitalize">{user.role ?? "Buyer/Seller"}</span>
            </h1>
            <p className="lg:text-xl md:text-lg text-[8px] md:max-w-[80%] text-center text-highlight">
              Browse tools, manage subscriptions, and enjoy exclusive
              marketplace benefits.
            </p>
          </div>
        </div>
      </div>
    </StepContext.Provider>
  );
};
function Profile({ user }: { user: any }) {
  const context = useContext(StepContext);
  if (!context) return null;
  const { stepNumber, setStepNumber, setData } = context;
  const [companyName, setCompanyName] = usePersistedState(
    "profile_companyName",
    "",
  );
  const [addressLine1, setAddressLine1] = usePersistedState(
    "profile_addressLine1",
    "",
  );
  const [addressLine2, setAddressLine2] = usePersistedState(
    "profile_addressLine2",
    "",
  );
  const [city, setCity] = usePersistedState("profile_city", "");
  const [stateName, setStateName] = usePersistedState("profile_stateName", "");
  const [zipCode, setZipCode] = usePersistedState("profile_zipCode", "");
  const [inceptionDate, setInceptionDate] = usePersistedState(
    "profile_inceptionDate",
    "",
  );
  const [employeeCount, setEmployeeCount] = usePersistedState(
    "profile_employeeCount",
    "",
  );
  const [pastLegalAction, setPastLegalAction] = usePersistedState(
    "profile_pastLegalAction",
    false,
  );
  const [pastLegalExplanation, setPastLegalExplanation] = usePersistedState(
    "profile_pastLegalExplanation",
    "",
  );
  const [gstNumber, setGstNumber] = usePersistedState("profile_gstNumber", "");
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (
      !companyName ||
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
    const body = user.role === "buyer" ? {
      companyName: companyName,
      address: addressLine1 + " " + addressLine2,
      city: city,
      state: stateName,
      zipCode: zipCode,
      inceptionDate: inceptionDate,
      employeeCount: employeeCount,
      pastLegalAction: pastLegalAction,
      pastLegalExplanation: pastLegalExplanation,
    }:
    {
      companyName: companyName,
      address: addressLine1 + " " + addressLine2,
      city: city,
      state: stateName,
      zipCode: zipCode,
      inceptionDate: inceptionDate,
      employeeCount: employeeCount,
      pastLegalAction: pastLegalAction,
      pastLegalExplanation: pastLegalExplanation,
      gstNumber: gstNumber,
    };
    setLoading(true);
    try {
      const res = await axios.post("/api/v2/profile", body);
      if (res.data.status === "success") {
        toast.success("Profile details added successfully!");
        Object.keys(localStorage)
          .filter((k) => k.startsWith("profile_"))
          .forEach((k) => localStorage.removeItem(k));
      } else {
        toast.error(res.data.message || "Something went wrong!");
        return;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong!");
      return;
    } finally {
      setLoading(false);
    }
    setStepNumber(2);
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
        {user.role === "seller" && (
          <div className="w-full flex justify-center flex-col">
            <label htmlFor="gst" className="font-medium text-xl text-dark">
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
        )}
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
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white p-3.5 pl-10 w-full"
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
            Any past legal action/specification that may affect {user.role === "buyer" ? "seller" : "buyer"} in
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
        {!isLoading ? (
          <button
            onClick={handleSubmit}
            className="text-xl my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark"
          >
            Submit
          </button>
        ) : (
          <button className=" my-6 py-4 ring-1 ring-dark transition-all duration-300 w-full flex justify-center items-center">
            <Spinner light={false} />
          </button>
        )}
      </div>
    </>
  );
}

function AdditionalInfo() {
  const [interestedCategories, setInterestedCategories] = usePersistedState<
    any[]
  >("register_seller_interestedCategories", []);
  const router = useRouter();
  const [website, setWebsite] = usePersistedState(
    "register_seller_website",
    "",
  );

  const [isLoading, setLoading] = useState(false);
  const context = useContext(StepContext);
  if (!context) return null;
  const { refresh } = useAuth();

  const { stepNumber, setStepNumber, data, setData } = context;

  const handleSubmit = async () => {
    setLoading(true);
    const interestedSubCategories = interestedCategories.flatMap(
      (cat) => cat.subCategories,
    );
    const body = {
      interestedCategories: interestedCategories,
      interestedSubCategories: interestedSubCategories,
      companyWebsite: website,
    };
    const payload = {
      ...body,
    };
    try {
      const res = await axios.post("/api/v2/profile/additional", payload);
      if (res.data.status === "success") {
        toast.success("Registered successfully!");
        Object.keys(localStorage)
          .filter((k) => k.startsWith("register_"))
          .forEach((k) => localStorage.removeItem(k));
        await refresh();
        router.push("/home");
      } else {
        toast.error(res.data.message ?? "Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-dark mb-5">
        <h1 className="font-bold text-4xl">Add Additional Details</h1>
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
              onChange={(e) => setWebsite(e.target.value)}
              value={website}
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

export default Page;
