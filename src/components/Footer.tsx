import { NextPage } from "next";

interface Props {}

const Footer: NextPage<Props> = ({}) => {
  return (
    <footer className="py-12 bg-dark border-t border-white/5 text-center flex justify-center items-center">
      <p className="text-xs text-muted">
        © 2024 Solaris Network Inc. Defined by Deep Green and Light Tones.
      </p>
    </footer>
  );
};

export default Footer;
