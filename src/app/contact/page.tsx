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
import Link from "next/link";
import Submit from "./components/Submit";

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
        <div className="relative z-10 max-w-6xl flex flex-col justify-center px-6 w-full">
          <div className="text-left mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-light">
              Get in Touch
            </h2>
            <p className="text-lg max-w-175 text-muted">
              Whether you need technical support or have a business inquiry, our
              team is ready to assist you.
            </p>
            <div className="flex gap-2 my-4 font-medium">
              <div className="text-sm border-white/20 border text-white bg-white/10 px-3 py-0.5 rounded-full">
                <p>Fast Response</p>
              </div>
              <div className="text-sm border-white/20 border text-white bg-white/10 px-3 py-0.5 rounded-full">
                <p>Trusted Support</p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="backdrop-blur-xl border p-4 sm:p-8 rounded-3xl transition-colors"
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
                  href="mailto:boxesnbottles028@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5"
                >
                  <Mail className="text-highlight shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase font-bold tracking-wider text-muted">
                      Email Support
                    </p>
                    <p className="font-medium text-light">
                      boxesnbottles028@gmail.com
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+919463303177"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5"
                >
                  <Phone className="text-highlight shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase font-bold tracking-wider text-muted">
                      Call Our Sales Team
                    </p>
                    <p className="font-medium text-light">+91 9463303177</p>
                  </div>
                </a>
              </div>
            </div>
            <div
              className="backdrop-blur-xl border p-4 sm:p-8 rounded-3xl transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-2xl text-highlight font-bold mb-4 flex items-center gap-3">
                <span className="w-10 bg-highlight/22 h-10 rounded-full flex items-center justify-center">
                  <ExternalLink size={20} />
                </span>
                Business Related
              </h3>
              <p className="mb-8 leading-relaxed text-muted">
                Interested in enterprise plans? Connect with our executives to
                find the perfect solution for you.
              </p>
              <div className="flex flex-col gap-4">
                <a
                  href="https://wa.me/+919463303177"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5"
                >
                  <MessageCircle className="text-highlight shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase font-bold tracking-wider text-muted">
                      WhatsApp Chat
                    </p>
                    <p className="font-medium text-light">Start Conversation</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div
            className="backdrop-blur-xl my-4 border flex not-md:flex-col not-md:gap-10 justify-between p-4 sm:p-8 rounded-3xl transition-colors"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex flex-col gap-4 w-full items-start">
              <div>
                <h1 className="font-bold text-highlight text-lg">
                  Send a Message
                </h1>
                <p className="text-muted text-xs">
                  Share your requirements and we will get back within one
                  business day.
                </p>
              </div>
              <div className="w-full text-light md:pr-10 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border-light/30 focus:border-light focus:outline-0 p-2 placeholder:text-muted/40 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Email"
                  className="w-full border-light/30 focus:border-light focus:outline-0 p-2 placeholder:text-muted/40 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="w-full border-light/30 focus:border-light focus:outline-0 p-2 placeholder:text-muted/40 border rounded-lg"
                />
                <select
                  name=""
                  id=""
                  className="w-full border-light/30 text-muted focus:border-light focus:outline-0 p-2 placeholder:text-muted/40 border rounded-lg"
                >
                  <option className="text-dark" value="">
                    General Inquiry
                  </option>
                  <option className="text-dark" value="">
                    Buyer Requirement
                  </option>
                  <option className="text-dark" value="">
                    Seller Partnership
                  </option>
                  <option className="text-dark" value="">
                    Technical Support
                  </option>
                </select>
                <textarea
                  placeholder="Your message"
                  name=""
                  rows={4}
                  className="w-full border-light/30 focus:border-light focus:outline-0 p-2 placeholder:text-muted/40 border rounded-lg"
                  id=""
                ></textarea>
              </div>
              <div className="flex gap-2">
                <Submit />
                <Link
                href={"mailto:boxesnbottles028@gmail.com"}
                className="text-light/80 hover:text-light hover:bg-white/20 transition-all font-medium bg-white/10 px-3 py-1 rounded border border-white/20">
                  Email Instead
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full items-start">
              <div>
                <h1 className="font-bold text-highlight text-lg">Quick Info</h1>
                <p className="text-muted text-xs">
                  Information about us so you can directly reach out.
                </p>
              </div>
              <div className="w-full text-light md:pr-10 flex flex-col gap-4">
                <div className="w-full border-light/30 flex items-center justify-between focus:border-light focus:outline-0 p-2 placeholder:text-muted/40 py-3 border rounded-lg">
                  <p className="text-muted text-sm font-medium">
                    Support Hours
                  </p>
                  <p className="font-bold text-sm">Mon - Sat, 9:00 - 18:00 IST</p>
                </div>
                <div className="w-full border-light/30 flex items-center justify-between focus:border-light focus:outline-0 p-2 placeholder:text-muted/40 py-3 border rounded-lg">
                  <p className="text-muted text-sm font-medium">
                    Response Time
                  </p>
                  <p className="font-bold text-sm">Within 24 hours</p>
                </div>
                <div className="w-full border-light/30 flex items-center justify-between focus:border-light focus:outline-0 p-2 placeholder:text-muted/40 py-3 border rounded-lg">
                  <p className="text-muted text-sm font-medium">
                    Primary Region
                  </p>
                  <p className="font-bold text-sm">India</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="backdrop-blur-xl my-4 border flex not-md:flex-col not-md: gap-4 items-center justify-between p-4 sm:p-8 rounded-3xl transition-colors"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex flex-col gap-2">
              <p className="font-bold text-highlight text-lg sm:text-xl md:text-2xl lg:text-3xl">Need help with a requirement?</p>
              <p className="text-muted text-xs md:text-sm">Post your requirement or start a conversation with our team.</p>
            </div>
            <div className="flex gap-4">
              <Link
              href={"https://wa.me/919463303177"}
              target="_blank"
              className=" text-dark md:px-6 p-3 flex justify-center items-center bg-light rounded-full not-md:text-sm font-bold md:py-3">
                Whatsapp
              </Link>
              <Link 
              target="_blank"
              href={"mailto:boxesnbottles028@gmail.com"}
              className="border text-light md:px-6 p-3 flex justify-center items-center rounded-full not-md:text-sm font-bold md:py-3">
                Email
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
