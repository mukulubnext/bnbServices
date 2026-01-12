import { LiquidGlassCard } from "@/components/LiquidGlass";
import { EllipsisVertical, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {
  isActive: boolean;
}

const EllipsisComp: NextPage<Props> = ({ isActive }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
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
      onClick={toggleMenu}
      className="text-dark relative cursor-pointer md:hidden"
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
          <button className="w-full z-30 flex gap-2 items-center text-left px-4 py-2 hover:bg-dark/10">
            <Pencil size={16} /> Edit
          </button>
          {isActive ? (
            <button className="w-full z-30 flex gap-2 items-center text-left px-4 py-2 hover:bg-dark/10">
              <EyeOff size={16} /> Hide Post
            </button>
          ) : (
              <button className="w-full z-30 flex gap-2 items-center text-left px-4 py-2 hover:bg-dark/10">
                <Eye size={16} /> Unhide Post
              </button>
          )}
          <button className="w-full z-30 flex gap-2 text-red-500 items-center text-left px-4 py-2 hover:bg-dark/10">
            <Trash2 size={16} /> Delete
          </button>
        </LiquidGlassCard>
      )}
    </div>
  );
};

export default EllipsisComp;
