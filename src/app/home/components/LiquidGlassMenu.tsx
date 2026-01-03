import { LiquidGlassCard } from "@/components/LiquidGlass";
import { House, Phone, Plus, User } from "lucide-react";
import Link from "next/link";


export default function LiquidGlassMenu() {
   return ( 
   <LiquidGlassCard shadowIntensity="lg" glowIntensity="lg" blurIntensity="xs" className="flex fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-fit rounded-xl">
        <div className="flex gap-px px-1 rounded-3xl ">
          <LiquidGlassCard blurIntensity="sm" draggable={false} glowIntensity="lg" shadowIntensity="md" className="w-16 cursor-pointer h-16 rounded-full  ">
            <Link href={"/home"} className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full ">
              <House className="w-8 h-8" />
              <span className="sr-only">Home</span>
            </Link>
          </LiquidGlassCard>
          <div className="w-16 h-16 rounded-full  ">
            <Link href={"/post"} className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full ">
              <Plus className="w-8 h-8" />
              <span className="sr-only">Post</span>
            </Link>
          </div>
          <div className="w-16 h-16 rounded-full  ">
            <Link href={"/profile"} className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full ">
              <User className="w-8 h-8" />
              <span className="sr-only">Profile</span>
            </Link>
          </div>
          <div className="w-16 h-16 rounded-full  ">
            <Link href={"/contact"} className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full ">
              <Phone className="w-7 h-7" />
              <span className="sr-only">Contact</span>
            </Link>
          </div>
        </div>
      </LiquidGlassCard>
    );
    }   