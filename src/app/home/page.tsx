"use client";
import Navbar from "@/components/Navbar";
import {
  ArrowUpDown,
  Eye,
  EyeOff,
  Loader,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import LiquidGlassMenu from "../../components/LiquidGlassMenu";
import EllipsisComp from "./components/Ellipsis";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import ConfirmDelete from "./components/ConfirmDelete";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [greeting, setGreeting] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();
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
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);
  return (
    <div className="flex flex-col px-[5%] pb-10 pt-24 md:pt-30 gap-5 min-h-screen bg-light">
      {!loading && user ? (
        <>
          <Navbar solid={true} />
          <div className="text-dark md:gap-4 font-bold flex-col flex text-3xl md:text-4xl lg:text-6xl md:flex-row">
            <span>{greeting},</span>
            <span>{user.companyName}...</span>
          </div>
          {user.role === "buyer" ? <Buyer /> : <Seller />}
          <LiquidGlassMenu />
        </>
      ) : (
        <div className="mx-auto flex justify-center items-center flex-col gap-4 font-bold text-dark">
          <Spinner light={false} />
        </div>
      )}
    </div>
  );
};

export default Page;

function Buyer() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [range, setRange] = useState(1);
  const [deletePost, setDeletePost] = useState(false);
  const [deletePostId, setDeletePostId] = useState(NaN);
  const [deletePostTitle, setDeletePostTitle] = useState("");
  const [postRedirecting, setPostRedirecting] = useState(0);
  const router = useRouter();

  const fetchPosts = async (r: number) => {
    try {
      const res = await axios.get(`/api/v1/post/allPosts/${r}`);

      if (res.data.status === "success") {
        setPosts((prev) =>
          r === 1 ? res.data.posts : [...prev, ...res.data.posts]
        );

        setHasMore(res.data.hasMore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;

    const nextRange = range + 1;
    setLoadingMore(true);
    setRange(nextRange);
    fetchPosts(nextRange);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between relative items-center">
        {
          deletePost && (
            <ConfirmDelete postId={deletePostId} postTitle={deletePostTitle} setDeletePost={setDeletePost} fetchPosts={fetchPosts}/>
          )
        }
        <p className="text-lg md:text-3xl text-dark">
          Need to buy something? Make a post!
        </p>
        <Link
          href={"/post"}
          className="flex gap-4 justify-center items-center w-full bg-dark md:max-w-[40%] text-highlight font-bold py-2 md:text-2xl hover:bg-transparent border border-dark hover:text-dark transition-all duration-300 rounded-lg"
        >
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
            <div className="relative bg-light  border rounded-lg border-dark w-10 md:min-w-fit md:w-[20%]">
              <select
                defaultValue={""}
                className="text-dark rounded-lg h-full placeholder:dark/22 pl-8 py-1 w-full"
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
            {!loading && posts.length > 0 ? (
              posts.map((post: any) => (
                postRedirecting !== post.id ? (
                    <div
                  key={post.id}
                  onClick={() => {
                    setPostRedirecting(post.id);
                    router.push(`/post/${post.id}`);
                  }}
                  className="flex justify-between hover:bg-dark/5 cursor-pointer items-center py-3 px-2 w-full first:border-0 border-t border-dark"
                >
                  <p className="text-dark font-semibold">{post.title}</p>
                  <p className="text-dark/70">{post.date}</p>
                  <EllipsisComp postId={post.id} isActive={post.isActive} setDeletePost={setDeletePost} setDeletePostId={setDeletePostId} deletePostTitle={post.title} setDeletePostTitle={setDeletePostTitle}/>
                  <div className="hidden md:flex justify-center gap-6 lg:gap-10 items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/post/${post.id}/?edit=true`);
                      }}
                      className="font-bold flex justify-center items-center gap-1 hover:scale-105 py-1 px-4 border border-dark text-dark transition-all duration-300 rounded-lg"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    {post.isActive ? (
                      <button className="font-bold flex justify-center items-center gap-1 hover:scale-105 py-1 px-4 border border-dark text-dark transition-all duration-300 rounded-lg">
                        <EyeOff size={16} /> Hide Post
                      </button>
                    ) : (
                      <div>
                        <button className="font-bold flex justify-center items-center gap-1 hover:scale-105 py-1 px-4 border border-dark text-dark transition-all duration-300 rounded-lg">
                          <Eye size={16} /> Unhide Post
                        </button>
                      </div>
                    )}
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setDeletePost(true);
                        setDeletePostId(post.id);
                        setDeletePostTitle(post.title);
                      }}
                    className="font-bold flex justify-center items-center gap-1 hover:scale-105 py-1 px-4 border border-red-500 text-red-500 transition-all duration-300 rounded-lg">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
                )
                :
                (
                  <div className="flex justify-between hover:bg-dark/5 cursor-pointer items-center py-5 px-2 w-full first:border-0 border-t bg-dark/30 animate-pulse border-dark"></div>
                )
              ))
            ) : !loading && posts.length === 0 ? (
              <div className="flex justify-center py-2 items-center">
                <p className="text-dark/70">No posts found</p>
              </div>
            ) : (
              <div className="flex justify-center items-center py-6">
                <Spinner light={false} />
              </div>
            )}
          </div>
          {!loadingMore ? (
            !loading && hasMore && (
              <button
                onClick={handleLoadMore}
                className="border px-2 my-2 rounded text-dark font-medium mx-auto flex justify-center items-center w-fit hover:opacity-50 transition-all"
              >
                Load More
              </button>
            )
          ) : (
            <Loader
              size={20}
              className="animate-spin my-2 text-dark flex justify-center items-center mx-auto"
            />
          )}
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
            <div className="relative bg-light  border rounded-lg border-dark w-10 md:min-w-fit md:w-[20%]">
              <select
                defaultValue={""}
                className="text-dark z-50 rounded-lg h-full placeholder:dark/22 pl-8 py-1 w-full"
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
