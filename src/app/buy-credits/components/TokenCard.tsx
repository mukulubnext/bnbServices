import { Coins, IndianRupee } from "lucide-react";
import { NextPage } from "next";
import React from "react";

interface Props {
  price: number;
  credits: number;
  id: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  selected: number;
  setCustom: React.Dispatch<React.SetStateAction<number>>;
}

const TokenCard: NextPage<Props> = ({
  price,
  credits,
  id,
  setSelected,
  selected,
  setCustom,
}) => {
  const isSelected = selected === id;

  return (
    <div
      onClick={() => {
        setSelected(id);
        setCustom(0);
      }}
      className={`
        cursor-pointer select-none
        rounded-xl border transition-all duration-300
        flex flex-col items-center justify-between md:w-56 py-5 gap-4
        ${
          isSelected
            ? "bg-dark text-white border-dark shadow-xl shadow-dark/30 scale-[1.02]"
            : "bg-white text-dark border-dark/20 hover:bg-dark hover:text-white hover:shadow-lg hover:scale-[1.02]"
        }
      `}
    >
      {/* Credits */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`
            p-3 rounded-full transition-colors
            ${isSelected ? "bg-white/15" : "bg-dark/5 group-hover:bg-white/15"}
          `}
        >
          <Coins size={22} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {credits}
        </h1>
        <p className="text-xs opacity-70 uppercase tracking-wide">
          Credits
        </p>
      </div>

      {/* Divider */}
      <div
        className={`w-full h-px transition-colors ${
          isSelected ? "bg-white/30" : "bg-dark/20 group-hover:bg-white/30"
        }`}
      />

      {/* Price */}
      <div className="flex items-center gap-1 text-lg font-bold">
        <IndianRupee size={16} />
        {price}
      </div>
    </div>
  );
};

export default TokenCard;
