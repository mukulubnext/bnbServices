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
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import RegisterStep from "../components/RegisterStep";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import InterestedCategories from "@/components/InterestedCategories";
import { usePersistedState } from "@/hooks/usePersistedState";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { confPhoneOTP } from "@/lib/phoneotp";

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
        </div>
        <div className="relative">
          <Breadcrumbs />
        </div>
        <div className="flex md:fixed right-0 justify-center md:flex-col py-6 gap-5 items-center bg-dark md:w-[50vw] md:h-screen">
          <div className="p-4 hidden md:block rounded-2xl bg-highlight/22">
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
        </div>
      </div>
    </StepContext.Provider>
  );
};

export default Page;

function Register() {
  const RESEND_TIME = 60;
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);

  useEffect(() => {
    if (emailResendTimer === 0) return;
    const timer = setInterval(() => {
      setEmailResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [emailResendTimer]);

  useEffect(() => {
    if (phoneResendTimer === 0) return;
    const timer = setInterval(() => {
      setPhoneResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phoneResendTimer]);

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
  const [confirmMailOTP, setConfirmMailOTP] = usePersistedState(
    "register_seller_confirmMailOTP",
    false,
  );
  const [confirmPhoneOTP, setConfirmPhoneOTP] = usePersistedState(
    "register_seller_confirmPhoneOTP",
    false,
  );
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sentEmailOTP, setSentEmailOTP] = useState(false);
  const [sendingMailOTP, setSendingMailOTP] = useState(false);
  const [confirmingMailOTP, setConfirmingMailOTP] = useState(false);
  const [sentPhoneOTP, setSentPhoneOTP] = useState(false);
  const { stepNumber, setStepNumber, data, setData } = context;
  const [sellerType, setSellerType] = useState<"manufacturer" | "supplier">(
    "manufacturer",
  );
  const [isLoading, setLoading] = useState(false);
  const confirmationRef = useRef<any>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const [sendingPhoneOTP, setSendingPhoneOTP] = useState(false);
  const [confirmingPhoneOTP, setConfirmingPhoneOTP] = useState(false);

  const [fireBaseId, setFireBaseId] = useState("");
  const router = useRouter();

  const getUser = async () => {
    try {
      const res = await axios.get("/api/v1/auth/user");
      const u = res.data.user;
      if (res.data.status === "success") {
        router.replace("/profile/add-details");
      }
    } catch (e) {
      router.replace("/profile/add-details");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" },
      );
    }

    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const handleSendPhoneOTP = async () => {
    try {
      setSendingPhoneOTP(true);
      const res = await axios.post("/api/v1/auth/check", { phone: phone });
      if (res.data.status === "success") {
        if (res.data.exists) {
          toast.error("Phone already exists!");
          setSentPhoneOTP(false);
        } else {
          const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
          const confirmation = await signInWithPhoneNumber(
            auth,
            formattedPhone,
            recaptchaVerifierRef.current!,
          );
          confirmationRef.current = confirmation;
          setSentPhoneOTP(true);
          setPhoneResendTimer(RESEND_TIME);
        }
      } else {
        toast.error(res.data.message ?? "Something went wrong!");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      setSentPhoneOTP(false);
    } finally {
      setSendingPhoneOTP(false);
    }
  };

  const handleConfirmPhoneOTP = async () => {
    try {
      setConfirmingPhoneOTP(true);
      const idToken = await confPhoneOTP(confirmationRef.current, phoneOTP);
      setFireBaseId(idToken);
      const res = await axios.post("/api/v1/otp/phone", { idToken });

      if (res.data.status === "success") {
        setConfirmPhoneOTP(true);
        toast.success("Phone verified");
      }
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setConfirmingPhoneOTP(false);
    }
  };

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
        setEmailResendTimer(RESEND_TIME);
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
  const handleSubmit = async () => {
    if (!email || !password || !phone || !confirmPassword) {
      toast.error("Please fill all the fields!");
      return;
    }
    if (!confirmMailOTP || !confirmPhoneOTP) {
      toast.error("Please confirm with OTP!");
      return;
    }
    if (password === confirmPassword) {
      try {
        setLoading(true);
        const res = await axios.post(`/api/v2/auth/register`, {
          email: email,
          password: password,
          phone: phone,
          role: role,
          isEmailVerified: confirmMailOTP,
          isPhoneVerified: confirmPhoneOTP,
          fireBaseId: fireBaseId,
          sellerType: sellerType,
        });
        if (res.data.status === "success") {
          toast.success("Registered successfully!");
          Object.keys(localStorage)
            .filter((k) => k.startsWith("register_"))
            .forEach((k) => localStorage.removeItem(k));
          await getUser();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    } else {
      toast.warning("Password and Confirm Password must be same");
    }
  };
  return (
    <>
      <div className=" text-dark mb-5">
        <h1 className="font-bold text-xl md:text-4xl">Register with Us</h1>
        <p className="text-sm md:text-[16px]">
          Become a part of BnB by entering the details below
        </p>
      </div>
      <div className="w-full flex justify-center items-center flex-col gap-4">
        <div className="w-full flex justify-center flex-col">
          <label
            htmlFor="email"
            className="font-medium text-sm md:text-lg text-dark"
          >
            Email Address
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (!sentEmailOTP || !sendingMailOTP)) {
                  handleSendMailOTP();
                }
              }}
              type="email"
              id="email"
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-2.5 md:py-3.5 px-4 w-full"
            />
            {!confirmMailOTP && !sendingMailOTP ? (
              !sentEmailOTP && (
                <button
                  onClick={handleSendMailOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-xs md:text-sm bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
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
            <label
              htmlFor="email"
              className="font-medium text-sm md:text-lg text-dark"
            >
              Email OTP
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                value={emailOTP}
                onChange={(e) => setEmailOTP(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !confirmingMailOTP) {
                    handleconfirmMailOTP();
                  }
                }}
                type="text"
                maxLength={6}
                id="email"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-2.5 md:py-3.5 px-4 w-full"
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
            <div className="flex justify-end mt-2 text-sm">
              {emailResendTimer > 0 ? (
                <span className="text-dark/70">
                  Resend OTP in {emailResendTimer}s
                </span>
              ) : (
                <button
                  onClick={handleSendMailOTP}
                  className="text-dark font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
        <div className="w-full flex justify-center flex-col">
          <label
            htmlFor="phone"
            className="font-medium text-sm md:text-lg text-dark"
          >
            Phone Number
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (!sentPhoneOTP || !sendingPhoneOTP)) {
                  handleSendPhoneOTP();
                }
              }}
              type="tel"
              id="phone"
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-2.5 md:py-3.5 px-4 w-full"
            />
            {!confirmPhoneOTP &&
              !sentPhoneOTP &&
              (!sendingPhoneOTP ? (
                <button
                  onClick={handleSendPhoneOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-xs md:text-sm bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  Send OTP
                </button>
              ) : (
                <button className="h-full cursor-not-allowed transition-all duration-300 rounded-md border border-dark absolute text-sm md:text-lg bg-white px-6 right-0 font-bold text-white">
                  <Spinner light={false} />
                </button>
              ))}
            {confirmPhoneOTP && (
              <div className="p-2 text-white bg-dark/90 rounded-full absolute right-5">
                <Check size={20} />
              </div>
            )}
          </div>
        </div>
        {sentPhoneOTP && !confirmPhoneOTP && (
          <div className="w-full flex justify-center flex-col">
            <label
              htmlFor="email"
              className="font-medium text-sm md:text-lg text-dark"
            >
              Phone OTP
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                value={phoneOTP}
                onChange={(e) => setPhoneOTP(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !confirmingPhoneOTP) {
                    handleConfirmPhoneOTP();
                  }
                }}
                type="text"
                maxLength={6}
                id="email"
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-2.5 md:py-3.5 px-4 w-full"
              />
              {!confirmingPhoneOTP ? (
                <button
                  onClick={handleConfirmPhoneOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  <Check />
                </button>
              ) : (
                <button className="h-full cursor-pointer transition-all duration-300 rounded-md border border-dark absolute text-lg bg-white px-6 right-0 font-bold text-white">
                  <Spinner light={false} />
                </button>
              )}
            </div>
            <div className="flex justify-end mt-2 text-sm">
              {phoneResendTimer > 0 ? (
                <span className="text-dark/70">
                  Resend OTP in {phoneResendTimer}s
                </span>
              ) : (
                <button
                  onClick={handleSendPhoneOTP}
                  className="text-dark font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
        <div className="w-full flex justify-center flex-col">
          <label
            htmlFor="confirm"
            className="font-medium text-sm md:text-lg text-dark"
          >
            Password
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              id="confirm"
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-2.5 md:py-3.5 px-4 w-full"
            />
            <button
              onClick={() => setShowPass((e) => !e)}
              className="absolute cursor-pointer text-dark px-6 right-0"
            >
              {showPass ? (
                <EyeClosed className="w-5 h-5 md:w-7 md:h-7" />
              ) : (
                <Eye className="w-5 h-5 md:w-7 md:h-7" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full flex justify-center flex-col">
          <label
            htmlFor="password"
            className="font-medium flex gap-2 items-center text-sm md:text-lg text-dark"
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
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-2.5 md:py-3.5 px-4 w-full"
            />
            <button
              onClick={() => setShowConfirm((e) => !e)}
              className="absolute cursor-pointer text-dark px-6 right-0"
            >
              {showConfirm ? (
                <EyeClosed className="w-5 h-5 md:w-7 md:h-7" />
              ) : (
                <Eye className="w-5 h-5 md:w-7 md:h-7" />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:justify-start gap-2 w-full md:items-center">
          <p className="text-dark text-sm md:text-[16px] font-semibold">
            Choose your seller type:
          </p>
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setSellerType("manufacturer")}
              className={`flex justify-center items-center ${sellerType === "manufacturer" ? "bg-dark text-white" : "text-dark"} transition-all text-sm md:text-[16px] duration-300 font-bold py-2 px-4 rounded-lg`}
            >
              Manufacturer
            </button>
            <p className="text-lg text-dark">/</p>
            <button
              onClick={() => setSellerType("supplier")}
              className={`flex justify-center items-center ${sellerType === "supplier" ? "bg-dark text-white" : "text-dark"} transition-all text-sm md:text-[16px] duration-300 font-bold py-2 px-4 rounded-lg`}
            >
              Supplier
            </button>
          </div>
        </div>
        <div id="recaptcha-container"></div>
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
