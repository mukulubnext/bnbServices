"use client";
import LiquidGlassMenu from "@/components/LiquidGlassMenu";
import Navbar from "@/components/Navbar";
import { NextPage } from "next";
import TokenCard from "./components/TokenCard";
import { useEffect, useState } from "react";
import { Coins, IndianRupee } from "lucide-react";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [selected, setSelected] = useState<number>(0);
  const [custom, setCustom] = useState<number>(0);
  const [customCredits, setCustomCredits] = useState<number>(0);
  const [credits, setCredits] = useState<any>(null);
  const debounced = useDebounce(custom, 500);

  const [isFetchingCredits, setIsFetchingCredits] = useState<boolean>(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/v1/credits");
        const data = await res.json();
        if (res.status === 200) {
          setCredits(data.prices);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCredits();
  }, []);

  // useEffect(() => {
  //   if (!loading && !user) router.push("/signin");
  // }, [user, loading, router]);

  useEffect(() => {
    if (debounced < 250) {
      return;
    }
    setIsFetchingCredits(true);
    const price = axios.post("/api/v1/credits", {
      price: debounced,
    });
    price
      .then((res) => {
        if (res.data.status === "success") {
          setCustomCredits(res.data.credits);
        }
      })
      .finally(() => {
        setIsFetchingCredits(false);
      });
  }, [debounced]);

  if (!credits || loading) {
    return (
      <div className="w-screen h-screen bg-light flex justify-center items-center">
        <Navbar solid />
        <LiquidGlassMenu />
        <div className="w-screen h-screen bg-light flex justify-center items-center">
          <Spinner light={false} />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-light w-full py-[10vh] flex flex-col justify-center items-center min-h-screen">
      <Navbar solid={true} />
      <LiquidGlassMenu />
      <div className="bg-white gap-4 px-4 items-center w-[96%] lg:w-fit py-6 flex flex-col rounded-lg min-h-full">
        <h1 className="font-bold text-dark text-center text-xl lg:text-2xl">
          Buy Credits
        </h1>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 w-fit mx-auto">
          {credits.map((credit: any) => (
            <TokenCard
              key={credit.id}
              id={credit.id}
              credits={credit.credits}
              price={credit.price}
              selected={selected}
              setSelected={setSelected}
              setCustom={setCustom}
            />
          ))}
        </div>
        <div className="w-10 h-10 mx-auto md:mx-0 bg-white border-2 text-dark font-bold text-center flex justify-center items-center rounded-full">
          or
        </div>
        <div className="flex flex-col justify-center items-center w-full gap-2">
          <h1 className="font-bold text-dark text-xl">
            Custom Credits Value:{" "}
          </h1>
          <div>
            <div className="flex gap-1 justify-start relative items-center">
              <IndianRupee className="text-dark left-2 absolute" />
              <input
                inputMode="numeric"
                placeholder="Enter price in ₹ (Min 250)"
                onFocus={() => {
                  setSelected(0);
                }}
                value={custom === 0 ? "" : custom}
                onChange={(e) => setCustom(Number(e.target.value))}
                type="number"
                min={250}
                className="border focus:outline-0 w-full md:w-auto p-3 pl-10 rounded border-dark"
              />
            </div>
          </div>
        </div>
        <div className="border-t-2 w-full text-dark font-bold flex flex-col py-2 md:py-6 gap-2 border-dark">
          <p className="flex gap-1 items-center">
            Credits:{" "}
            {custom !== 0 && debounced < 250 ? (
              <span className="text-red-500">Min 250₹</span>
            ) : (
              ""
            )}
            <span>
              {custom >= 250 &&
                (isFetchingCredits ? <Spinner light={false} /> : customCredits)}
            </span>
            {credits.find((credit: any) => credit.id === selected)?.credits}
          </p>
          <p>
            Price: ₹{debounced !== 0 && !selected && debounced}
            {credits.find((credit: any) => credit.id === selected)?.price}
          </p>
          {!selected && custom < 250 ? (
            <button className="bg-dark brightness-50 mx-auto cursor-not-allowed w-full text-white border transition-all duration-300 font-bold py-2 px-5 md:w-100 rounded-md">
              Buy
            </button>
          ) : (
            <button className="bg-dark mx-auto w-full text-white hover:bg-white hover:text-dark border transition-all duration-300 font-bold py-2 px-5 md:w-100 rounded-md">
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
