import { Coins, IndianRupee } from 'lucide-react'
import { NextPage } from 'next'
import React from 'react';

interface Props {
    price: number;
    credits: number;
    id: number;
    setSelected: React.Dispatch<React.SetStateAction<number>>;
    selected: number;
    setCustom: React.Dispatch<React.SetStateAction<number>>;
}

const TokenCard: NextPage<Props> = ({price, credits, id, setSelected, selected, setCustom}) => {
  return <div onClick={()=>{
    setSelected(id);
    setCustom(0);
  }} className={`text-dark h-fit select-none rounded-md max-w-[90%] group relative border-2 flex w-50 md:min-w-75 transition-all duration-300 hover:text-white border-dark hover:bg-dark justify-center items-center flex-col gap-3 ${selected === id ? "bg-dark text-white hover:brightness-75" : "hover:bg-dark"}`}>
    <div className='flex w-full flex-col justify-center items-center pb-1 pt-3'>
        <Coins/> <h1 className='md:text-3xl text-lg font-medium'>{credits}</h1>
    </div>
    <div className={`w-full h-px bg-dark group-hover:bg-white transition-all duration-300 ${selected === id ? "bg-white" : "bg-dark/20"}`}></div>
    <div className='flex font-bold justify-center items-center pb-3'>
        <IndianRupee size={16} /> {price}
    </div>
  </div>
}

export default TokenCard