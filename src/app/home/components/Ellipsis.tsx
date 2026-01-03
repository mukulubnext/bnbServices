import { LiquidGlassCard } from "@/components/LiquidGlass";
import { EllipsisVertical } from "lucide-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {}

const EllipsisComp: NextPage<Props> = ({}) => {
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
          className="absolute z-10 top-6 right-0 border border-dark/20 rounded-md shadow-lg w-32 py-2 flex flex-col"
        >
          <button className="w-full z-30 text-left px-4 py-2 hover:bg-dark/10">
            Option 1
          </button>
          <button className="w-full z-30 text-left px-4 py-2 hover:bg-dark/10">
            Option 2
          </button>
          <button className="w-full z-30 text-left px-4 py-2 hover:bg-dark/10">
            Option 3
          </button>
          <button className="w-full z-30 text-left px-4 py-2 hover:bg-dark/10">
            Option 4
          </button>
        </LiquidGlassCard>
      )}
    </div>
  );
};

export default EllipsisComp;
