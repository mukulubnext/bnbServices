import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Info } from "lucide-react";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <>
      <Navbar />
      <section className="relative h-screen flex bg-dark items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069"
            className="w-full h-full object-cover grayscale opacity-20"
            alt="About Background"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="p-4 rounded-full border shadow-inner bg-highlight/11 border-highlight">
              <Info className="text-highlight" size={40} />
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-light">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-muted">
            Our mission is to transform the way packaging businesses connect
            and trade by creating an exclusive, trusted platform for buyers and
            sellers of packaging materials and products. We aim to simplify
            sourcing and selling through transparency, reliability, and
            meaningful business connections, enabling partners to grow faster,
            trade smarter, and build long-term value in the packaging ecosystem.
          </p>
          <div className="mt-12 h-1 w-24 mx-auto rounded-full text-highlight"></div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
