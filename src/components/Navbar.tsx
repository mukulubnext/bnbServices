"use client";
import { ChevronRight, Coins, Menu, Search, Wallet, X } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useAuth } from "@/context/AuthContext";
import N from "../../public/N.png";
import Image from "next/image";
import Banner from "./Banner";

interface Props {
  solid?: boolean;
  userProp?: any;
}

const Navbar: NextPage<Props> = ({ solid, userProp }: Props) => {
  const [isScrolled, setScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const navlinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  useEffect(() => {
    if (solid) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <nav
      className={`w-screen z-100 fixed flex justify-between px-6 md:justify-around items-center transition-all duration-300 top-0 left-0 py-4 text-light ${
        isScrolled || isMenuOpen
          ? "bg-dark border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <Link
        href={user ? "/home" : "/"}
        className="flex justify-center group items-center gap-2 cursor-pointer"
      >
        <h1 className="text-light flex gap-1 justify-center items-center md:text-2xl font-bold">
          Boxes{" "}
          <span>
            <Image
              className="md:w-10 md:h-10 w-8 h-8 rounded"
              src={N}
              alt="n"
            />
          </span>{" "}
          Bottles
        </h1>
      </Link>
      <div className={`hidden md:flex justify-center items-center gap-8`}>
        {navlinks.map((d, i) => (
          <NavLink key={i} name={d.name} path={d.path} />
        ))}
      </div>
      <div className="hidden md:flex justify-center items-center gap-4 h-full">
        {!loading && user && user.role === "seller" && (
          <Link
            href="/buy-credits"
            className="
    group relative flex items-center gap-3 px-4 py-1
    rounded-2xl
    bg-white/10 backdrop-blur-md
    border border-white/20
    text-light
    hover:bg-white/20
    transition-all duration-300
    shadow-lg hover:shadow-2xl
  "
          >
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
            <div className="relative p-2 rounded-xl bg-white/20 border border-white/30">
              <Wallet size={20} />
            </div>
            <div className="h-6 w-px bg-white/30" />
            <div className="relative flex items-center gap-1 font-semibold">
              <Coins size={18} />
              <span>{user?.credits}</span>
            </div>
          </Link>
        )}
        {!loading ? (
          !user ? (
            <>
              <Link
                className="flex px-6 py-2.5 rounded-full text-sm bg-light text-dark font-bold transition-all transform hover:-translate-y-0.5 duration-300 shadow-md"
                href={"/register"}
              >
                Register
              </Link>
              <Link
                className="flex px-6 py-2.5 rounded-full text-sm ring-2 ring-light text-light font-bold transition-all transform hover:-translate-y-0.5 duration-300 shadow-md"
                href={"/signin"}
              >
                Sign In
              </Link>
            </>
          ) : (
            <Link
              className="flex w-10 h-10 justify-center p-2.5 rounded-full text-sm bg-light text-dark font-bold transition-all transform hover:-translate-y-0.5 duration-300 shadow-md"
              href={"/profile"}
            >
              {user.email[0].toUpperCase()}
            </Link>
          )
        ) : (
          <Spinner light={true} />
        )}
      </div>
      <button className="md:hidden transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg flex justify-center items-center">
        <Menu
          onClick={() => setMenuOpen(true)}
          className={`${isMenuOpen && "hidden"}`}
          size={28}
        />
        <X
          onClick={() => setMenuOpen(false)}
          className={`${!isMenuOpen && "hidden"}`}
          size={28}
        />
      </button>
      <div
        className={`absolute top-full left-0 w-full shadow-2xl transition-all duration-300 ease-in-out md:hidden overflow-hidden ${
          isMenuOpen
            ? "max-h-150 bg-dark opacity-100 border-t border-white/5"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-6 p-6">
          {navlinks.map((d, i) => (
            <MenuLink
              key={i}
              name={d.name}
              path={d.path}
              click={() => setMenuOpen(false)}
            />
          ))}
        </div>
        <hr className="border-white/5 py-2" />
        <div className="flex justify-center items-center flex-col pb-4 gap-4 px-6">
          {!loading ? (
            !user ? (
              <>
                <Link
                  href={"/register"}
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 text-center bg-light text-dark font-bold rounded-xl"
                >
                  Register Now
                </Link>
                <Link
                  href={"/signin"}
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 text-center text-light ring-2 ring-light font-bold rounded-xl"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                {!loading && user && user.role === "seller" && (
                  <Link
                    href="/buy-credits"
                    className="
    group relative flex items-center gap-5 px-4 py-2
    rounded-2xl
    w-full
    justify-center
    bg-white/10 backdrop-blur-md
    border border-white/20
    text-light
    hover:bg-white/20
    transition-all duration-300
    shadow-lg hover:shadow-2xl
  "
                  >
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
                    <div className="flex items-center gap-2">
                      <div className="relative p-2 rounded-xl bg-white/20 border border-white/30">
                        <Wallet size={20} />
                      </div>
                      <div className="h-6 w-px bg-white/30" />
                    </div>
                    <div className="relative flex items-center gap-1 font-semibold">
                      <Coins size={18} />
                      <span>{user?.credits}</span>
                    </div>
                  </Link>
                )}
                <Link
                  href={"/profile"}
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 text-center bg-light text-dark font-bold rounded-xl"
                >
                  Profile
                </Link>
              </>
            )
          ) : (
            <Spinner light={true} />
          )}
        </div>
      </div>
    </nav>
    <Banner />
    </>
  );
};
interface Navitems {
  name: string;
  path: string;
  click?: () => void;
}
function NavLink({ name, path }: Navitems) {
  return (
    <Link
      className={`text-sm group font-medium transition-all relative ${
        usePathname() === `${path}` ? "text-highlight" : "text-muted"
      }`}
      href={path}
    >
      {name}
      <span
        className={`bg-light transition-all duration-300 h-0.5 absolute -bottom-1 left-0 ${
          usePathname() == path ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </Link>
  );
}
function MenuLink({ name, path, click }: Navitems) {
  return (
    <Link
      className={`text-lg text-left flex justify-between items-center group font-medium transition-all relative ${
        usePathname() === `${path}` ? "text-highlight" : "text-light"
      }`}
      href={path}
      onClick={click}
    >
      {name}
      <ChevronRight size={18} />
    </Link>
  );
}

export default Navbar;
