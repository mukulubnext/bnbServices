"use client";
import Item from "@/app/post/components/Item";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  IndianRupee,
  Mail,
  Pencil,
  PhoneCall,
  Pin,
  Plus,
  User,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ItemData {
  categoryId: number | undefined;
  details: string;
  quantity: number;
  budget: number;
  subcategoryId: number | undefined;
}

interface Props {
  postId: number;
  setExpandPost: React.Dispatch<
    React.SetStateAction<number | null | undefined>
  >;
  editPost: number | null | undefined;
  setEditPost: React.Dispatch<React.SetStateAction<number | null | undefined>>;
}

export default function PostDetails({
  postId,
  setExpandPost,
  editPost,
  setEditPost,
}: Props) {

  const searchParams = useSearchParams();

  const [post, setPost] = useState<any>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [offers, setOffers] = useState<any[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const edit = searchParams.get("edit") === "true";
  const [allCategories, setAllCategories] = useState<any[]>([]);

  const { loading, user } = useAuth();

  const [buyer, setBuyer] = useState<any>();
  const [fetchingBuyer, setFetchingBuyer] = useState(false);
  const [madeOffer, setMadeOffer] = useState(false);

  const [posting, setPosting] = useState(false);

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
    if (editPost === postId) {
      setCanEdit(true);
    }
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
          setItems(post.items);
          setCreatedAt(post.createdAt);
          setUpdatedAt(post.updatedAt);
          setOffers(post.offers);
        }
      } catch {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    const getOffer = async () => {
      if (user.role === "buyer") return;
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
    if (!title || !description || !items.length) {
      toast.error("Please fill all the fields!");
      return;
    }

    const itemsData: ItemData[] = items.map((item) => ({
      categoryId: item.categoryId,
      details: item.details,
      quantity: Number(item.quantity),
      budget: Number(item.budget),
      subcategoryId: item.subcategoryId
    }));

    const isSamePost =
      title === post.title &&
      description === post.description &&
      JSON.stringify(itemsData) === JSON.stringify(post.items);

    if (isSamePost) {
      setCanEdit(false);
      return;
    }

    try {
      setPosting(true);

      const res = await axios.put(`/api/v1/post/edit/${postId}`, {
        title,
        description,
        items: itemsData,
      });

      if (res.data.status === "success") {
        toast.success("Post updated successfully! Refresh to see changes.");
        setPost(res.data.post);
        setCanEdit(false);
        setTitle(post.title);
        setDescription(post.description);
        setItems(post.items);
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
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { categoryId: undefined, details: "", quantity: 1, budget: 0, subcategoryId: undefined },
    ]);
  };
  return (
    <div
      onClick={() => {
        setExpandPost(null);
        setEditPost(null);
      }}
      className="flex z-100 absolute top-0 left-0 py-10 w-screen min-h-screen bg-black/80 flex-col"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white flex justify-center relative flex-col py-10 px-5 text-dark gap-4 w-[90vw] md:w-[60vw] h-fit rounded-lg mx-auto"
      >
        <div
          onClick={() => {
            setExpandPost(null);
            setEditPost(null);
          }}
          className="transition-all absolute hover:bg-dark/30 top-1 left-[1%] p-2 flex justify-center items-center w-fit rounded-full"
        >
          <X className="cursor-pointer text-dark" />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner light={false} />
          </div>
        ) : !canEdit ? (
          <>
            <div className="flex justify-between flex-col items-start md:flex-row md:items-center">
              <div>
                <h1 className="font-bold text-2xl md:text-4xl">{title}</h1>
                <p className="text-xs font-medium text-muted">{createdAt !== updatedAt && "(Edited)"}</p>
              </div>
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
            <hr className="text-dark/50" />
            <p className="whitespace-pre-wrap">
              <span className="font-semibold">Description:</span>
              <br />
              {description}
            </p>
            <hr className="text-dark/50" />
            <div>
              <span className="font-semibold">Items:</span>
              {post.items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between not-last:border-b border-dark/20 py-2 px-3 gap-2"
                >
                  <div>
                    <h1 className="font-semibold text-lg">
                      {i + 1}. {item.category.name}: <span className="font-medium">{item.subCategory.name}</span>
                    </h1>
                    <p>{item.details}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="flex items-center font-medium">
                      <IndianRupee size={16} /> {item.budget}
                    </p>
                    <p className="flex items-center gap-1 justify-end font-medium">
                      <span className="font-medium">Quantity: </span>{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                        View Details
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
                <div className="flex flex-col gap-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="not-last:border-b group border-dark/40"
                    >
                      <div className="flex justify-between group-only:hidden items-center">
                        <span className="text-dark font-bold">
                          {index + 1}.
                        </span>

                        <div
                          onClick={() =>
                            setItems((prev) =>
                              prev.filter((_, i) => i !== index),
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
                          setItems((prev) => {
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
