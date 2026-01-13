"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import { NextPage } from "next";
import LiquidGlassMenu from "../../components/LiquidGlassMenu";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import {
  Building,
  CircleUserRound,
  Coins,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Tag,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { toast, ToastContainer } from "react-toastify";
import { set } from "zod";
import { useAuth } from "@/context/AuthContext";

interface Props {}

const Pag: NextPage<Props> = ({}) => {
  const [selected, setSelected] = useState<number>(0);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const {user, loading} = useAuth();
  const handleSignout = async () => {
    setSigningOut(true);
    try {
      const res = await axios.post("/api/v1/auth/signout");
      if (res.data.status === "success") {
        window.location.reload();
      }
    } catch (e) {
      toast.error("Something went wrong!");
    }
    finally{
      setSigningOut(false);
    }
  };
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, loading, router]);
  return (
    <div className="min-h-screen pt-[5vh] relative bg-light">
      {!loading && user ? (
        <>
          <ToastContainer />
          <Navbar solid />
          <LiquidGlassMenu />
          <div className="flex flex-col">
            <Sidebar selected={selected} setSelected={setSelected} role={user.role} />
            <div className="w-full bg-light px-[5%] md:pl-[30vw] lg:pl-[20vw]">
              <div className="md:mt-12 mt-4 relative bg-white p-6 border border-dark rounded-lg min-h-[80vh]">
                {selected === 0 && (
                  <div className="flex flex-col gap-6">
                    <h1 className="font-semibold text-dark text-2xl">
                      Account Details
                    </h1>
                    <div className="flex justify-center items-center">
                      <CircleUserRound className="bg-gray-200 w-20 h-20 stroke-1 text-white rounded-full" />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Mail /> Email:
                        </p>
                        <div className="border overflow-clip border-dark/20 rounded-md p-2 mt-1">
                          {user.email}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Phone /> Phone Number:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1">
                          {user.phone}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <LockKeyhole /> Password:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1">
                          {"********"}
                        </div>
                      </div>
                      <button className="text-white bg-dark py-2 px-5 w-fit rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer">
                        Change Password
                      </button>
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                        {!signingOut ? (
                          <button
                            onClick={() => handleSignout()}
                            className="text-white bg-red-500 py-2 px-5 w-fit rounded font-medium border border-red-500 hover:text-red-500 hover:bg-white transition-all cursor-pointer"
                          >
                            Sign Out
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSignout()}
                            className="bg-white py-2 px-10 w-fit rounded font-medium border-dark border transition-all cursor-pointer"
                          >
                            <Spinner light={false} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {selected === 1 && (
                  <div className="flex flex-col gap-6">
                    <h1 className="font-semibold text-dark text-2xl">
                      Company Details
                    </h1>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Building /> Company Name:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1">
                          {user.companyName}
                        </div>
                      </div>
                      {user.role === "seller" && (
                        <div>
                          <p className="font-medium flex items-center gap-2 text-dark/70">
                            <Building /> GST Number:
                          </p>
                          <div className="border border-dark/20 rounded-md p-2 mt-1">
                            {user.gstNumber}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <MapPin /> Address:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1">
                          {user.address}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <MapPin /> City:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1">
                          {user.city}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <MapPin /> State:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1">
                          {user.state}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <MapPin /> Pin Code:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1">
                          {user.zipCode}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Users /> Employee Count:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1">
                          {user.employeeCount}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selected === 2 && (
                  <div className="flex flex-col gap-6">
                    <h1 className="font-semibold text-dark text-2xl">
                      Manage Categories
                    </h1>

                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Tag /> Interested Service Categories:
                        </p>
                        <div className="border border-dark/20 rounded-md p-2 mt-1 flex flex-wrap gap-2">
                          {user.interestedCategories.map(
                            (category: string, index: number) => (
                              <span
                                key={index}
                                className="bg-dark font-medium text-light px-3 py-1 rounded-full text-sm"
                              >
                                {category}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selected === 3 && user.role === "seller" && (
                  <div className="flex flex-col gap-6">
                    <h1 className="font-semibold text-dark flex items-center gap-2 text-2xl">
                      <Coins /> Transactions
                    </h1>

                    {/* <div className="flex flex-col gap-4">
                  {user.transactions.length === 0 ? (
                    <p className="text-dark/70">No transactions available.</p>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-dark/20 p-2 text-left">Date</th>
                          <th className="border border-dark/20 p-2 text-left">Title</th>
                          <th className="border border-dark/20 p-2 text-left">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.transactions.map((transaction, index) => (
                          <tr key={index}>
                            <td className="border border-dark/20 p-2">{transaction.date}</td>
                            <td className="border border-dark/20 p-2">{transaction.title}</td>
                            <td className={`border border-dark/20 p-2 ${transaction.status === "debited" ? "text-red-400": "text-green-400"}`}>{transaction.status==="debited" ? "-" : "+"}{transaction.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mx-auto w-fit pt-[10vh]">
          <Navbar solid={true} />
          <LiquidGlassMenu />
          <Spinner light={false} />
        </div>
      )}
    </div>
  );
};

export default Pag;
