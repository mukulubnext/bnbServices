import { LiquidGlassCard } from "@/components/LiquidGlass";
import { House, Phone, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LiquidGlassMenu() {
  return (
    <LiquidGlassCard
      shadowIntensity="lg"
      glowIntensity="lg"
      blurIntensity="xs"
      className="flex fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-fit rounded-xl"
    >
      <div className="flex gap-px px-1 rounded-3xl ">
        {usePathname() === "/home" ? (
          <LiquidGlassCard
            blurIntensity="sm"
            draggable={false}
            glowIntensity="lg"
            shadowIntensity="md"
            className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full  "
          >
            <Link
              href={"/home"}
              className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
            >
              <House className="w-6 h-6 md:w-8 md:h-8 hover:scale-105" />
              <span className="sr-only">Home</span>
            </Link>
          </LiquidGlassCard>
        ) : (
          <div className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full  ">
            <Link
              href={"/home"}
              className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
            >
              <House className="w-6 h-6 md:w-8 md:h-8 hover:scale-105" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        )}
        {usePathname() === "/post" ? (
          <LiquidGlassCard
            blurIntensity="sm"
            draggable={false}
            glowIntensity="lg"
            shadowIntensity="md"
            className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full"
          >
            <Link
              href={"/post"}
              className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
            >
              <Plus className="w-6 h-6 md:w-8 md:h-8 hover:scale-105" />
              <span className="sr-only">Post</span>
            </Link>
          </LiquidGlassCard>
        ) : (
          <div className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full  ">
            <Link
              href={"/post"}
              className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
            >
              <Plus className="w-6 h-6 md:w-8 md:h-8 hover:scale-105" />
              <span className="sr-only">Post</span>
            </Link>
          </div>
        )}
        {usePathname() === "/profile" ? (
          <LiquidGlassCard
            blurIntensity="sm"
            draggable={false}
            glowIntensity="lg"
            shadowIntensity="md"
            className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full  "
          >
            <Link
              href={"/profile"}
              className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
            >
              <User className="w-6 h-6 md:w-8 md:h-8 hover:scale-105" />
              <span className="sr-only">Profile</span>
            </Link>
          </LiquidGlassCard>
        ) : (
          <div className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full  ">
            <Link
              href={"/profile"}
              className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
            >
              <User className="w-6 h-6 md:w-8 md:h-8 hover:scale-105" />
              <span className="sr-only">Profile</span>
            </Link>
          </div>
        )}
        {usePathname() === "/contact" ? (
          <LiquidGlassCard
            blurIntensity="sm"
            draggable={false}
            glowIntensity="lg"
            shadowIntensity="md"
            className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full  "
          >
            <Link
              href={"/contact"}
              className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
            >
              <Phone className="w-5 h-5 md:w-7 md:h-7 hover:scale-105" />
              <span className="sr-only">Contact</span>
            </Link>
          </LiquidGlassCard>
        ) : (
          <div className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full  ">
            <Link
              href={"/contact"}
              className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
            >
              <Phone className="w-5 h-5 md:w-7 md:h-7 hover:scale-105" />
              <span className="sr-only">Contact</span>
            </Link>
          </div>
        )}
      </div>
    </LiquidGlassCard>
  );
}
