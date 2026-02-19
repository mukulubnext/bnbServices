"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CategoryCard from "./components/CategoryCard";
import Footer from "@/components/Footer";
import Link from "next/link";
import CardSkeleton from "./components/CardSkeleton";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      // Fetches all categories from the server and stores them in categories state
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/category");
        if (res.data.status === "success") {
          setCategories(res.data.categories);
          console.log(res.data);
        }
      } catch (err) {
        toast.error("Something went wrong!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="bg-light min-h-screen">
      <Navbar solid />
      <ToastContainer />
      <div className="py-24 px-[5%] min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark">Available Categories</h1>
          <p className="text-dark/60 text-sm mt-1">
            At Boxes n Bottles, we got various buyers and sellers dealing in
            following categories
          </p>
        </div>
        {!loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat.name}
                subCategories={cat.subCategories}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}
        <div className="flex flex-col justify-center items-center gap-1 my-4 text-dark/80 text-sm">
          <p className="text-center">
            Don't see your interested category? Don't worry! We are expanding
          </p>
          <p className="text-center">
            Want to suggest more categories?{" "}
            <Link
              href="/contact"
              className="underline font-semibold hover:no-underline"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
