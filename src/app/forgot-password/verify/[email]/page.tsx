"use client";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import OTPInput from "./components/OtpInput";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    email: string;
  };
};

export default function Page({
  params,
}: {
  params: Promise<{ email: string }>
}) {
  const email = decodeURIComponent(use(params).email);
const [sending, setSending] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    setSending(true);
    try{
      const res = await axios.post("/api/v1/auth/forgot-password/verify", {
        email: email,
        otp: otp,
      });
      if(res.data.status === "success"){
        router.push(`/change-password/${encodeURIComponent(res.data.token)}`)
      }
      else{
        toast.error(res.data.message);
      }
    }
    catch(err:any){
      toast.error( err.response?.data?.message ?? "Something went wrong.");
    }
    finally{
      setSending(false);
    }
  }

  return (
    <div className="bg-light w-screen h-screen flex justify-center items-center">
      <Navbar solid />
      <ToastContainer />
      <div className="bg-white py-5 px-5 md:px-10 max-w-[90%] rounded-lg flex flex-col relative bottom-[2%] gap-5 w-fit border text-dark">
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-2xl text-center">OTP Sent!</h1>
          <p className="text-xs text-center">
            Verify the OTP sent on: {email}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <label htmlFor="email" className="font-bold text-sm text-dark/80">
              OTP
            </label>
            <OTPInput length={6} onChange={(x) => setOtp(x)} />
          </div>
          {sending ? (
            <button className="bg-white flex justify-center items-center text-dark py-2 px-5 w-full my-3 rounded font-medium border border-dark transition-all cursor-wait">
              <Spinner light={false} />
            </button>
          ) : (
            <button onClick={handleVerify} className="bg-dark text-white py-2 px-5 w-full my-3 rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer">
              Submit
            </button>
          )}
          <Link
            href={"/signin"}
            className="flex w-fit mx-auto flex-col group justify-center items-center gap-2 text-sm cursor-pointer"
          >
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