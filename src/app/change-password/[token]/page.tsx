"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {}

const Page = ({ params }: { params: Promise<{ token: string }> }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = decodeURIComponent(use(params).token);
  const [changing, setChanging] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(()=> {
    const verify = async () => {
      try{
        const res = await axios.post("/api/v1/auth/verify-token", {
          token: token
        })
        if(res.data.status === "success"){
          setLoading(false);
        }
        else{
          router.push("/signin")
        }
      }
      catch(err:any){
        router.push("/signin")
      }
    }
    verify();
  },[])

  const handleSubmit = async () => {
    setChanging(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setChanging(false);
      return;
    }
    try {
      const res = await axios.post(`/api/v1/auth/change-password/${encodeURIComponent(token)}`, {
        newPassword,
        confirmPassword,
      });
      if (res.data.status === "success") {
        toast.success("Password changed successfully!");
        router.push("/signin");
      } else {
        toast.error(res.data.message ?? "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setChanging(false);
    }
  };
  if (loading) {
    return (
      <div className="w-screen h-screen bg-light flex justify-center items-center">
        <Navbar solid />
        <Spinner light={false} />
      </div>
    );
  }
  return (
    <div className="w-screen h-screen bg-light flex justify-center items-center">
      <Navbar solid />
      <ToastContainer />
      <div className="border bg-white w-fit flex flex-col justify-center items-center relative bottom-[3%] rounded-lg mx-auto text-dark px-5 py-5 max-w-[95%]">
        <h1 className="font-bold text-lg">Change Password</h1>
        <p className="text-xs text-center">This link is active for 15 minutes. Don't share this link with anyone.</p>
        <div className="flex text-sm md:text-[16px] flex-col gap-3 mt-4">
          <div className="flex flex-col">
            <span className="font-medium">New Password</span>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="border px-3 py-2 rounded-lg w-full md:w-80 focus:outline-0"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Confirm Password</span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border px-3 py-2 rounded-lg w-full md:w-80 focus:outline-0"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>
          {changing ? (
            <button className="bg-white my-3 flex mx-auto text-white py-2 px-5 w-fit rounded font-medium border border-dark transition-all cursor-pointer">
              <Spinner light={false} />
            </button>
          ) : (
            <button
              className="bg-dark my-3 flex mx-auto text-white py-2 px-5 w-fit rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer"
              onClick={handleSubmit}
            >
              Change Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
