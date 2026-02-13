"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Check,
  Eye,
  EyeClosed,
  LinkIcon,
  ShoppingBag,
  Users,
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
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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

export const StepContext = createContext<StepContextType | null>(null);
const role = "buyer";

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
        <div className="flex flex-col gap-4 px-[5%] py-[10%] relative md:py-[5%] md:w-[50vw] min-h-screen h-fit">
          {!loading ? (
            <>{stepNumber === 1 && <Register />}</>
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
          <div className="p-4 hidden md:block rounded-2xl bg-highlight/22">
            <ShoppingBag className="text-highlight lg:w-15 lg:h-15 md:w-10 md:h-10 w-8 h-8" />
          </div>
          <div className="flex flex-col justify-center gap-2 items-center">
            <h1 className="text-highlight text-center font-semibold text-2xl md:text-4xl lg:text-[40px]">
              Join as a Buyer
            </h1>
            <p className="lg: text-xl md:text-lg text-[8px] md:max-w-[80%] text-center text-highlight">
              Browse tools, manage subscriptions, and enjoy exclusive
              marketplace benefits.
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

  const [email, setEmail] = usePersistedState("register_email", "");
  const [phone, setPhone] = usePersistedState("register_phone", "");
  const [password, setPassword] = usePersistedState("register_password", "");
  const [confirmPassword, setConfirmPassword] = usePersistedState(
    "register_confirmPassword",
    "",
  );
  const [confirmMailOTP, setConfirmMailOTP] = usePersistedState(
    "register_confirmMailOTP",
    false,
  );
  const [confirmPhoneOTP, setConfirmPhoneOTP] = usePersistedState(
    "register_confirmPhoneOTP",
    false,
  );

  const [sentMailOTP, setSentMailOTP] = useState(false);
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sentPhoneOTP, setSentPhoneOTP] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [sendingMailOTP, setSendingMailOTP] = useState(false);
  const [sendingPhoneOTP, setSendingPhoneOTP] = useState(false);
  const [confirmingMailOTP, setConfirmingMailOTP] = useState(false);
  const [confirmingPhoneOTP, setConfirmingPhoneOTP] = useState(false);
  const [fireBaseId, setFireBaseId] = useState("");

  const router = useRouter();

  const confirmationRef = useRef<any>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

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
          setPhoneResendTimer(RESEND_TIME);
        } else {
          const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
          const confirmation = await signInWithPhoneNumber(
            auth,
            formattedPhone,
            recaptchaVerifierRef.current!,
          );
          confirmationRef.current = confirmation;
          setSentPhoneOTP(true);
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

      const res = await axios.post("/api/v1/otp/phone", { idToken });

      if (res.data.status === "success") {
        setConfirmPhoneOTP(true);
        setFireBaseId(res.data.firebaseUid);
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
        setSentMailOTP(false);
        return;
      }
      const res = await axios.post("/api/v1/otp/email", { email: email });
      if (res.data.status === "success") {
        toast.success("OTP sent successfully.");
        setSentMailOTP(true);
        setEmailResendTimer(RESEND_TIME);
      } else {
        toast.error(res.data.message);
        setSentMailOTP(false);
      }
    } catch (err) {
      toast.error("Something went wrong.");
      setSentMailOTP(false);
    } finally {
      setSendingMailOTP(false);
    }
  };

  const handleConfirmMailOTP = async () => {
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
      console.error(err);
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
        });
        if (res.data.status === "success") {
          toast.success("Registered successfully!");
          Object.keys(localStorage)
            .filter((k) => k.startsWith("register_"))
            .forEach((k) => localStorage.removeItem(k));
          router.push("/profile/add-details");
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
            className="font-medium  text-sm md:text-lg text-dark"
          >
            Email Address
          </label>
          <div className="flex justify-center relative items-center w-full">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (!sentMailOTP || !sendingMailOTP)) {
                  handleSendMailOTP();
                }
              }}
              type="email"
              id="email"
              className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-2.5 md:py-3.5 px-4 w-full"
            />
            {!sendingMailOTP && !confirmMailOTP ? (
              !sentMailOTP && (
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
        {sentMailOTP && !confirmMailOTP && (
          <div className="w-full flex justify-center flex-col">
            <label
              htmlFor="email"
              className="font-medium  text-sm md:text-lg text-dark"
            >
              Email OTP
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                value={emailOTP}
                onChange={(e) => setEmailOTP(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !confirmingMailOTP) {
                    handleConfirmMailOTP();
                  }
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={6}
                className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md bg-white py-2.5 md:py-3.5 px-4 w-full"
              />
              {!confirmingMailOTP ? (
                <button
                  onClick={handleConfirmMailOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
                >
                  <Check />
                </button>
              ) : (
                <button
                  onClick={handleConfirmMailOTP}
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
            className="font-medium  text-sm md:text-lg text-dark"
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
            {!sentPhoneOTP &&
              !confirmPhoneOTP &&
              (!sendingPhoneOTP ? (
                <button
                  onClick={handleSendPhoneOTP}
                  className="h-full cursor-pointer hover:text-dark transition-all duration-300 rounded-md border border-dark absolute text-sm md:text-lg bg-dark px-6 right-0 hover:bg-transparent font-bold text-white"
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
              className="font-medium  text-sm md:text-lg text-dark"
            >
              Phone OTP
            </label>
            <div className="flex justify-center relative items-center w-full">
              <input
                value={phoneOTP}
                onChange={(e) => setPhoneOTP(e.target.value)}
                type="text"
                maxLength={6}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !confirmingPhoneOTP) {
                    handleConfirmPhoneOTP();
                  }
                }}
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
            className="font-medium  text-sm md:text-lg text-dark"
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
              {showPass ? <EyeClosed size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
        <div className="w-full flex justify-center flex-col">
          <label
            htmlFor="password"
            className="font-medium flex gap-2 items-center  text-sm md:text-lg text-dark"
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
              {showConfirm ? <EyeClosed size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
        <div id="recaptcha-container"></div>
        {!isLoading ? (
          <button
            onClick={handleSubmit}
            className=" text-sm md:text-lg my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark"
          >
            Submit
          </button>
        ) : (
          <button className=" text-sm md:text-lg my-6 font-bold bg-muted flex justify-center items-center w-full py-4 ring-1 ring-dark transition-all duration-300 hover:text-dark">
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
