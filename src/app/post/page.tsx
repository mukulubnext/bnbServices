"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { IndianRupee } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [budget, setBudget] = useState(0);
  const [posting, setPosting] = useState(false);
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/category");
      setAllCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchCategories();
  },[])

  const handlePost = async () => {
    setPosting(true);
    const body = {
      title,
      description,
      details,
      quantity,
      budget,
      category
    };
    if(!title || !description || !details || !quantity || !budget){
      toast.error("Please fill all the fields!");
      setPosting(false);
      return;
    }
    try {
      const res = await axios.post("/api/v1/post/create", body);
      if (res.data.status === "success") {
        toast.success("Post created successfully!");
        setTitle("");
        setDescription("");
        setDetails("");
        setQuantity(1);
        setBudget(0);
        setCategory(undefined);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
    finally{
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
          <div>
            <div className="flex flex-col gap-4 mt-6">
              <label className="flex flex-col gap-2">
                <span className="text-dark font-medium">Title (3-100 characters):</span>
                <input
                  type="text"
                  placeholder="Cartons"
                  value={title}
                  minLength={3}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-dark font-medium">Description (3-1000 characters):</span>
                <textarea
                  value={description}
                  minLength={3}
                  contentEditable={true}
                  maxLength={1000}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Need high quality cartons for packaging of Wooden Artifacts"
                  className="border border-dark/20 rounded-md p-2 h-32 focus:outline-none focus:border-dark transition-all"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-dark font-medium">More Details(max 200 characters):</span>
                <input
                  type="text"
                  maxLength={200}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Size, Material, Type etc."
                  className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
                />
              </label>
              
              <label className="flex flex-col gap-2">
                <span className="text-dark font-medium">Category:</span>
                <select
                  value={category}
                  defaultValue={""}
                  onChange={(e) => setCategory(Number(e.target.value))}
                  className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
                >
                  <option value={""} disabled>
                    Select a category
                  </option>
                  {
                    allCategories.map((cat)=>(
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                  </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-dark font-medium">Quantity(min 1):</span>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.valueAsNumber)}
                  type="number"
                  min={1}
                  placeholder="1, 5, 10, 100 etc."
                  className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-dark font-medium">Budget:</span>
                <div className="relative w-full flex items-center">
                  <input
                  type="number"
                  value={budget}
                  min={0}
                  onChange={(e) => setBudget(e.target.valueAsNumber)}
                  placeholder="Budget for whole order (in INR)"
                  className="border pl-8 border-dark/20 rounded-md p-2 w-full focus:outline-none focus:border-dark transition-all"
                />
                <IndianRupee size={16} className="absolute text-dark left-2"/>
                </div>
              </label>
              {
                !posting ?
                (
                  <button
                type="submit"
                onClick={() => handlePost()}
                className="bg-dark text-highlight font-bold py-2 hover:bg-transparent border border-dark hover:text-dark transition-all duration-300 rounded-lg mt-4 w-fit px-6"
              >
                Post
              </button>
                )
                :
              (
                <div
                className="text-highlight font-bold py-2 hover:bg-transparent border border-dark transition-all duration-300 rounded-lg mt-4 w-fit px-8"
              >
                <Spinner light={false} />
              </div>
              )
              }
            </div>
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
