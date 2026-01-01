import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <>
      <Navbar />
      <section className="relative min-h-screen pt-24 pb-20 flex items-center justify-center overflow-hidden bg-dark">
        <div className="absolute inset-0 z-0 opacity-10 grayscale">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2074"
            className="w-full h-full object-cover"
            alt="Contact Background"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-light">
              Get in Touch
            </h2>
            <p className="text-lg max-w-xl mx-auto text-muted">
              Whether you need technical support or have a business inquiry, our
              team is ready to assist you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="backdrop-blur-xl border p-8 rounded-3xl transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-2xl text-highlight font-bold mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-highlight/22 rounded-full flex items-center justify-center">
                  <Globe size={20} />
                </span>
                Technical Help
              </h3>
              <p className="mb-8 leading-relaxed text-muted">
                Experiencing issues with our platform? Our engineering support
                team is available 24/7 for critical incidents.
              </p>
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:support@solaris.io"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5"
                >
                  <Mail className="text-highlight" />
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-muted">
                      Email Support
                    </p>
                    <p className="font-medium text-light">support@solaris.io</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/1234567890"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5"
                >
                  <MessageCircle className="text-highlight" />
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-muted">
                      WhatsApp Chat
                    </p>
                    <p className="font-medium text-light">Start Conversation</p>
                  </div>
                </a>
              </div>
            </div>
            <div
              className="backdrop-blur-xl border p-8 rounded-3xl transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-2xl text-highlight font-bold mb-4 flex items-center gap-3">
                <span className="w-10 bg-highlight/22 h-10 rounded-full flex items-center justify-center">
                  <ExternalLink size={20} />
                </span>
                Business & Sales
              </h3>
              <p className="mb-8 leading-relaxed text-muted">
                Interested in enterprise plans? Connect with our executives to
                find the perfect solution for you.
              </p>
              <div className="flex flex-col gap-4">
                <a
                  href="tel:+15550001234"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5"
                >
                  <Phone className="text-highlight" />
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-muted">
                      Call Our Sales Team
                    </p>
                    <p className="font-medium text-light">+1 (555) 000-1234</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 rounded-2xl">
                  <MapPin className="text-highlight shrink-0" />
                  <div>
                    <p className="text-xs uppercase text-muted font-bold tracking-wider">
                      Headquarters
                    </p>
                    <p className="font-medium text-light">
                      123 Innovation Drive, Silicon Valley, CA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button className="inline-flex hover:shadow-2xl duration-300 bg-light text-dark items-center gap-2 px-8 py-4 rounded-full font-bold shadow-xl transition-all">
              <MapPin size={18} />
              Open in Google Maps
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
