import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import bg from "../../public/bg.png";
import AuthCheck from "@/components/AuthCheck";
import CountUp from "@/components/CountUp";

export const metadata = {
  title: "Boxes n Bottles | Trusted Packaging Marketplace",
  description:
    "Connect with verified packaging buyers and sellers. Discover reliable partners, post requirements, and close deals with confidence.",
  keywords: [
    "packaging marketplace",
    "packaging buyers",
    "packaging sellers",
    "B2B packaging platform",
    "boxes bottles packaging",
  ],
  openGraph: {
    title: "Boxes n Bottles | Trusted Packaging Marketplace",
    description:
      "A trusted B2B platform connecting packaging buyers and sellers worldwide.",
    images: ["/bg.png"],
    type: "website",
  },
  metadataBase: new URL("https://www.boxesnbottles.com"),
};

export default async function Home() {
  return (
    <>
      <AuthCheck />
      <Navbar />
      <section className="relative bg-dark h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src={bg}
            alt="Packaging marketplace background"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-dark via-dark/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl not-md:text-center font-extrabold text-highlight leading-tight mb-6">
              Where Packaging Meets the Right Partner
            </h1>
            <p className="text-xl text-muted not-md:text-center max-w-lg mb-10">
              Connect with verified buyers and sellers across the packaging
              ecosystem—built for speed, trust, and real business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-full not-md:text-center bg-highlight text-dark font-bold text-lg hover:scale-105 hover:shadow-xl transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 rounded-full not-md:text-center border border-white/20 text-muted font-bold text-lg hover:bg-white/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-light md:px-[15%]">
        <div className="px-6">
          <h2 className="text-3xl font-extrabold text-dark mb-2">
            Who We Serve
          </h2>
          <p className="text-dark/70 mb-12 max-w-xl">
            Designed for serious buyers and sellers across the packaging
            industry.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Buyers",
                desc: "Procurement managers, brands, distributors, and retailers sourcing packaging partners.",
                points: [
                  "Post requirements",
                  "Connect with verified sellers",
                  "Compare and negotiate deals",
                ],
              },
              {
                title: "Sellers",
                desc: "Manufacturers and traders showcasing catalogs to qualified buyers.",
                points: [
                  "Discover buyer requirements",
                  "Reach relevant leads",
                  "Close faster deals",
                ],
              },
              {
                title: "Categories",
                desc: "Wide range of packaging categories across industries.",
                points: [
                  "Bottles & Containers",
                  "Boxes & Cartons",
                  "Pouches & Flexible Packaging",
                ],
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/90 border-black/10 backdrop-blur p-6 rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <h3 className="font-semibold text-dark text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-dark/70 mb-4">{item.desc}</p>
                <ul className="text-sm text-dark/70 space-y-1">
                  {item.points.map((p) => (
                    <li key={p}>→ {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-linear-to-b from-dark to-dark/90 md:px-[15%]">
        <div className="px-6">
          <h2 className="text-3xl font-extrabold text-highlight mb-2">
            Authenticity & Trust
          </h2>
          <p className="text-light/70 mb-12 max-w-2xl">
            Built to eliminate fake leads and help real businesses transact with
            confidence.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Verified Profiles",
                desc: "GST, PAN, address, and contact details verified where provided.",
              },
              {
                title: "Transparent Reviews",
                desc: "Ratings from completed transactions help assess reliability.",
              },
              {
                title: "Quality Connections",
                desc: "No spam—only relevant buyers and sellers connect.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/95 p-6 rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                <h3 className="font-semibold text-dark text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-dark/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-light md:px-[15%]">
        <div className="px-6">
          <h2 className="text-3xl font-extrabold text-dark mb-2">
            How It Works
          </h2>
          <p className="text-dark/70 mb-12 max-w-xl">
            Simple, transparent, and designed for speed.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Register & Create Profile",
                desc: "Sign up and create your business profile.",
              },
              {
                step: "2",
                title: "Verification",
                desc: "We verify business information where available.",
              },
              {
                step: "3",
                title: "Post & Connect",
                desc: "Buyers post requirements. Sellers connect and deal.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-dark/90 backdrop-blur p-8 rounded-xl border border-white/10 hover:bg-dark transition-all"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-highlight text-dark font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-light mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-light/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-6 bg-light md:px-[15%]">
        <div className="px-6">
          <div
            className="grid md:grid-cols-2 gap-12 items-center 
                    rounded-3xl bg-white/60 backdrop-blur 
                    p-10 shadow-sm border border-dark/10"
          >
            {/* Left */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark">
                Trusted by buyers & sellers
              </h2>
              <p className="mt-3 text-dark/60 max-w-md">
                Real users. Real transactions. A growing marketplace built on
                trust.
              </p>
            </div>

            {/* Right */}
            <div className="flex items-end gap-3 md:justify-end">
              <span className="text-6xl text-dark font-extrabold text-primary tracking-tight">
                <CountUp from={0} to={400} duration={1.6} />+
              </span>
              <span className="mb-2 text-sm text-dark/60">active users</span>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-light md:px-[15%]">
        <div className="px-6">
          <div className="rounded-2xl bg-linear-to-r from-dark via-dark/90 to-dark p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl not-md:text-center md:text-3xl font-extrabold text-light">
                Ready to trade with confidence?
              </h2>
              <p className="text-light/70 not-md:text-sm not-md:text-center mt-2">
                Join a trusted network of verified packaging businesses.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-full bg-highlight text-dark font-bold text-xs md:text-lg text-nowrap flex justify-center items-center hover:scale-110 transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-full border border-white/20 text-light font-bold text-xs text-nowrap flex justify-center items-center md:text-lg hover:bg-white/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
