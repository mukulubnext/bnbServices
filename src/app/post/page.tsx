"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { IndianRupee, Plus, X } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Item from "./components/Item";

interface ItemData {
  categoryId: number | undefined;
  details: string;
  quantity: number;
  budget: number;
}

const Page: NextPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posting, setPosting] = useState(false);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  const [itemsData, setItemsData] = useState<ItemData[]>([
    { categoryId: undefined, details: "", quantity: 1, budget: 0 },
  ]);

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  useEffect(() => {
    axios
      .get("/api/v1/category")
      .then((res) => setAllCategories(res.data.categories))
      .catch(console.error);
  }, []);

  const handleAddItem = () => {
    setItemsData((prev) => [
      ...prev,
      { categoryId: undefined, details: "", quantity: 1, budget: 0 },
    ]);
  };

  const handlePost = async () => {
    const filtered = itemsData.filter(
      (i) => i.categoryId && i.quantity > 0 && i.budget > 0
    );

    if (!title || !description || filtered.length === 0) {
      toast.error("Please fill all the fields!");
      return;
    }

    setPosting(true);

    try {
      const res = await axios.post("/api/v1/post/create", {
        title,
        description,
        itemsData: filtered,
      });

      if (res.data.status === "success") {
        toast.success("Post created successfully!");
        setTitle("");
        setDescription("");
        setItemsData([{ categoryId: 0, details: "", quantity: 1, budget: 0 }]);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen py-[10vh] items-center relative bg-light">
      <Navbar solid />
      <LiquidGlassMenu />
      <ToastContainer />

      {!loading && user && user.role === "buyer" ? (
        <div className="bg-white py-10 flex p-6 flex-col min-h-[80vh] w-[90vw] md:w-[60vw] border border-dark rounded-lg mx-auto">
          <h1 className="text-dark font-semibold text-3xl">
            Add a requirement
          </h1>

          <div className="flex flex-col gap-4 mt-6">
            {/* title */}
            <label className="flex flex-col gap-2">
              <span className="text-dark font-medium">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Cartons"
                className="border border-dark/20 rounded-md p-2"
              />
            </label>

            {/* description */}
            <label className="flex flex-col gap-2">
              <span className="text-dark font-medium">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Need high quality cartons for packaging of Wooden Artifacts"
                className="border border-dark/20 rounded-md p-2 h-32"
              />
            </label>

            {/* items */}
            <div className="flex flex-col gap-3">
              {itemsData.map((item, index) => (
                <div
                  key={index}
                  className="not-last:border-b group border-dark/40"
                >
                  <div className="flex justify-between group-only:hidden items-center">
                    <span className="text-dark font-bold">{index + 1}.</span>

                    <div
                      onClick={() =>
                        setItemsData((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className={`text-red-500 flex justify-between items-center cursor-pointer hover:bg-highlight transition-all duration-300 p-1 rounded-full ${
                        index === 0 && "hidden"
                      }`}
                    >
                      <X size={16} />
                    </div>
                  </div>

                  <Item
                    value={item}
                    allCategories={allCategories}
                    onChange={(updated) => {
                      setItemsData((prev) => {
                        const copy = [...prev];
                        copy[index] = updated;
                        return copy;
                      });
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleAddItem}
              className="bg-dark gap-2 border hover:text-dark hover:bg-white transition-all duration-300 cursor-pointer text-white font-bold flex justify-center items-center w-full py-2 px-3"
            >
              <Plus /> Add Item
            </button>

            {!posting ? (
              <button
                onClick={handlePost}
                className="bg-dark text-highlight font-bold py-2 hover:bg-transparent border border-dark hover:text-dark transition-all duration-300 rounded-lg mt-4 w-fit px-6"
              >
                Post
              </button>
            ) : (
              <div className="text-highlight font-bold py-2 border border-dark rounded-lg mt-4 w-fit px-8">
                <Spinner light={false} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Spinner light={false} />
        </div>
      )}
    </div>
  );
};

export default Page;
