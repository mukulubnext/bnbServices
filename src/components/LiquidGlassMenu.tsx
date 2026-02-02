"use client";
import { LiquidGlassCard } from "@/components/LiquidGlass";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { History, House, Phone, Plus, ScrollTextIcon, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LiquidGlassMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const {user, loading} = useAuth();
  return (
    <LiquidGlassCard
      shadowIntensity="lg"
      glowIntensity="lg"
      blurIntensity="xs"
      className="flex fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-fit rounded-xl"
    >
      <div className="flex gap-px px-1 rounded-3xl ">
        {pathname === "/home" ? (
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
        {!loading && user && user.role === "buyer" ? (
          <>
            {pathname === "/post" ? (
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
          </>
        ) : !loading && user && user.role === "seller" ? (
          <>
            {pathname === "/offer-history" ? (
              <LiquidGlassCard
                blurIntensity="sm"
                draggable={false}
                glowIntensity="lg"
                shadowIntensity="md"
                className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full"
              >
                <Link
                  href={"/offer-history"}
                  className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
                >
                  <ScrollTextIcon className="w-6 h-6 md:w-8 md:h-8 hover:scale-105" />
                  <span className="sr-only">Offer History</span>
                </Link>
              </LiquidGlassCard>
            ) : (
              <div className="md:w-16 cursor-pointer md:h-16 w-12 h-12 rounded-full  ">
                <Link
                  href={"/offer-history"}
                  className="relative z-30 flex items-center justify-center text-dark text-2xl w-full h-full "
                >
                  <ScrollTextIcon className="w-6 h-6 md:w-8 md:h-8 hover:scale-105" />
                  <span className="sr-only">Offer History</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="md:w-16 cursor-pointer md:h-16 p-2 w-12 h-12 rounded-full  ">
            <div
              className="relative z-30 flex items-center bg-black/40 animate-pulse rounded-full  justify-center text-dark text-2xl w-full h-full "
            >
            </div>
          </div>
        )}
        {pathname === "/profile" ? (
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
        {pathname === "/contact" ? (
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
