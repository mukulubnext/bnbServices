"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import { NextPage } from "next";
import TokenCard from "./components/TokenCard";
import { useState } from "react";
import { Coins } from "lucide-react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [selected, setSelected] = useState<number>(0);
  const [custom, setCustom] = useState<number>(0);
  return (
    <div className="bg-light w-screen py-[10vh] h-screen">
      <Navbar solid={true} />
      <LiquidGlassMenu />
      <div className="bg-white gap-4 mx-auto w-[96%] px-[2%] py-6 flex flex-col rounded-lg min-h-full">
        <h1 className="font-bold text-dark text-xl">Buy Credits</h1>
        <div className="grid grid-cols-2 w-fit mx-auto lg:w-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6">
          <TokenCard
            selected={selected}
            setSelected={setSelected}
            id={1}
            price={250}
            credits={200}
          />
          <TokenCard
            selected={selected}
            setSelected={setSelected}
            id={2}
            price={500}
            credits={500}
          />
          <TokenCard
            selected={selected}
            setSelected={setSelected}
            id={3}
            price={1000}
            credits={1150}
          />
          <TokenCard
            selected={selected}
            setSelected={setSelected}
            id={4}
            price={2000}
            credits={2500}
          />
          <TokenCard
            selected={selected}
            setSelected={setSelected}
            id={5}
            price={4000}
            credits={6000}
          />
          <TokenCard
            selected={selected}
            setSelected={setSelected}
            id={6}
            price={5000}
            credits={8000}
          />
        </div>
        <div className="w-10 h-10 mx-auto md:mx-0 bg-white border-2 text-dark font-bold text-center flex justify-center items-center rounded-full">
          or
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-dark text-xl">Custom Credits Value: </h1>
          <div className="flex gap-1 justify-start relative items-center">
            <Coins className="text-dark left-2 absolute"/>
            <input inputMode="numeric" placeholder="Enter credits" onFocus={()=> {setSelected(0)}} value={custom === 0 ? undefined : custom} onChange={(e)=> setCustom(Number(e.target.value))} type="number" min={200} className='border focus:outline-0 w-full md:w-auto p-3 pl-10 rounded border-dark' />
          </div>
        </div>
        <div className="border-t-2 text-dark flex flex-col py-2 md:py-6 gap-2 border-dark">
            <p>Credits: {}</p>
            <p>Price: {}</p>
            <button className="bg-dark mx-auto w-full text-white hover:bg-white hover:text-dark border transition-all duration-300 font-bold py-2 px-5 md:w-100 rounded-md">Buy</button>
        </div>
      </div>
    </div>
  );
};

export default Page;
