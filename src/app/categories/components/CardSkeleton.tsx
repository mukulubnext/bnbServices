import { LiquidGlassCard } from "@/components/LiquidGlass";
import { NextPage } from "next";

interface Props {}

const CardSkeleton: NextPage<Props> = ({}) => {
  return (
    <>
      <div className="w-full h-full p-5 rounded-xl border border-dark/10 bg-white">
        <div className="skeleton h-5 w-2/3 rounded-md mb-4" />

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
    </>
  );
};

export default CardSkeleton;
