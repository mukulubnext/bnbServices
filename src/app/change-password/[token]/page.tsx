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

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post("/api/v1/auth/verify-token", {
          token: token,
        });
        if (res.data.status === "success") {
          setLoading(false);
        } else {
          router.push("/signin");
        }
      } catch (err: any) {
        router.push("/signin");
      }
    };
    verify();
  }, []);

  const handleSubmit = async () => {
    setChanging(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setChanging(false);
      return;
    }
    try {
      const res = await axios.post(
        `/api/v1/auth/change-password/${encodeURIComponent(token)}`,
        {
          newPassword,
          confirmPassword,
        },
      );
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
      <div className="border border-dark/20 bg-white/60 backdrop-blur-lg w-fit flex flex-col justify-center items-center relative bottom-[3%] rounded-2xl mx-auto text-dark px-6 py-6 max-w-[95%] shadow-xl">
        <h1 className="font-bold text-xl tracking-tight">Change Password</h1>
        <p className="text-xs text-center text-dark/70 mt-1">
          This link is active for 15 minutes. Don't share this link with anyone.
        </p>
        <div className="flex text-sm md:text-[16px] flex-col gap-4 mt-5">
          <div className="flex flex-col">
            <span className="font-medium text-dark/80">New Password</span>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="border border-dark/30 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-dark/30 transition"
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
                className="border border-dark/30 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-dark/30 transition"
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
