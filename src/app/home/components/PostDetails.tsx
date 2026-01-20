"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  IndianRupee,
  Mail,
  Pencil,
  PhoneCall,
  Pin,
  User,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { set } from "zod";

interface Props {
  postId: number;
  setExpandPost: React.Dispatch<
    React.SetStateAction<number | null | undefined>
  >;
}

export default function PostDetails({ postId, setExpandPost }: Props) {
  const searchParams = useSearchParams();
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
  const [categoryName, setCategoryName] = useState("");
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [offers, setOffers] = useState<any[]>([]);

  const edit = searchParams.get("edit") === "true";
  const [allCategories, setAllCategories] = useState<any[]>([]);

  const { loading, user } = useAuth();

  const [buyer, setBuyer] = useState<any>();
  const [fetchingBuyer, setFetchingBuyer] = useState(false);
  const [madeOffer, setMadeOffer] = useState(false);

  const [hasOffer, setHasOffer] = useState(false);
  const [fetchingOffer, setFetchingOffer] = useState(false);

  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/category");
      setAllCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
          setCategoryName(post.category?.name);
          setCategory(post.category?.id);
          setOffers(post.offers);
        }
      } catch {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    const getOffer = async () => {
      try {
        setFetchingOffer(true);
        const res = await axios.post(`/api/v1/offer/check`, { postId: postId });
        if (res.data.status === "success") {
          setHasOffer(res.data.hasOffer);
        }
        if (res.data.hasOffer) {
          setFetchingBuyer(true);
          const buyer = await axios.get(
            `/api/v1/user/${res.data.offer.post.userId}`,
          );
          if (buyer.data.status === "success") {
            setBuyer(buyer.data.buyer);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingOffer(false);
        setFetchingBuyer(false);
      }
    };
    getPost();
    getOffer();
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
        category,
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
    setCategory(post.category?.id);
    setCategoryName(post.category?.name);
  };

  const handleMakeOffer = async () => {
    if (user.role === "buyer") {
      toast.error("You can't make an offer for your own post");
      return;
    }
    if (hasOffer) {
      toast.error("You already have an offer for this post");
      return;
    }
    try {
      setFetchingBuyer(true);
      const offer = await axios.post(`/api/v1/offer/make`, { postId: postId });
      if (offer.data.status === "failed") {
        toast.error(offer.data.message);
        return;
      }
      const buyerId = offer.data.buyerId;
      const res = await axios.get(`/api/v1/user/${buyerId}`);
      if (res.data.status === "failed") {
        toast.error("Failed to fetch buyer's details");
        return;
      }
      setBuyer(res.data.buyer);
      setMadeOffer(true);
      setHasOffer(true);
    } catch (err) {
      toast.error("Failed to fetch buyer's details");
      console.error(err);
    } finally {
      setFetchingBuyer(false);
    }
  };

  return (
    <div
      onClick={() => setExpandPost(null)}
      className="flex z-100 absolute top-0 left-0 py-10 w-screen min-h-screen bg-black/80 flex-col"
    >
      <div
        onClick={() => setExpandPost(null)}
        className="transition-all absolute top-10 left-[5%] p-2 flex justify-center items-center w-fit rounded-full"
      >
        <X className="cursor-pointer md:text-light text-dark" />
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white flex justify-center flex-col py-10 px-5 text-dark gap-4 w-[90vw] md:w-[60vw] h-fit rounded-lg mx-auto"
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner light={false} />
          </div>
        ) : !canEdit ? (
          <>
            <div className="flex justify-between flex-col items-start md:flex-row md:items-center">
              <h1 className="font-bold text-2xl md:text-4xl">{title}</h1>
              <div>
                <p className="text-xs">
                  Created at:{" "}
                  {createdAt &&
                    new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour12: true,
                    }).format(new Date(createdAt))}
                </p>
                {createdAt && updatedAt !== createdAt && (
                  <p className="text-xs">
                    Last Edited:{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour12: true,
                    }).format(new Date(updatedAt))}
                  </p>
                )}
              </div>
            </div>
            {categoryName && (
              <div className="flex justify-center text-xs items-center px-3 py-1 font-medium text-white bg-dark w-fit rounded-full">
                {categoryName}
              </div>
            )}
            <hr className="text-dark/50" />
            <p className="whitespace-pre-wrap">
              <span className="font-semibold">Description:</span>
              <br />
              {description}
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
            {user && user.role === "buyer" ? (
              <button
                onClick={() => setCanEdit(true)}
                className="flex hover:bg-dark hover:text-white transition-all duration-300 cursor-pointer justify-center items-center gap-2 px-4 py-2 rounded border border-dark bg-white font-medium"
              >
                <Pencil size={20} /> Edit
              </button>
            ) : (
              <>
                <div className="flex justify-center items-center mt-10">
                  {fetchingBuyer ? (
                    <div className="flex justify-center items-center">
                      <Spinner light={false} />
                    </div>
                  ) : (
                    !madeOffer &&
                    !hasOffer && (
                      <button
                        onClick={handleMakeOffer}
                        className="flex w-fit hover:bg-transparent text-white hover:text-dark transition-all duration-300 cursor-pointer justify-center items-center gap-2 px-4 py-2 rounded border bg-dark font-medium"
                      >
                        Make Offer
                      </button>
                    )
                  )}
                </div>
                {buyer && hasOffer && (
                  <>
                    <div className="flex flex-col border p-3 gap-2">
                      <h1 className="font-bold text-center text-xl">
                        Buyer's Details:
                      </h1>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold flex items-center gap-1">
                          <User size={16} /> Buyer:{" "}
                        </span>{" "}
                        {buyer.companyName}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold flex items-center gap-1">
                          <PhoneCall size={16} /> Phone Number:{" "}
                        </span>{" "}
                        <a href={`tel:${buyer.phone}`} className="underline">
                          {buyer.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold flex items-center gap-1">
                          <Mail size={16} /> Email:{" "}
                        </span>{" "}
                        <a href={`mailto:${buyer.email}`} className="underline">
                          {buyer.email}
                        </a>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="font-semibold flex items-center gap-1">
                          <Pin size={16} /> Address:{" "}
                        </span>{" "}
                        <p>
                          {buyer.address}, {buyer.city}, {buyer.state},{" "}
                          {buyer.zipCode}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          user &&
          user.role === "buyer" && (
            <>
              <div className="overflow-y-scroll md:overflow-y-auto flex flex-col max-h-[80vh] gap-4 mt-6">
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
                  <span className="text-dark font-medium">Category:</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(Number(e.target.value))}
                    className="border border-dark/20 rounded-md p-2 focus:outline-none focus:border-dark transition-all"
                  >
                    <option value={""} disabled>
                      Select a category
                    </option>
                    {allCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-dark font-medium">
                    Quantity(min 1):
                  </span>
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
          )
        )}
      </div>
    </div>
  );
}
