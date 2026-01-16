"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { IndianRupee, Pencil } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Page({
  params,
}: {
  params: Promise<{ postId: number }>;
}) {
  const searchParams = useSearchParams();
  const postId = Number(use(params).postId);
  const [post, setPost] = useState<any>({});
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [budget, setBudget] = useState<number>(0);
  const [posting, setPosting] = useState(false);
  const edit = searchParams.get("edit") === "true";
  const router = useRouter();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`/api/v1/post/${postId}`);
        if (res.data.status === "success") {
          const post = res.data.post;
          setPost(post);
          setTitle(post.title);
          setDescription(post.description);
          setDetails(post.details);
          setQuantity(Number(post.quantity));
          setBudget(Number(post.budget));
          setCreatedAt(post.createdAt);
          setUpdatedAt(post.updatedAt);
          console.log(typeof post.budget);
        }
      } catch {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    getPost();
    if (edit) {
      setCanEdit(true);
    }
  }, []);
  const handlePost = async () => {
    if (!title || !description || !details || !quantity || !budget) {
      toast.error("Please fill all the fields!");
      setPosting(false);
      return;
    }
    if (
      title === post.title &&
      description === post.description &&
      details === post.details &&
      quantity === post.quantity &&
      budget === post.budget
    ) {
      setCanEdit(false);
      return;
    }
    try {
      setPosting(true);
      const res = await axios.put(`/api/v1/post/edit/${postId}`, {
        title,
        description,
        details,
        quantity,
        budget,
      });
      if (res.data.status === "success") {
        toast.success("Post updated successfully!");
        setPost(res.data.post);
        setCanEdit(false);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setPosting(false);
    }
  };
  const handleCancel = () => {
    setCanEdit(false);
    setTitle(post.title);
    setDescription(post.description);
    setDetails(post.details);
    setQuantity(post.quantity);
    setBudget(post.budget);
  };
  return (
    <div className="flex py-[12vh] min-h-screen bg-light">
      <Navbar solid />
      <LiquidGlassMenu />
      <ToastContainer />
      <div className="bg-white gap-3 px-[5%] md:px-12 text-dark md:w-[60vw] py-8 h-fit rounded-lg border border-dark flex flex-col w-[90vw] mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner light={false} />
          </div>
        ) : !canEdit ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-4xl">{title}</h1>
              <div>
                <p className="text-xs">Created at: {new Intl.DateTimeFormat('en-GB',{dateStyle:'short', timeStyle:'short', hour12:true}).format(new Date(createdAt))}</p>
                {updatedAt!==createdAt && <p className="text-xs">Last Edited: {new Intl.DateTimeFormat('en-GB',{dateStyle:'short', timeStyle:'short', hour12:true}).format(new Date(updatedAt))}</p>}
              </div>
            </div>
            <hr className="text-dark/50" />
            <p className="whitespace-pre-wrap">
              <span className="font-semibold">Description:</span><br />{description}
            </p>
            <hr className="text-dark/50" />
            <p>
              <span className="font-semibold">Details:</span> {details}
            </p>
            <hr className="text-dark/50" />
            <p>
              <span className="font-semibold">Quantity:</span> {quantity}
            </p>
            <hr className="text-dark/50" />
            <p>
              <span className="font-semibold">Budget:</span> {budget}
            </p>
            <button
              onClick={() => setCanEdit(true)}
              className="flex hover:bg-dark hover:text-white transition-all duration-300 cursor-pointer justify-center items-center gap-2 px-4 py-2 rounded border border-dark bg-white font-medium"
            >
              <Pencil size={20} /> Edit
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 mt-6">
              <label className="flex flex-col gap-2">
                <span className="text-dark font-medium">
                  Title (3-100 characters):
                </span>
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
                <span className="text-dark font-medium">
                  Description (3-1000 characters):
                </span>
                <textarea
                  value={description}
                  contentEditable={true}
                  minLength={3}
                  maxLength={1000}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Need high quality cartons for packaging of Wooden Artifacts"
                  className="border border-dark/20 rounded-md p-2 h-32 focus:outline-none focus:border-dark transition-all"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-dark font-medium">
                  More Details(max 200 characters):
                </span>
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
                  <IndianRupee
                    size={16}
                    className="absolute text-dark left-2"
                  />
                </div>
              </label>
              {!posting ? (
                <div className="flex flex-col md:flex-row md:gap-2">
                  <button
                    onClick={() => handlePost()}
                    type="submit"
                    className="bg-dark text-white font-bold py-2 hover:bg-transparent border border-dark hover:text-dark transition-all duration-300 rounded-lg mt-4 md:w-fit px-6"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => handleCancel()}
                    type="submit"
                    className="bg-red-500 text-white font-bold py-2 hover:bg-transparent border border-red-500 hover:text-red-500 transition-all duration-300 rounded-lg mt-4 md:w-fit px-6"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-highlight font-bold py-2 hover:bg-transparent border border-dark transition-all duration-300 rounded-lg mt-4 w-fit px-8">
                  <Spinner light={false} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
