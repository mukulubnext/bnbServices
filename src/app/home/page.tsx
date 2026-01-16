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
import { useEffect, useMemo, useState } from "react";
import LiquidGlassMenu from "../../components/LiquidGlassMenu";
import EllipsisComp from "./components/Ellipsis";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import ConfirmDelete from "./components/ConfirmDelete";
import { SortIndicator } from "./components/SortIndicator";

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
          <div className="text-dark md:gap-4 font-bold flex-col flex text-2xl md:text-3xl lg:text-4xl md:flex-row">
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
  type SortKey = "title" | "date" | "category" | "offers";
  type SortOrder = "asc" | "desc";

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [range, setRange] = useState(1);

  const [deletePost, setDeletePost] = useState(false);
  const [deletePostId, setDeletePostId] = useState(NaN);
  const [deletePostTitle, setDeletePostTitle] = useState("");

  const [postRedirecting, setPostRedirecting] = useState(0);

  const [sort, setSort] = useState<{ key: SortKey; order: SortOrder }>({
    key: "date",
    order: "desc",
  });

  const sortedPosts = useMemo(() => {
    const { key, order } = sort;

    return [...posts].sort((a: any, b: any) => {
      let aVal: any;
      let bVal: any;

      switch (key) {
        case "title":
          aVal = a.title;
          bVal = b.title;
          return order === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);

        case "date":
          return order === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        case "category":
          aVal = a.category?.title ?? "";
          bVal = b.category?.title ?? "";
          return order === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);

        case "offers":
          return order === "asc"
            ? a.offers.length - b.offers.length
            : b.offers.length - a.offers.length;

        default:
          return 0;
      }
    });
  }, [posts, sort]);

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

  useEffect(() => {
    sort.key === "date" &&
      sort.order === "asc" &&
      posts.sort((a: any, b: any) => b.createdAt - a.createdAt);
    sort.key === "date" &&
      sort.order === "desc" &&
      posts.sort((a: any, b: any) => a.createdAt - b.createdAt);

    sort.key === "category" &&
      sort.order === "asc" &&
      posts.sort(
        (a: any, b: any) =>
          a.category &&
          b.category &&
          a.category.title.localeCompare(b.category.title)
      );
    sort.key === "category" &&
      sort.order === "desc" &&
      posts.sort(
        (a: any, b: any) =>
          a.category &&
          b.category &&
          b.category.title.localeCompare(a.category.title)
      );

    sort.key === "offers" &&
      sort.order === "asc" &&
      posts.sort((a: any, b: any) => a.offers.length - b.offers.length);
    sort.key === "offers" &&
      sort.order === "desc" &&
      posts.sort((a: any, b: any) => b.offers.length - a.offers.length);
  }, [sort]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;

    const nextRange = range + 1;
    setLoadingMore(true);
    setRange(nextRange);
    fetchPosts(nextRange);
  };
  const handleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { key, order: "asc" };
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between relative items-center">
        {deletePost && (
          <ConfirmDelete
            postId={deletePostId}
            postTitle={deletePostTitle}
            setDeletePost={setDeletePost}
            fetchPosts={fetchPosts}
          />
        )}
        <p className="text-lg md:text-2xl text-dark">
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
        <div>
          <table className="bg-white relative my-2 shadow rounded-md min-w-150 w-full">
            <thead>
              <tr className="bg-dark/2 text-dark/50">
                <th
                  onClick={() => handleSort("title")}
                  className={`p-3 cursor-pointer text-left ${
                    sort.key === "title" && "text-dark"
                  }`}
                >
                  <div className="flex items-center select-none">
                    Title
                    <SortIndicator
                      active={sort.key === "title"}
                      order={sort.order}
                    />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("date")}
                  className={`p-3 cursor-pointer text-left ${
                    sort.key === "date" && "text-dark"
                  }`}
                >
                  <div className="flex items-center select-none">
                    Date
                  <SortIndicator
                    active={sort.key === "date"}
                    order={sort.order}
                  />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("category")}
                  className={`p-3 cursor-pointer text-left ${
                    sort.key === "category" && "text-dark"
                  }`}
                >
                  <div className="flex items-center select-none">
                    Category
                  <SortIndicator
                    active={sort.key === "category"}
                    order={sort.order}
                  />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("offers")}
                  className={`p-3 cursor-pointer text-center ${
                    sort.key === "offers" && "text-dark"
                  }`}
                >
                  <div className="flex items-center justify-center select-none">
                    Offers
                  <SortIndicator
                    active={sort.key === "offers"}
                    order={sort.order}
                  />
                  </div>
                </th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            {!loading ? (
              <tbody>
                {sortedPosts.sort().map((post: any) => (
                  <tr
                    key={post.id}
                    onClick={() => {
                      router.push(`/post/${post.id}`);
                      setPostRedirecting(post.id);
                    }}
                    className="text-black/90 cursor-pointer hover:bg-dark/5 transition-all duration-300 border-t border-b last:border-b-0 border-dark/20 even:bg-dark/2"
                  >
                    {postRedirecting !== post.id ? (
                      <td className="px-3 py-4 font-medium text-dark text-left">
                        {post.title}
                      </td>
                    ) : (
                      <td className="px-3 py-4 text-left">
                        <Spinner light={false} />
                      </td>
                    )}
                    <td className="px-3 py-4">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "short",
                      }).format(new Date(post.createdAt))}
                    </td>
                    <td className="px-3 py-4">
                      {post.category ? (
                        <div className="py-1 px-3 bg-dark text-white font-medium text-sm w-fit rounded-full">
                          {post.category.title}
                        </div>
                      ) : (
                        <p className="text-black/50">no category</p>
                      )}
                    </td>
                    <td className="px-3 py-4 text-center font-bold text-dark">
                      {post.offers.length}
                    </td>
                    <td className="flex px-3 py-4 justify-center">
                      <EllipsisComp
                        isActive={post.isActive}
                        postId={post.id}
                        setDeletePost={setDeletePost}
                        setDeletePostId={setDeletePostId}
                        setDeletePostTitle={setDeletePostTitle}
                        deletePostTitle={deletePostTitle}
                      />
                    </td>
                  </tr>
                ))}
                {hasMore && (
                  <tr>
                    {loadingMore ? (
                      <td className="p-6 relative translate-x-4/2">
                        <Spinner light={false} />
                      </td>
                    ) : (
                      <td className="p-6 relative translate-x-5/3">
                        <button
                          onClick={handleLoadMore}
                          className="font-medium text-white transition-all duration-300 cursor-pointer bg-dark hover:bg-white hover:text-dark border p-2 rounded"
                        >
                          Load More
                        </button>
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            ) : (
              <tbody className="absolute flex justify-center bg-dark/30 animate-pulse w-full py-3 rounded-md items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <tr>
                  <td>
                    <Spinner light={false} />
                  </td>
                </tr>
              </tbody>
            )}
          </table>
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
