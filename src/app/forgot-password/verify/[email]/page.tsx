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
      <div className="border border-dark/20 bg-white/60 backdrop-blur-lg w-fit flex flex-col justify-center items-center relative bottom-[3%] rounded-2xl mx-auto text-dark px-6 py-6 max-w-[95%] shadow-xl">
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-xl tracking-tight">OTP Sent!</h1>
          <p className="text-xs text-center text-dark/70 mt-1">
            Verify the OTP sent on: {email}
          </p>
        </div>
        <div className="flex text-sm md:text-[16px] flex-col gap-4 mt-5">
          <div>
           <span className="font-medium text-dark/80">
              Enter OTP
            </span>
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
        </div>
      </div>
    </div>
  );
};