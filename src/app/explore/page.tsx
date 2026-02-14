"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { shrinkString } from "@/lib/shrink";
import axios from "axios";
import { Compass, Eye, MousePointerClick, Search } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PostDetails from "../home/components/PostDetails";
import AllItems from "../home/components/AllItems";

interface Props {}

// Allowed Role: Buyer Only

type SortKey = "title" | "date" | "category";
type SortOrder = "asc" | "desc";

const Page: NextPage<Props> = ({}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [range, setRange] = useState(1);
  const [items, setItems] = useState<any[] | null>();
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 500);
  const [expandPost, setExpandPost] = useState<number | null>();
  const [viewItems, setViewItems] = useState<number | null>();

  const [sort, setSort] = useState<{
    key: SortKey | null;
    order: SortOrder;
  }>({
    key: null,
    order: "asc",
  });

  const sortedPosts = useMemo(() => {
    if (!sort.key) return posts;

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
          return order === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        default:
          return 0;
      }
    });
  }, [posts, sort]);

  const fetchPosts = async (r: number) => {
    try {
      if (r > 1) setLoadingMore(true);
      else setLoading(true);

      const res = await axios.get(`/api/v1/post/recommend/${r}`);

      if (res.data.status === "success") {
        setPosts((prev) =>
          r === 1 ? res.data.posts : [...prev, ...res.data.posts],
        );
        setRange((prev) => prev + 1);
        setHasMore(res.data.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchPosts(range);
  };

  const handleSearch = (e: any) => {
    setQ(e.target.value);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
      return;
    }
    if (user && user.role !== "buyer") router.replace("/explore");
  }, [user, loading, router]);

  useEffect(() => {
    if (!debounced || debounced.length < 2) {
      fetchPosts(1);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`/api/v1/post/search`, { q: debounced });
        setPosts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debounced]);

  if (loading || !user) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-light">
        <Spinner light={false} />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen text-dark pt-[12vh] pb-[5vh] bg-light">
      <Navbar solid={true} />
      <LiquidGlassMenu />
      {expandPost && (
        <PostDetails
          postId={expandPost}
          setExpandPost={setExpandPost}
          editPost={null}
          setEditPost={() => {}}
        />
      )}
      {items && <AllItems items={items} setItems={setItems} />}
      <div className="flex flex-col md:w-[60%] w-[95%] mx-auto ">
        <h1 className="font-bold flex items-center gap-2 text-3xl tracking-tight">
          <Compass className="text-dark/70" /> Explore
        </h1>
        <p className="text-sm text-dark/60 max-w-md">
          See what other buyers are searching for. Trends, needs, and missed
          opportunities—served fresh.
        </p>

        <hr className="text-dark/50 my-4" />
        <div className="relative w-full mb-4">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40"
          />
          <input
            type="text"
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark/10 
               bg-white shadow-sm focus:ring-2 focus:ring-dark/20 
               focus:outline-none transition"
            placeholder="Search posts, categories, needs…"
          />
        </div>
        <div className="bg-white rounded-md shadow w-full px-3 py-2 space-y-3">
          {!isLoading && !loadingMore ? (
            posts.length > 0 ? (
              posts.map((post) => {
                const total = post.items.reduce(
                  (acc: any, item: any) =>
                    acc + Number(item.budget) * Number(item.units),
                  0,
                );

                return (
                  <div
                    onClick={() => {
                      setExpandPost(post.id);
                    }}
                    key={post.id}
                    className="w-full rounded-xl hover:bg-dark/5 border border-dark/10 p-4 flex flex-col gap-3 active:scale-[0.99] transition"
                  >
                    <div className="flex justify-between gap-2">
                      <div className="flex flex-col justify-between items-start gap-3">
                        <p className="text-dark font-semibold leading-snug">
                          {shrinkString(post.title, 34)}
                        </p>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setItems(post.items);
                          }}
                          className="text-dark underline underline-offset-4 font-semibold whitespace-nowrap cursor-pointer"
                        >
                          ₹{total}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-dark/60">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "medium",
                      }).format(new Date(post.createdAt))}
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex text-dark/70 text-sm flex-col items-start justify-start gap-0.5">
                        <span className="flex items-center gap-1">
                          <MousePointerClick size={16} /> Clicks:{" "}
                          <p className="font-bold">{post.clicks.length}</p>
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandPost(post.id);
                        }}
                        className="px-5 py-1.5 rounded-full bg-dark text-white text-sm font-medium active:scale-95 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex my-5 text-sm justify-center items-center">
                <p className="text-dark/50">No posts found</p>
              </div>
            )
          ) : (
            <div className="flex my-5 justify-center items-center">
              <Spinner light={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
