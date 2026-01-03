"use client";
import Navbar from "@/components/Navbar";
import { ArrowUpDown, EllipsisVertical, Pencil, Search } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import LiquidGlassMenu from "./components/LiquidGlassMenu";
import EllipsisComp from "./components/Ellipsis";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const username = "John Doe";
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);
  return (
    <div className="flex flex-col px-[5%] pb-10 pt-30 gap-5 min-h-screen bg-light">
      <Navbar solid={true} />
      <div className="text-dark md:gap-4 font-bold flex-col flex text-3xl md:text-4xl lg:text-6xl md:flex-row">
        <span>{greeting},</span>
        <span>{username}...</span>
      </div>
      <Buyer />
      <LiquidGlassMenu />
    </div>
  );
};

export default Page;

function Buyer() {
  const posts = [
    {
      id: 1,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 2,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 3,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 4,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 5,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 6,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 7,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 8,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 9,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 10,
      title: "Cartons",
      date: "2024-06-15",
    },
    {
      id: 11,
      title: "Cartons",
      date: "2024-06-15",
    },
  ];
  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <p className="text-lg md:text-3xl text-dark">
          Need to buy something? Make a post!
        </p>
        <button className="flex gap-4 justify-center items-center w-full bg-dark md:max-w-[40%] text-highlight font-bold py-2 md:text-2xl hover:bg-transparent border border-dark hover:text-dark transition-all duration-300 rounded-lg">
          <Pencil size={20} />
          Post
        </button>
      </div>
      <hr className="text-dark/22" />
      <div className=" border border-dark border-t-0 overflow-y-visible bg-white w-full">
        <div className="flex justify-between p-2 w-full border-y border-dark">
          <div className="relative border border-dark w-[50%]">
            <input
              type="text"
              placeholder="Search"
              className="bg-light text-dark placeholder:text-dark pl-8 py-1 w-full"
            />
            <Search
              size={20}
              className="text-dark absolute left-1 top-1/2 -translate-y-1/2 "
            />
          </div>
          <div className="relative border border-dark w-[40%]">
            <select
              defaultValue={""}
              className="bg-light text-dark h-full placeholder:dark/22 pl-8 py-1 w-full"
            >
              <option value={""} disabled>
                Sort By
              </option>
            </select>
            <ArrowUpDown
              size={20}
              className="text-dark absolute left-1 top-1/2 -translate-y-1/2 "
            />
          </div>
        </div>
        <div>
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex justify-between items-center py-3 px-2 w-full first:border-0 border-t border-dark"
            >
              <p className="text-dark font-semibold">{post.title}</p>
              <p className="text-dark/70">{post.date}</p>
              <EllipsisComp/>
              <div className="hidden md:flex justify-center gap-6 lg:gap-10 items-center">
                <button className="font-bold hover:scale-105 py-1 px-4 border border-dark text-dark transition-all duration-300 rounded-lg">
                  Option 1
                </button>
                <button className="font-bold hover:scale-105 py-1 px-4 border border-dark text-dark transition-all duration-300 rounded-lg">
                  Option 2
                </button>
                <button className="font-bold hover:scale-105 py-1 px-4 border border-dark text-dark transition-all duration-300 rounded-lg">
                  Option 3
                </button>
                <button className="font-bold hover:scale-105 py-1 px-4 border border-dark text-dark transition-all duration-300 rounded-lg">
                  Option 4
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
