import { LiquidGlassCard } from "@/components/LiquidGlass";
import axios from "axios";
import { EllipsisVertical, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  isActive: boolean;
  postId: number;
  setDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletePostId: React.Dispatch<React.SetStateAction<number>>;
  deletePostTitle: string;
  setDeletePostTitle: React.Dispatch<React.SetStateAction<string>>;
  setHidePost: React.Dispatch<React.SetStateAction<boolean>>;
  setHidePostId: React.Dispatch<React.SetStateAction<number>>;
  hidePostTitle: string;
  setHidePostTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const EllipsisComp: NextPage<Props> = ({ isActive, postId, setDeletePost, setDeletePostId, setDeletePostTitle, deletePostTitle, setHidePostId, setHidePostTitle, hidePostTitle, setHidePost, setIsActive }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    window.addEventListener("ellipsis-opened", closeMenu);
    return () => window.removeEventListener("ellipsis-opened", closeMenu);
  }, []);

  const toggleMenu = () => {
    if (!isOpen) {
      window.dispatchEvent(new Event("ellipsis-opened"));
    }
    setIsOpen((x) => !x);
  };

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e)=>{
        e.stopPropagation();
        toggleMenu()
      }}
      className="text-dark hover:bg-dark/10 transition-all duration-300 p-1 rounded-full relative cursor-pointer"
    >
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
          <button onClick={()=>{
            router.push(`/post/${postId}/?edit=true`);
          }} className="w-full z-30 flex gap-2 items-center text-left px-4 py-2 hover:bg-dark/10">
            <Pencil size={16} /> Edit
          </button>
          {isActive ? (
            <button onClick={(e)=>{
            e.stopPropagation()
            setHidePostId(postId)
            setHidePostTitle(hidePostTitle)
            setHidePost(true)
            setIsActive(isActive)
          }} className="w-full z-30 flex gap-2 items-center text-left px-4 py-2 hover:bg-dark/10">
              <EyeOff size={16} /> Hide Post
            </button>
          ) : (
            <button onClick={(e)=>{
              e.stopPropagation()
              setHidePostId(postId)
              setHidePostTitle(hidePostTitle)
              setHidePost(true)
              setIsActive(isActive)
          }}  className="w-full z-30 flex gap-2 text-xs items-center text-left px-4 py-2 hover:bg-dark/10">
                <Eye size={16} /> Unhide Post
              </button>
          )}
          <button 
          onClick={(e)=>{
            e.stopPropagation()
            setDeletePostId(postId)
            setDeletePostTitle(deletePostTitle)
            setDeletePost(true)
          }} className="w-full z-30 flex gap-2 text-red-500 items-center text-left px-4 py-2 hover:bg-dark/10">
            <Trash2 size={16} /> Delete
          </button>
        </LiquidGlassCard>
      )}
    </div>
  );
};

export default EllipsisComp;
