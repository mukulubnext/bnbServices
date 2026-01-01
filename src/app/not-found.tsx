import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Construction } from "lucide-react";
import { NextPage } from "next";

interface Props {}

const NotFound: NextPage<Props> = ({}) => {
  return (
    <>
    <Navbar/>
    <div className="bg-dark flex-col pb-10 h-[90vh] text-9xl text-highlight font-extrabold flex justify-center items-center">
      <div>
        <Construction size={128}/>

      </div>
      404 - Not Found
      <p className="text-lg font-normal">This page doesn't exist</p>
    </div>
    <Footer/>
    </>
  );
};

export default NotFound;
