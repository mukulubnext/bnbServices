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

  const { user, loading } = useAuth();

  const router = useRouter();

  const handleSubmit = async () => {
    setChanging(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setChanging(false);
      return;
    }
    if (oldPassword === newPassword) {
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
    if (!user && !loading) {
      router.push("/signin");
    }
  }, [user, loading, router]);
  if (loading) {
    return (
      <div className="w-screen h-screen bg-light flex justify-center items-center">
        <Navbar solid />
        <LiquidGlassMenu />
        <Spinner light={false} />
      </div>
    );
  }
  return (
    <div
      className="w-screen h-screen bg-light flex justify-center items-center"
    >
      <Navbar solid />
      <LiquidGlassMenu />
      <ToastContainer />
      <div className="border border-dark/20 bg-white/50 backdrop-blur-lg w-fit flex flex-col justify-center items-center relative bottom-[3%] rounded-2xl mx-auto text-dark px-6 py-6 max-w-[95%] shadow-xl">
        <h1 className="font-bold text-xl tracking-tight">Change Password</h1>
        <div className="flex text-sm md:text-[16px] flex-col gap-4 mt-5">
          <div className="flex flex-col">
            <span className="font-medium text-dark/80">Old Password</span>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                className="border border-dark/30 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl max-w-full w-80 focus:outline-none focus:ring-2 focus:ring-dark/30 transition"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none text-dark/60 hover:text-dark transition"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-dark/80">New Password</span>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="border border-dark/30 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl max-w-full w-80 focus:outline-none focus:ring-2 focus:ring-dark/30 transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none text-dark/60 hover:text-dark transition"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-dark/80">Confirm Password</span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border border-dark/30 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl max-w-full w-80 focus:outline-none focus:ring-2 focus:ring-dark/30 transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none text-dark/60 hover:text-dark transition"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>
          <Link
            href={"/forgot-password"}
            className="text-xs md:text-sm underline underline-offset-4 hover:no-underline text-center text-dark/70 hover:text-dark transition"
          >
            Forgot Password?
          </Link>
          {changing ? (
            <button className="bg-white/30 my-4 flex mx-auto text-white py-2.5 px-6 w-fit rounded-xl font-medium border border-white/40 backdrop-blur-md transition cursor-not-allowed shadow">
              <Spinner light={false} />
            </button>
          ) : (
            <button
              className="bg-dark my-4 flex mx-auto text-white py-2.5 px-6 w-fit rounded-xl font-medium border border-dark hover:text-dark hover:bg-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
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
