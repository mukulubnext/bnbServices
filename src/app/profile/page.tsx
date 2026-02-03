"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import { NextPage } from "next";
import LiquidGlassMenu from "../../components/LiquidGlassMenu";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import {
  Building,
  Coins,
  LinkIcon,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Plus,
  ScrollTextIcon,
  Tag,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import InterestedCategories from "@/components/InterestedCategories";
import Link from "next/link";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [selected, setSelected] = useState<number>(0);
  const [signingOut, setSigningOut] = useState(false);
  const [editableCategories, setEditableCategories] = useState<any[]>([]);

  const [addCategory, setAddCategory] = useState(false);

  const [updatingCategories, setUpdatingCategories] = useState(false);

  const router = useRouter();
  const { user, loading, refresh } = useAuth();

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
    try {
      setUpdatingCategories(true);

      const payload = {
        interestedCategories: editableCategories.map((cat) => ({id: cat.id, name:cat.name})),
        interestedSubCategories: editableCategories.flatMap((cat) =>
          cat.subCategories.map((sub: any) => ({id: sub.id, name:sub.name})),
        ),
      };

      const res = await axios.put("/api/v1/category", payload);

      if (res.data.status === "success") {
        toast.success("Interested Categories updated successfully!");
        refresh();
        setAddCategory(false);
      } else {
        toast.error(res.data.message ?? "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setUpdatingCategories(false);
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      router.push("/signin");
      return;
    }

    if (user) {
      const prepared = user.interestedCategories.map((cat: any) => ({
        ...cat,
        subCategories: user.interestedSubCategories.filter(
          (sub: any) => sub.categoryId === cat.id,
        ),
      }));

      setEditableCategories(prepared);
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
                    <div className="flex flex-col gap-4 text-black/50">
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Mail /> Email:
                        </p>
                        <div className="border cursor-not-allowed overflow-clip border-dark/20 rounded-md p-2 mt-1">
                          {user.email}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Phone /> Phone Number:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {user.phone}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <LockKeyhole /> Password:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {"********"}
                        </div>
                      </div>
                      {user.role === "seller" && (
                        <div className="flex justify-start items-center gap-2">
                          <p className="font-medium flex items-center gap-2 text-dark/70">
                            Seller Type:
                          </p>
                          <div className="border text-dark/70 w-fit bg-white px-3 py-1 capitalize font-medium rounded-md">
                            {user.sellerType}
                          </div>
                        </div>
                      )}
                      <Link href={"/change-password"} className="text-white bg-dark py-2 px-5 w-fit rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer">
                        Change Password
                      </Link>
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
                    <div className="flex flex-col text-black/50 gap-4">
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Building /> Company Name:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {user.companyName ?? <span className="text-yellow-500 flex items-center gap-2"><TriangleAlert size={20}/> Update needed</span>}
                        </div>
                      </div>
                      {user.role === "seller" && (
                        <div>
                          <p className="font-medium flex items-center gap-2 text-dark/70">
                            <Building /> GST Number:
                          </p>
                          <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                            {user.gstNumber ?? <span className="text-yellow-500 flex items-center gap-2"><TriangleAlert size={20}/> Update needed</span>}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <MapPin /> Address:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {user.address ?? <span className="text-yellow-500 flex items-center gap-2"><TriangleAlert size={20}/> Update needed</span>}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <MapPin /> City:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {user.city ?? <span className="text-yellow-500 flex items-center gap-2"><TriangleAlert size={20}/> Update needed</span>}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium cursor-not-allowed flex items-center gap-2 text-dark/70">
                          <MapPin /> State:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {user.state ?? <span className="text-yellow-500 flex items-center gap-2"><TriangleAlert size={20}/> Update needed</span>}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <MapPin /> Pin Code:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {user.zipCode ?? <span className="text-yellow-500 flex items-center gap-2"><TriangleAlert size={20}/> Update needed</span>}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Users /> Employee Count:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {user.employeeCount ?? <span className="text-yellow-500 flex items-center gap-2"><TriangleAlert size={20}/> Update needed</span>}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <LinkIcon /> Website:
                        </p>
                        <div className="border cursor-not-allowed border-dark/20 rounded-md p-2 mt-1">
                          {user.companyWebsite ?? <span className="text-yellow-500 flex items-center gap-2"><TriangleAlert size={20}/> Update needed</span>}
                        </div>
                      </div>
                      <div className="mt-4">
                        {
                          (!user.companyName ||
                          !user.address ||
                          !user.city ||
                          !user.state ||
                          !user.zipCode ||
                          !user.inceptionDate ||
                          !user.employeeCount || !user.companyWebsite) && (
                            <Link href={"/profile/add-details"} className="font-bold border hover:text-dark hover:bg-white transition-all duration-300 px-3 py-2 bg-dark rounded-md text-white">
                              Update Details
                            </Link>
                          )
                        }

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
                      <div className="gap-2 flex flex-col text-sm md:text-[16px]">
                        <p className="font-medium flex items-center gap-2 text-dark/70">
                          <Tag /> Interested Service Categories:
                        </p>
                        {!addCategory ? (
                          <div className="border border-dark/20 rounded-md p-2 mt-1 flex flex-wrap gap-2">
                            {user.interestedCategories.length > 0 ? (
                              editableCategories.map((cat: any) => (
                                <span
                                  key={cat.id}
                                  className="bg-dark flex-wrap font-bold text-light px-3 py-1 rounded-full"
                                >
                                  {cat.name}:{" "}
                                  {cat.subCategories.map(
                                    (subCat: any) =>
                                      subCat.categoryId === cat.id && (
                                        <span
                                          className="group px-0.5 text-sm"
                                          key={subCat.id}
                                        >
                                          <span className="font-medium text-white">
                                            {subCat.name}
                                          </span>
                                          <span className="group-last:hidden">
                                            ,
                                          </span>
                                        </span>
                                      ),
                                  )}
                                </span>
                              ))
                            ) : (
                              <div className="text-dark/60 text-sm">
                                No categories selected
                              </div>
                            )}
                          </div>
                        ) : (
                          <InterestedCategories
                            interestedCategories={editableCategories}
                            setInterestedCategories={setEditableCategories}
                          />
                        )}
                      </div>
                      {!addCategory ? (
                        <button
                          onClick={() => setAddCategory(true)}
                          className="flex justify-start cursor-pointer hover:text-dark hover:bg-white border transition-all items-center px-3 py-1 rounded text-sm md:text-[16px] w-fit bg-dark text-white font-medium"
                        >
                          <Plus size={20} /> Edit Categories
                        </button>
                      ) : updatingCategories ? (
                        <div>
                          <Spinner light={false} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSubmit}
                            className="flex justify-start cursor-pointer hover:text-dark hover:bg-white border transition-all items-center px-3 py-1 rounded text-sm md:text-[16px] w-fit bg-dark text-white font-medium"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => setAddCategory(false)}
                            className="flex justify-start cursor-pointer hover:text-red-500 hover:bg-white border transition-all items-center px-3 text-sm md:text-[16px] py-1 rounded w-fit bg-red-500 text-white font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selected === 3 && user.role === "seller" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col justify-start items-center gap-2">
                        <p className="font-semibold text-xl flex items-center gap-2 text-dark/70">
                          Credits
                        </p>
                        <div className="border flex max-w-100 justify-center items-center gap-3 w-full text-center border-dark/60 text-dark text-3xl font-bold rounded-md p-2 mt-1">
                          <Coins />
                          {user.tokens ?? 0}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center w-full items-center md:flex-row">
                      <Link
                        href="/buy-credits"
                        className="text-white w-full flex justify-center items-center gap-4 bg-dark py-2 px-5 max-w-100 rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer"
                      >
                        <Plus /> Add Credits
                      </Link>
                      <Link
                        href={"/offer-history"}
                        className="text-white w-full flex justify-center items-center gap-4 bg-dark py-2 px-5 max-w-100 rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer"
                      >
                        <ScrollTextIcon /> Offer History
                      </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h1 className="font-bold text-dark text-xl mt-4 md:text-2xl">
                        Wallet History
                      </h1>
                      <div className="w-full h-[50vh] border border-dark/40 rounded-lg">
                        {!user.payments || user.payments.length === 0 ? (
                          <div className="flex h-full relative bottom-[5%] text-black/40 justify-center items-center">
                            No previous record.
                          </div>
                        ) : (
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="border border-dark/20 p-2 text-left">
                                  Date
                                </th>
                                <th className="border border-dark/20 p-2 text-left">
                                  Amount
                                </th>
                                <th className="border border-dark/20 p-2 text-left">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.payments.map((payment: any, index: any) => (
                                <tr key={index}>
                                  <td className="border border-dark/20 p-2">
                                    {payment.createdAt}
                                  </td>
                                  <td className="border border-dark/20 p-2">
                                    {payment.amount}
                                  </td>
                                  <td
                                    className={`border border-dark/20 p-2 ${payment.status === "success" ? "text-green-400" : "text-red-400"}`}
                                  >
                                    {payment.status === "success"
                                      ? "Success"
                                      : "Failed"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
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
