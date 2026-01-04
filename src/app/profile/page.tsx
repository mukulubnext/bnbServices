"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import { NextPage } from "next";
import LiquidGlassMenu from "../../components/LiquidGlassMenu";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { Building, CircleUserRound, Coins, LockKeyhole, Mail, MapPin, Phone, Tag, Users } from "lucide-react";

interface Props {}

const Pag: NextPage<Props> = ({}) => {
  const [selected, setSelected] = useState<number>(0);
  const dummyUser = {
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    companyName: "Doe Industries",
    addressLine1: "123 Main St",
    addressLine2: "Suite 400",
    city: "Anytown",
    state: "Maharashtra",
    zip: "12345",
    employeeCount: "51-200",
    interestedCategories: ["Plumbing", "Electrical", "Landscaping"],
    link: "www.doeindustries.com",
    transactions: [
      {
        date: "2024-01-15",
        amount: "150000 INR",
        status: "debited",
        title: "Cartons"
      },
      {
        date: "2024-01-20",
        amount: "200000 INR",
        status: "debited",
        title: "Bubble Wrap"
      },
      {
        date: "2024-02-10",
        amount: "200000 INR",
        status: "credited",
        title: "Refund Bubble Wrap"
      }
    ],
  };
  dummyUser.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return (
    <div className="min-h-screen pt-[5vh] relative bg-light">
      <Navbar solid />
      <LiquidGlassMenu />
      <div className="flex">
        <Sidebar selected={selected} setSelected={setSelected} />
        <div className="w-full md:ml-50 ml-15 px-6 bg-light lg:ml-75 p-4 md:p-8 lg:p-12">
          <div className="mt-8 bg-white p-6 border border-dark rounded-lg min-h-[80vh]">
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
                    <p className="font-medium flex items-center gap-2 text-dark/70"><Mail/> Email:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {dummyUser.email}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><Phone/> Phone Number:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {dummyUser.phone}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><LockKeyhole/> Password:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {"********"}
                    </div>
                  </div>
                  <button className="text-white bg-dark py-2 px-5 w-fit rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer">
                    Change Password
                  </button>
                </div>
              </div>
            )}
            {selected === 1 && 
              <div className="flex flex-col gap-6">
                <h1 className="font-semibold text-dark text-2xl">
                  Company Details
                </h1>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><Building/> Company Name:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {dummyUser.companyName}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><MapPin/> Address:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {dummyUser.addressLine1}, {dummyUser.addressLine2}
                      </div>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><MapPin/> City:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {dummyUser.city}
                      </div>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><MapPin/> State:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {dummyUser.state}
                      </div>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><MapPin/> Pin Code:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {dummyUser.zip}
                      </div>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><Users/> Employee Count:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1">
                      {dummyUser.employeeCount}
                    </div>
                  </div>
                </div>
              </div>
            }
            {selected === 2 &&
              <div className="flex flex-col gap-6">
                <h1 className="font-semibold text-dark text-2xl">
                  Manage Categories
                </h1>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium flex items-center gap-2 text-dark/70"><Tag/> Interested Service Categories:</p>
                    <div className="border border-dark/20 rounded-md p-2 mt-1 flex flex-wrap gap-2">
                      {dummyUser.interestedCategories.map((category, index) => (
                        <span key={index} className="bg-dark font-medium text-light px-3 py-1 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
            {selected === 3 &&
              <div className="flex flex-col gap-6">
                <h1 className="font-semibold text-dark flex items-center gap-2 text-2xl">
                  <Coins/> Transactions
                </h1>
                
                <div className="flex flex-col gap-4">
                  {dummyUser.transactions.length === 0 ? (
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
                        {dummyUser.transactions.map((transaction, index) => (
                          <tr key={index}>
                            <td className="border border-dark/20 p-2">{transaction.date}</td>
                            <td className="border border-dark/20 p-2">{transaction.title}</td>
                            <td className={`border border-dark/20 p-2 ${transaction.status === "debited" ? "text-red-400": "text-green-400"}`}>{transaction.status==="debited" ? "-" : "+"}{transaction.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pag;
