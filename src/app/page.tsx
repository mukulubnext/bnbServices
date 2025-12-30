import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-dark h-[90vh] flex relative justify-center items-center overflow-hidden">
      <div className="z-0 inset-0 absolute overflow-hidden opacity-40">
        <img
          className="object-cover w-full h-full grayscale"
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070"
          alt=""
        />
        <div className="w-full h-full bg-linear-to-r from-dark to-transparent absolute inset-0"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-6 text-center md:text-left w-full">
        <div className="max-w-2xl">
          <span className="inline-block px-4 bg-highlight/22 border-highlight text-highlight py-1.5 mb-6 text-sm font-bold tracking-widest uppercase rounded-full border">
            Solaris Evolution
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-highlight">
            Building the <br />
            <span className="text-highlight">digital horizon.</span>
          </h1>
          <p className="text-xl mb-10 max-w-lg leading-relaxed text-muted">
            Connect with a global ecosystem of buyers and sellers using our
            high-performance cloud infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 rounded-full font-bold text-lg text-dark bg-light duration-300 hover:shadow-xl transition-all">
              Get Started
            </button>
            <button className="px-8 py-4 bg-white/5 border-muted text-muted border rounded-full font-bold text-lg hover:bg-white/10 duration-300 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
