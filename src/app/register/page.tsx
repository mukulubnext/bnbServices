import Navbar from "@/components/Navbar";
import { ChevronRight, ShoppingBag, Store } from "lucide-react";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <>
      <section className="relative flex bg-dark items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 grayscale">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=2074"
            className="w-full h-full object-cover"
            alt="Register Background"
          />
        </div>
        <div className="relative my-40 md:pt-0 z-10 max-w-5xl mx-auto px-6 w-full text-center">
          <h2 className="text-4xl text-light md:text-6xl font-bold mb-4">
            Choose Your Role
          </h2>
          <p className="text-lg text-muted md:text-xl mb-12 max-w-2xl mx-auto">
            Select how you would like to participate in the Solaris network.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
              className="group relative overflow-hidden border p-10 rounded-[2.5rem] transition-all duration-500 text-left"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <div className="mb-6 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform bg-highlight/22">
                <Store className="text-highlight" size={32} />
              </div>
              <h3 className="text-2xl text-light font-bold mb-3">
                Join as a Seller
              </h3>
              <p className="mb-6 text-sm text-muted leading-relaxed">
                Manage inventory, reach millions, and scale your storefront
                globally.
              </p>
              <div className="inline-flex text-highlight items-center gap-2 font-bold">
                Start Selling{" "}
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
            <button
              className="group relative overflow-hidden border p-10 rounded-[2.5rem] transition-all duration-500 text-left"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <div className="mb-6 w-16 h-16 rounded-2xl bg-highlight/22 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="text-highlight" size={32} />
              </div>
              <h3 className="text-2xl text-light font-bold mb-3">
                Join as a Buyer
              </h3>
              <p className="mb-6 text-muted text-sm leading-relaxed">
                Browse tools, manage subscriptions, and enjoy exclusive
                marketplace benefits.
              </p>
              <div className="inline-flex text-highlight items-center gap-2 font-bold">
                Start Shopping{" "}
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
