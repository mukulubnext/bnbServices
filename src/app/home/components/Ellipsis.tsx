import { LiquidGlassCard } from "@/components/LiquidGlass";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { CheckCircle, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  postId: number;
  setDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletePostId: React.Dispatch<React.SetStateAction<number>>;
  deletePostTitle: string;
  setDeletePostTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditPost: React.Dispatch<React.SetStateAction<number | null | undefined>>;
  setExpandPost: React.Dispatch<
    React.SetStateAction<number | null | undefined>
  >;
  isFullfilled: boolean;
}

const EllipsisComp: NextPage<Props> = ({
  postId,
  setDeletePost,
  setDeletePostId,
  setDeletePostTitle,
  deletePostTitle,
  setEditPost,
  setExpandPost,
  isFullfilled,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [fulfilled, setIsFullfilled] = useState(isFullfilled);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    window.addEventListener("ellipsis-opened", closeMenu);
    return () => window.removeEventListener("ellipsis-opened", closeMenu);
  }, []);
  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const toggleMenu = () => {
    if (!isOpen) {
      window.dispatchEvent(new Event("ellipsis-opened"));
    }
    setIsOpen((x) => !x);
  };
  const handlePostFulfill = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/post/fulfill", {
        postId: postId,
      });
      if (res.data.status === "success") {
        toast.success("Post fulfilled successfully!");
        setIsFullfilled(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={menuRef}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        toggleMenu();
      }}
      className="text-dark hover:bg-dark/10 transition-all duration-300 p-1 rounded-full relative cursor-pointer"
    >
      <ToastContainer />
      <EllipsisVertical
        className={`${isOpen && "-rotate-90"} transition-all`}
      />
      {isOpen && (
        <LiquidGlassCard
          blurIntensity="sm"
          glowIntensity="sm"
          shadowIntensity="sm"
          draggable={false}
          borderRadius="6px"
          className="absolute z-10 text-sm top-6 right-0 border border-dark/20 rounded-md shadow-lg w-32 py-2 flex flex-col"
        >
          <button
            onClick={() => {
              setEditPost(postId);
              setExpandPost(postId);
            }}
            className="w-full z-30 flex gap-2 items-center text-left px-4 py-2 hover:bg-dark/10"
          >
            <Pencil size={16} /> Edit
          </button>
          {!fulfilled &&
            (!isLoading ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePostFulfill();
                }}
                className="w-full z-30 flex gap-2 items-center text-left px-4 py-2 hover:bg-dark/10"
              >
                <CheckCircle size={16} /> Fulfilled
              </button>
            ) : (
              <button className="flex justify-center items-center p-1">
                <Spinner light={false} />
              </button>
            ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeletePostId(postId);
              setDeletePostTitle(deletePostTitle);
              setDeletePost(true);
            }}
            className="w-full z-30 flex gap-2 text-red-500 items-center text-left px-4 py-2 hover:bg-dark/10"
          >
            <Trash2 size={16} /> Delete
          </button>
        </LiquidGlassCard>
      )}
    </div>
  );
};

export default EllipsisComp;
