"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Eye, EyeClosed, LogIn } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const {user, loading, refresh} = useAuth();
  useEffect(() => {
      if (!loading && user) {
        router.push("/home");
      }
    }, [user, loading, router]);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill all the fields!");
      return;
    }
    setLoading(true);
    const body = {
      email: email,
      password: password,
      rememberMe: rememberMe,
    };
    try {
      const res = await axios.post("/api/v1/auth/signin", body);
      if (res.data.status === "success") {
        toast.success("Login Successful!");
        refresh();
        setLoading(false);
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex relative md:flex-row flex-col-reverse bg-light">
      <ToastContainer />
      <Breadcrumbs />
      <div className="flex flex-col gap-4 px-[5%] pt-[10%]  relative  md:w-[50vw] min-h-screen h-fit">
        {!loading ? (
          <>
            <div className=" text-dark mb-5">
              <h1 className="font-bold text-4xl">Sign In</h1>
              <p>Access your Buyer/Seller account </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-full flex justify-center flex-col">
                <label
                  htmlFor="email"
                  className="font-medium text-xl text-dark"
                >
                  Email Address
                </label>
                <div className="flex justify-center relative items-center w-full">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
                  />
                </div>
              </div>
              <div className="w-full flex justify-center flex-col">
                <label
                  htmlFor="password"
                  className="font-medium text-xl text-dark"
                >
                  Password
                </label>
                <div className="flex justify-center relative items-center w-full">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPass ? "text" : "password"}
                    id="password"
                    className="border border-dark text-dark focus:outline-0 focus:ring-1 ring-dark rounded-md text-lg bg-white p-4 w-full"
                  />
                  <button
                    onClick={() => setShowPass((e) => !e)}
                    className="absolute cursor-pointer text-dark px-6 right-0"
                  >
                    {showPass ? <EyeClosed size={24} /> : <Eye size={24} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <label className="inline-flex items-center mr-6">
                  <input
                    type="checkbox"
                    className="form-checkbox text-highlight"
                    name="rememberMe"
                    value="yes"
                    checked={rememberMe}
                    onChange={() => setRememberMe((e) => !e)}
                  />
                  <span className="ml-2 text-dark">Remember Me</span>
                </label>
                <Link
                  href={"/forgot-password"}
                  className="text-dark underline hover:no-underline transition-all duration-300"
                >
                  Forgot Password?
                </Link>
              </div>
              {!isLoading ? (
                <button
                  onClick={handleSubmit}
                  className="text-xl my-6 font-bold text-highlight bg-dark w-full py-4 hover:ring-1 ring-dark hover:bg-light transition-all duration-300 hover:text-dark"
                >
                  Submit
                </button>
              ) : (
                <button className="text-xl my-6 font-bold bg-muted flex justify-center items-center w-full py-4 ring-1 ring-dark transition-all duration-300 hover:text-dark">
                  <Spinner light={false} />
                </button>
              )}
            </div>
            <div className="flex relative top-4 md:hidden justify-center items-center"></div>
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
          <LogIn className="text-highlight lg:w-15 lg:h-15 md:w-10 md:h-10 w-8 h-8" />
        </div>
        <div className="flex flex-col justify-center gap-2 items-center">
          <h1 className="text-highlight text-center font-semibold text-2xl md:text-4xl lg:text-[40px]">
            Sign In into your Account
          </h1>
          <p className="lg:text-xl md:text-lg text-[8px] md:max-w-[80%] text-center text-highlight">
            Browse tools, manage subscriptions, and enjoy exclusive marketplace
            benefits.
          </p>
        </div>
        <div className="hidden justify-center items-center md:flex"></div>
      </div>
    </div>
  );
};

export default Page;
