"use client";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {}

const Navbar: NextPage<Props> = ({}) => {
  const [isScrolled, setScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navlinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Solutions", path: "/solutions" },
    { name: "Products", path: "/products" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-screen z-100 fixed flex justify-between px-6 md:justify-around items-center transition-all duration-300 top-0 left-0 py-4 text-light ${
        isScrolled || isMenuOpen
          ? "bg-dark shadow-2xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <Link
        href={"/"}
        className="flex justify-center group items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg bg-light text-dark">
          <span className="font-bold text-xl">S</span>
        </div>
        <span className="text-xl font-bold tracking-tight">SOLARIS</span>
      </Link>
      <div className={`hidden md:flex justify-center items-center gap-8`}>
        {navlinks.map((d, i) => (
          <NavLink key={i} name={d.name} path={d.path} />
        ))}
      </div>
      <div className="hidden md:flex justify-center items-center gap-4">
        <button className="p-2 hover:bg-highlight/10 transition-all duration-300 rounded-full ">
          <Search size={20} />
        </button>
        <Link
          className="flex px-6 py-2.5 rounded-full text-sm bg-light text-dark font-bold transition-all transform hover:-translate-y-0.5 duration-300 shadow-md"
          href={"/register"}
        >
          Register
        </Link>
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
        <div className="flex flex-col pb-4 gap-4 px-6">
          <Link
            href={"/register"}
            onClick={() => setMenuOpen(false)}
            className="w-full py-3 text-center bg-light text-dark font-bold rounded-xl"
          >
            Register Now
          </Link>
        </div>
      </div>
    </nav>
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
