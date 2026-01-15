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
  Plus,
  Tag,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import InterestedCategories from "@/components/InterestedCategories";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [selected, setSelected] = useState<number>(0);
  const [signingOut, setSigningOut] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [interestedCategories, setInterestedCategories] = useState<number[]>(
    []
  );

  const [addCategory, setAddCategory] = useState(false);

  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignout = async () => {
    setSigningOut(true);
    try {
      const res = await axios.post("/api/v1/auth/signout");
      if (res.data.status === "success") {
        window.location.reload();
      }
    } catch (e) {
      toast.error("Something went wrong!");
    } finally {
      setSigningOut(false);
    }
  };

  const handleSubmit = async () => {
    try{
      const res = await axios.put("/api/v1/category", {interestedCategories});
      if(res.data.status === "success"){
        toast.success("Interested Categories updated successfully!");
        setInterestedCategories([]);
        setAddCategory(false);
      }
      else{
        toast.error(res.data.message ?? "Something went wrong!");
      }
    }
    catch(err) {
      toast.error("Something went wrong!");
      console.error(err);
    }
  }

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
            <Sidebar
              selected={selected}
              setSelected={setSelected}
              role={user.role}
            />
            <div className="w-full bg-light px-[5%] md:pl-[30vw] lg:pl-[20vw]">
              <div className="md:mt-12 mt-4 relative bg-white p-6 border border-dark rounded-lg min-h-[80vh]">
                {selected === 0 && (
                  <div className="flex flex-col gap-6">
                    <h1 className="font-semibold text-dark text-2xl">
                      Account Details
                    </h1>
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
                      <div className="gap-2 flex flex-col">
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Tag /> Interested Service Categories:
                        </p>
                        {!addCategory ? (
                          <div className="border border-dark/20 rounded-md p-2 mt-1 flex flex-wrap gap-2">
                            {user.interestedCategories.length > 0 ? (
                              user.interestedCategories.map(
                                (cat: { id: number; name: string, createdAt: Date, updatedAt: Date}) => (
                                  <span
                                    key={cat.id}
                                    className="bg-dark font-medium text-light px-3 py-1 rounded-full text-sm"
                                  >
                                    {cat.name}
                                  </span>
                                )
                              )
                            ) : (
                              <div className="text-dark/60 text-sm">
                                No categories selected
                              </div>
                            )}
                          </div>
                        ) : (
                          <InterestedCategories
                            interestedCategories={user.interestedCategories}
                            setInterestedCategories={setInterestedCategories}
                          />
                        )}
                      </div>
                      {!addCategory ? <button
                        onClick={() => setAddCategory(true)}
                        className="flex justify-start cursor-pointer hover:text-dark hover:bg-white border transition-all items-center px-3 py-1 rounded w-fit bg-dark text-white font-medium"
                      >
                        <Plus size={20} /> Edit Categories
                      </button>
                    :
                      <div className="flex items-center gap-2">
                        <button
                        onClick={handleSubmit}
                        className="flex justify-start cursor-pointer hover:text-dark hover:bg-white border transition-all items-center px-3 py-1 rounded w-fit bg-dark text-white font-medium"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => setAddCategory(false)}
                        className="flex justify-start cursor-pointer hover:text-red-500 hover:bg-white border transition-all items-center px-3 py-1 rounded w-fit bg-red-500 text-white font-medium"
                      >
                        Cancel
                      </button>
                      </div>
                    }
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

export default Page;
