import { Building2, History, Tags, User, UserCircle2 } from "lucide-react";
import React, { useState } from "react";

interface SideBarProps{
    selected : number,
    setSelected : React.Dispatch<React.SetStateAction<number>>
}

export default function Sidebar({selected, setSelected}: SideBarProps)
{
    return (
        <div className="h-screen flex flex-col fixed top-0 left-0 gap-6 md:gap-0 md:w-50 lg:w-75 pt-[10vh] bg-white border-r border-dark">
            <div className="flex justify-center items-center flex-col px-4">
                <UserCircle2 className="w-10 h-10 mx-auto text-dark/70"/>
                <p className="font-bold hidden md:block text-dark text-lg">Profile</p>
            </div>
            <hr className="text-dark my-2"/>
            <div className={`px-[10%] cursor-pointer flex-col flex md:flex-row py-2 lg:gap-2 transition-all duration-300 items-center lg:py-6 text-dark  ${selected===0?'bg-dark/90 text-white':'hover:bg-dark/20'}`} onClick={()=>setSelected(0)}>
                <User/>
                <p className="hidden md:block">
                    Account Details
                </p>
            </div>
            <div className={`px-[10%] cursor-pointer flex-col flex md:flex-row py-2 lg:gap-2 transition-all duration-300 items-center lg:py-6 text-dark  ${selected===1?'bg-dark/90 text-white':'hover:bg-dark/20'}`} onClick={()=>setSelected(1)}>
                <Building2/>
                <p className="hidden md:block">
                    Company Details
                </p>
            </div>
            <div className={`px-[10%] cursor-pointer flex-col flex md:flex-row py-2 lg:gap-2 transition-all duration-300 items-center lg:py-6 text-dark  ${selected===2?'bg-dark/90 text-white':'hover:bg-dark/20'}`} onClick={()=>setSelected(2)}>
                <Tags/>
                <p className="hidden md:block">
                    Manage Categories
                </p>
            </div>
            <div className={`px-[10%] cursor-pointer flex-col flex md:flex-row py-2 lg:gap-2 transition-all duration-300 items-center lg:py-6 text-dark  ${selected===3?'bg-dark/90 text-white':'hover:bg-dark/20'}`} onClick={()=>setSelected(3)}>
                <History/>
                <p className="hidden md:block">
                    Transaction History
                </p>
            </div>
        </div>
    )
}