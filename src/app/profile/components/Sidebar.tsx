import { Building2, History, Tags, User, UserCircle2, Wallet } from "lucide-react";
import React, { useState } from "react";

interface SideBarProps {
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  role: string;
  credits: number;
}

export default function Sidebar({ selected, setSelected, role, credits }: SideBarProps) {
  return (
    <div className="h-fit w-screen bg-white flex justify-between mt-8.75 md:pt-[15vh] md:flex-col md:w-fit md:h-screen md:fixed md:top-0 md:left-0 md:justify-start md:gap-0 md:border-right-2 border-y border-white md:border-dark">
      <div
        className={`w-full justify-start cursor-pointer flex-col flex md:flex-row py-4 lg:gap-2 transition-all duration-300 items-center md:px-10 lg:py-6 text-dark  ${selected === 0 ? "bg-dark/90 text-white" : "hover:bg-dark/20"}`}
        onClick={() => setSelected(0)}
      >
        <User />
        <p className="hidden sm:block text-nowrap sm:text-xs md:text-[16px]">
          Account Details
        </p>
      </div>
      <div
        className={`w-full justify-start cursor-pointer flex-col flex md:flex-row py-4 lg:gap-2 transition-all duration-300 items-center md:px-10 lg:py-6 text-dark  ${selected === 1 ? "bg-dark/90 text-white" : "hover:bg-dark/20"}`}
        onClick={() => setSelected(1)}
      >
        <Building2 />
        <p className="hidden sm:block text-nowrap sm:text-xs md:text-[16px]">
          Company Details
        </p>
      </div>
      <div
        className={`w-full justify-start cursor-pointer flex-col flex md:flex-row py-4 lg:gap-2 transition-all duration-300 items-center md:px-10 lg:py-6 text-dark  ${selected === 2 ? "bg-dark/90 text-white" : "hover:bg-dark/20"}`}
        onClick={() => setSelected(2)}
      >
        <Tags />
        <p className="hidden sm:block text-nowrap sm:text-xs md:text-[16px]">
          Manage Categories
        </p>
      </div>
      {role === "seller" && (
        <div
          className={`w-full justify-start cursor-pointer flex-col flex md:flex-row py-4 lg:gap-2 transition-all duration-300 items-center md:px-10 lg:py-6 text-dark  ${selected === 3 ? "bg-dark/90 text-white" : "hover:bg-dark/20"}`}
          onClick={() => setSelected(3)}
        >
            <Wallet />
          <p className="hidden sm:block text-nowrap sm:text-xs md:text-[16px]">
            Wallet: <span>{(credits).toLocaleString()} credits</span>
          </p>
        </div>
      )}
    </div>
  );
}
