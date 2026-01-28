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
import { toast, ToastContainer } from "react-toastify";
import PostDetails from "./components/PostDetails";
import AllItems from "./components/AllItems";

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
  type SortKey = "title" | "date" | "category" | "active" | "offers";
  type SortOrder = "asc" | "desc";

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [range, setRange] = useState(1);

  const [deletePost, setDeletePost] = useState(false);
  const [deletePostId, setDeletePostId] = useState(NaN);
  const [deletePostTitle, setDeletePostTitle] = useState("");
  
  const [items, setItems] = useState<any[] | null>();

  const [editPost, setEditPost] = useState<number | null | undefined>();

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

  const fetchPosts = async (r: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/post/allPosts/${r}`);

      if (res.data.status === "success") {
        setPosts((prev) =>
          r === 1 ? res.data.posts : [...prev, ...res.data.posts],
        );

        setHasMore(res.data.hasMore);
        if (res.data.status === "failed") {
          toast.error(res.data.message);
          setRange(0);
        }
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
          a.category.name.localeCompare(b.category.name),
      );
    sort.key === "category" &&
      sort.order === "desc" &&
      posts.sort(
        (a: any, b: any) =>
          a.category &&
          b.category &&
          b.category.name.localeCompare(a.category.name),
      );

    sort.key === "category" &&
      sort.order === "desc" &&
      posts.sort(
        (a: any, b: any) =>
          a.category &&
          b.category &&
          b.category.name.localeCompare(a.category.name),
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
  const [expandPost, setExpandPost] = useState<number | null>();

  return (
    <>
      <ToastContainer />
      {
        items && <AllItems items={items} setItems={setItems}/>
      }
      {expandPost && (
        <PostDetails
          postId={expandPost}
          setExpandPost={setExpandPost}
          editPost={editPost}
          setEditPost={setEditPost}
        />
      )}
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
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="bg-white relative my-2 shadow rounded-md min-w-200 w-full">
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
                    Items
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
                    Views
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
                      setExpandPost(post.id);
                    }}
                    className="text-black/90 cursor-pointer hover:bg-dark/5 transition-all duration-300 border-t border-b last:border-b-0 border-dark/20 even:bg-dark/2"
                  >
                    <td className="px-3 py-4 font-medium text-dark text-left">
                      {post.title}
                    </td>

                    <td className="px-3 py-4 text-dark/70">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "short",
                      }).format(new Date(post.createdAt))}
                    </td>
                    <td className="px-3 py-4 bottom-1 relative flex gap-2 items-center text-dark/70">
                      <span className={`flex gap-2 relative max-w-50 items-center`}>
                        {post.items.length ? (
                          // post.items.map((item: any) => (
                          //   <div
                          //   key={item.id}
                          //   className="py-1 px-3 bg-dark text-white font-medium text-nowrap text-sm w-fit rounded-full"
                          //   >
                          //     {item.category.name}
                          //   </div>
                          // ))
                          <div onClick={(e)=>{
                            e.stopPropagation()
                            setItems(post.items)
                          }} className="text-sm px-3 py-1 active:scale-95 active:-translate-y-0.5 border font-medium rounded transition-all select-none hover:-translate-y-1 duration-300 cursor-pointer">
                              View Items
                          </div>
                        ) : (
                          <p className="text-black/50">no items</p>
                        )}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-center font-bold text-dark">
                      {post.offers.length}
                    </td>
                    <td className="flex px-3 py-4 top-1 relative justify-center">
                      <EllipsisComp
                        postId={post.id}
                        setDeletePost={setDeletePost}
                        setDeletePostId={setDeletePostId}
                        setDeletePostTitle={setDeletePostTitle}
                        deletePostTitle={deletePostTitle}
                        setEditPost={setEditPost}
                        setExpandPost={setExpandPost}
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

type SortKey = "title" | "date" | "category";
type SortOrder = "asc" | "desc";

type Post = {
  id: number;
  title: string;
  createdAt: string;
  category?: { name: string };
  items: any[];
};

function Seller() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [range, setRange] = useState(1);

  const [sort, setSort] = useState<{ key: SortKey; order: SortOrder }>({
    key: "date",
    order: "desc",
  });

  const sortedPosts = useMemo(() => {
    const { key, order } = sort;

    return [...posts].sort((a, b) => {
      switch (key) {
        case "title":
          return order === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);

        case "category":
          return order === "asc"
            ? (a.category?.name ?? "").localeCompare(b.category?.name ?? "")
            : (b.category?.name ?? "").localeCompare(a.category?.name ?? "");

        case "date":
        default:
          return order === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [posts, sort]);

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, order: prev.order === "asc" ? "desc" : "asc" }
        : { key, order: "asc" },
    );
  };

  const fetchPosts = async (r: number) => {
    try {
      if (r > 1) setLoadingMore(true);
      else setLoading(true);

      const res = await axios.get(`/api/v1/post/recommend/${r}`);

      if (res.data.status === "success") {
        setPosts((prev) =>
          r === 1 ? res.data.posts : [...prev, ...res.data.posts],
        );
        setHasMore(res.data.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextRange = range + 1;
    setRange(nextRange);
    fetchPosts(nextRange);
  };

  const [expandPost, setExpandPost] = useState<number | null | undefined>();

  return (
    <>
      <hr className="text-dark/22" />

      <div>
        <h1 className="text-dark p-2 font-bold text-2xl">
          Posts you might be interested in
        </h1>
        {expandPost && (
          <PostDetails
            postId={expandPost}
            setExpandPost={setExpandPost}
            editPost={null}
            setEditPost={() => {}}
          />
        )}
        <div className="overflow-x-auto">
          <table className="bg-white shadow rounded-md w-full min-w-200">
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
                    Posted On
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
                    Items
                    <SortIndicator
                      active={sort.key === "category"}
                      order={sort.order}
                    />
                  </div>
                </th>

                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            {!loading ? (
              <tbody>
                {sortedPosts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => setExpandPost(post.id)}
                    className="text-black/90 cursor-pointer hover:bg-dark/5 transition-all duration-300 border-t border-b last:border-b-0 border-dark/20 even:bg-dark/2"
                  >
                    <td className="p-3 font-medium text-dark">{post.title}</td>
                    <td className="p-3 text-dark/70">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "short",
                      }).format(new Date(post.createdAt))}
                    </td>
                    <td className="px-3 py-4 bottom-1 relative flex gap-2 items-center text-dark/70">
                      <span className={`flex gap-2 relative max-w-50 items-center no-scrollbar ${post.items.length > 2 ? " overflow-x-scroll": ""}`}>
                        {post.items.length ? (
                          post.items.map((item: any) => (
                            <div
                            key={item.id}
                            className="py-1 px-3 bg-dark text-white font-medium text-nowrap text-sm w-fit rounded-full"
                            >
                              {item.category.name}
                            </div>
                          ))
                        ) : (
                          <p className="text-black/50">no items</p>
                        )}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-white bg-dark py-1 px-3 rounded border hover:text-dark hover:bg-transparent cursor-pointer transition-all duration-300">
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {hasMore && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      {loadingMore ? (
                        <Spinner light={false} />
                      ) : (
                        <button
                          onClick={handleLoadMore}
                          className="px-4 py-2 bg-dark text-white rounded hover:bg-white hover:text-dark border transition"
                        >
                          Load More
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={4} className="p-6 text-center">
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
