"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changing, setChanging] = useState(false);
  
  const {user, loading} = useAuth();

  const router = useRouter();

  const handleSubmit = async () => {
    setChanging(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setChanging(false);
      return;
    }
    if(oldPassword === newPassword){
      toast.error("New password cannot be same as old password!");
      setChanging(false);
      return;
    }
    try {
      const res = await axios.post("/api/v1/auth/change-password", {
        oldPassword,
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
  useEffect(() => {
    if(!user && !loading){
      router.push("/signin")
    }
  }, [user, loading, router])
  if(loading){
    return <div className="w-screen h-screen bg-light flex justify-center items-center">
      <Navbar solid />
      <LiquidGlassMenu />
      <Spinner light={false} />
    </div>
  }
  return (
    <div className="w-screen h-screen bg-light flex justify-center items-center">
      <Navbar solid />
      <LiquidGlassMenu />
      <ToastContainer />
      <div className="border bg-white w-fit flex flex-col justify-center items-center relative bottom-[3%] rounded-lg mx-auto text-dark px-5 py-5 max-w-[95%]">
        <h1 className="font-bold text-lg">Change Password</h1>
        <div className="flex text-sm md:text-[16px] flex-col gap-3 mt-4">
          <div className="flex flex-col">
            <span className="font-medium">Old Password</span>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                className="border px-3 py-2 rounded-lg max-w-full w-80 focus:outline-0"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">New Password</span>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="border px-3 py-2 rounded-lg max-w-full w-80 focus:outline-0"
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
                className="border px-3 py-2 rounded-lg max-w-full w-80 focus:outline-0"
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
          <Link
            href={"/forgot-password"}
            className="text-xs md:text-sm underline hover:no-underline text-center"
          >
            Forgot Password?
          </Link>
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
