"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import PostDetails from "../home/components/PostDetails";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandPost, setExpandPost] = useState<number | null | undefined>();
  const {user} = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
    if(!loading && user.role === "buyer"){
      router.push("/home");
    }
  }, [user]);
  useEffect(() => {
    const getOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/offer/allOffers");
        if (res.status === 200) {
          const data = await res.json();
          setOffers(data.offers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getOffers();
  }, []);
  return (
    <div className="bg-light w-screen py-[10vh] min-h-screen">
      <Navbar solid />
      <LiquidGlassMenu />
      {expandPost && (
        <PostDetails
          postId={expandPost}
          setExpandPost={setExpandPost}
          editPost={null}
          setEditPost={() => {}}
        />
      )}
      <div className="bg-white flex flex-col md:w-[60%] rounded-lg p-4 gap-5 mx-auto w-[95%]">
        <h1 className="text-dark font-bold text-xl">Offer History</h1>
        {loading ? (
          <div className="">
            <Spinner light={false} />
          </div>
        ) : offers.length === 0 ? (
          <div className="flex justify-center items-center">
            <p className="text-dark/40 font-medium text-center">No offers yet</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr className="text-dark">
                <th className="text-left px-2 py-1">Post</th>
                <th className="text-center px-2 py-1">Offer Date</th>
                <th className="px-2 text-center py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer: any, index: any) => (
                <tr onClick={()=>{
                    setExpandPost(offer.post.id)
                }} key={index} className="text-black/90 cursor-pointer hover:bg-dark/5 transition-all duration-300 border-t border-b last:border-b-0 border-dark/20 even:bg-dark/2">
                  <td className="font-medium text-dark px-2 py-4">
                    {offer.post.title}
                  </td>
                  <td className="text-dark text-center px-2 py-4">
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "short",
                    }).format(new Date(offer.createdAt))}
                  </td>
                  <td
                    onClick={() => {
                      setExpandPost(offer.post.id);
                    }}
                    className="text-dark px-2 py-1 text-center"
                  >
                    <button className="text-white bg-dark py-1 px-2 rounded font-medium border border-dark hover:text-dark hover:bg-white transition-all cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
