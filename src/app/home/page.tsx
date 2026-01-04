"use client";
import Navbar from "@/components/Navbar";
import { ArrowUpDown, Pencil, Search } from "lucide-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import LiquidGlassMenu from "../../components/LiquidGlassMenu";
import EllipsisComp from "./components/Ellipsis";
import Link from "next/link";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const username = "John Doe";
  const [greeting, setGreeting] = useState("");
  const [temp, setTemp] = useState(true);
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
      <div>
        {/* Input to select buyer/seller menu */}
        <div className="relative border rounded-lg border-dark w-[60%] md:w-[30%] lg:w-[20%]">
          <select
            defaultValue={temp ? "buyer" : "seller"}
            onChange={(e) => setTemp(e.target.value === "buyer")}
            className="bg-light text-dark rounded-lg h-full placeholder:dark/22 pl-8 py-1 w-full"
          >
            <option value={"buyer"}>Buyer</option>
            <option value={"seller"}>Seller</option>
          </select>
          <ArrowUpDown
            size={20}
            className="text-dark absolute left-1 top-1/2 -translate-y-1/2 "
          />
        </div>
      </div>
      {temp ? <Buyer /> : <Seller />}
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
      category: "Packaging Materials",
    },
    {
      id: 2,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 3,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 4,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 5,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 6,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 7,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 8,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 9,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 10,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
    {
      id: 11,
      title: "Cartons",
      date: "2024-06-15",
      category: "Packaging Materials",
    },
  ];
  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <p className="text-lg md:text-3xl text-dark">
          Need to buy something? Make a post!
        </p>
        <Link href={"/post"} className="flex gap-4 justify-center items-center w-full bg-dark md:max-w-[40%] text-highlight font-bold py-2 md:text-2xl hover:bg-transparent border border-dark hover:text-dark transition-all duration-300 rounded-lg">
          <Pencil size={20} />
          Post
        </Link>
      </div>
      <hr className="text-dark/22" />
      <div>
        <h1 className="text-dark font-bold text-2xl">Previous Posts</h1>
        <div className="border border-dark border-t overflow-y-visible rounded bg-white w-full">
          <div className="flex justify-between p-2 w-full border-b border-dark">
            <div className="relative border rounded-lg border-dark w-[50%]">
              <input
                type="text"
                placeholder="Search"
                className="bg-light text-dark rounded-lg placeholder:text-dark pl-8 py-1 w-full"
              />
              <Search
                size={20}
                className="text-dark absolute left-1 top-1/2 -translate-y-1/2 "
              />
            </div>
            <div className="relative border rounded-lg border-dark w-[40%]">
              <select
                defaultValue={""}
                className="bg-light text-dark rounded-lg h-full placeholder:dark/22 pl-8 py-1 w-full"
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
                <EllipsisComp />
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
      </div>
    </>
  );
}

function Seller() {
  const posts = [
    {
      id: 1,
      title: "Cartons",
      date: "2024-06-15",
      quantity: 500,
      description: "High quality cartons for packaging.",
      details: "Size: 12x12x12 inches, Color: Brown",
      category: "Packaging Materials",
      image:
        "https://www.packingsupply.in/web/templates/images/products/15190367951469792114-plain-boxes.jpg",
    },
    {
      id: 2,
      title: "Bubble Wrap",
      date: "2024-06-14",
      quantity: 200,
      description: "Durable bubble wrap for fragile items.",
      details: "Roll Length: 50 feet, Width: 12 inches",
      category: "Packaging Materials",
      image:
        "https://mmtoyworld.com/cdn/shop/files/3_c71a8685-51fb-4af9-bd35-ad12bd039628.jpg?v=1686398678&width=990",
    },
    {
      id: 3,
      title: "Packing Tape",
      date: "2024-06-13",
      quantity: 1000,
      description: "Strong adhesive packing tape.",
      details: "Width: 2 inches, Length: 60 yards",
      category: "Adhesives",
      image:
        "https://m.media-amazon.com/images/I/4153T0wOvdL._SX342_SY445_QL70_FMwebp_.jpg",
    },
    {
      id: 4,
      title: "Wooden Boards",
      date: "2024-06-12",
      quantity: 150,
      description: "Sturdy wooden boards for construction.",
      details: "Size: 8 feet x 4 feet, Thickness: 1 inch",
      category: "Construction Materials",
      image:
        "https://m.media-amazon.com/images/I/31RBX4KxZ0L._SX342_SY445_QL70_FMwebp_.jpg",
    },
    {
      id: 5,
      title: "Mirrors",
      date: "2024-06-11",
      quantity: 75,
      description: "Decorative wall mirrors.",
      details: "Size: 24x36 inches, Frame: Silver",
      category: "Home Decor",
      image:
        "https://m.media-amazon.com/images/I/41GdPY9ztQL._SY300_SX300_QL70_FMwebp_.jpg",
    },
  ];
  return (
    <>
      <hr className="text-dark/22" />
      <div>
        <div className="border border-dark border-t overflow-y-visible rounded bg-white md:w-[60%] mx-auto">
          <h1 className="text-dark p-2 font-bold text-2xl">
            Posts you might be interested in
          </h1>
          <div className="flex justify-between p-2 w-full border-b border-dark">
            <div className="relative border rounded-lg border-dark w-[50%]">
              <input
                type="text"
                placeholder="Search"
                className="bg-light text-dark rounded-lg placeholder:text-dark pl-8 py-1 w-full"
              />
              <Search
                size={20}
                className="text-dark absolute left-1 top-1/2 -translate-y-1/2 "
              />
            </div>
            <div className="relative border rounded-lg border-dark w-[40%]">
              <select
                defaultValue={""}
                className="bg-light text-dark rounded-lg h-full placeholder:dark/22 pl-8 py-1 w-full"
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
                className="flex flex-col py-3 px-2 w-full first:border-0 border-t border-dark"
              >
                <div className="flex justify-center items-center">
                  <img src={post.image} alt={post.title} className="h-80" />
                </div>
                <p className="text-dark font-semibold text-2xl">{post.title}</p>
                <p className="text-dark/70">{post.description}</p>
                <div>
                  <div className="flex flex-col">
                    <p className="text-dark/70">
                      <span className="font-bold text-dark/90">Quantity: </span>
                      {post.quantity}
                    </p>
                    <p className="text-dark/70">
                      <span className="font-bold text-dark/90">Details: </span>
                      {post.details}
                    </p>
                  </div>
                </div>
                <button className="py-2 my-2 px-6 w-full md:w-fit bg-dark text-white rounded font-medium">
                  Make Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
