import { NextPage } from "next";
import logo from "@/../public/Green.png"
import Image from "next/image";

interface Props {}

const Footer: NextPage<Props> = ({}) => {
  return (
    <footer className="py-8 md:py-5 bg-dark border-t border-white/5 text-center flex flex-col justify-center items-center">
      <div className="flex justify-center items-center gap-1">
        <Image className="md:w-24 md:h-24 w-14 h-14" src={logo} alt="logo" />
        <h1 className="font-bold text-highlight text-xl md:text-3xl">
          Boxes n Bottles
        </h1>
      </div>
      <p className="text-xs text-muted">
        © 2026 Boxes n Bottles. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
