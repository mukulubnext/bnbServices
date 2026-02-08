"use client";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import axios, { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    setSending(true);
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email: email,
      });
      if (res.data.status === "success") {
        toast.success("OTP sent successfully.");
        router.push(`/forgot-password/verify/${encodeURIComponent(email)}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err:any) {
      toast.error( err.response?.data?.message ?? "Something went wrong.");
    }
    finally{
      setSending(false);
    }
  };

  return (
    <div className="bg-light w-screen h-screen flex justify-center items-center">
      <Navbar solid />
      <ToastContainer />
      <div className="border border-dark/20 bg-white/60 backdrop-blur-lg w-fit flex flex-col justify-center items-center relative bottom-[3%] rounded-2xl mx-auto text-dark px-6 py-6 max-w-[95%] shadow-xl">
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-xl tracking-tight">Forgot Password?</h1>
          <p className="text-xs text-center text-dark/70 mt-1">
            No worries, we'll send you reset instructions.
          </p>
        </div>
        <div className="flex text-sm md:text-[16px] flex-col gap-4 mt-5">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-dark/80">
              Email Address
            </span>
            <input
              type="email"
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  handleSendOtp();
                }
              }}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@xyz.com"
              className="border border-dark/30 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-dark/30 transition"
            />
          </div>
          {sending ? (
            <button className="bg-white/30 my-4 flex mx-auto text-white py-2.5 px-6 w-fit rounded-xl font-medium border border-white/40 backdrop-blur-md transition cursor-not-allowed shadow">
              <Spinner light={false} />
            </button>
          ) : (
            <button onClick={handleSendOtp} className="bg-dark my-4 flex mx-auto text-white py-2.5 px-6 w-full justify-center items-center rounded-xl font-medium border border-dark hover:text-dark hover:bg-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
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

export default Page;
