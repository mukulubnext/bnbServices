import { NextPage } from "next";
import N from "@/../public/N.png"
import Image from "next/image";

interface Props {}

const Footer: NextPage<Props> = ({}) => {
  return (
    <footer className="py-8 md:py-5 bg-dark border-t border-white/5 flex-col text-center flex justify-center items-center">
      <h1 className="text-light flex gap-1 justify-center items-center md:text-2xl font-bold">
        Boxes <span><Image className="md:w-10 md:h-10 w-8 h-8" src={N} alt="n" /></span> Bottles
      </h1>
      <p className="text-xs text-muted">
        © 2026 Boxes n Bottles. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
