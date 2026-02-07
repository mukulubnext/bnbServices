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
  const [checked, setChecked] = useState<boolean>(false);

  const [isFetchingCredits, setIsFetchingCredits] = useState<boolean>(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await axios.get("/api/v1/credits");
        if (res.data.status === "success") {
          setCredits(res.data.prices);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCredits();
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

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
    <div className="bg-light w-full py-[10vh] flex flex-col justify-start items-center min-h-screen">
      <Navbar solid={true} />
      <LiquidGlassMenu />
      <div className="bg-white w-[95vw] md:w-[80vw] flex flex-col md:flex-row text-dark border-dark/40 border-2 shadow-xl rounded min-h-[80vh]">
        <div className="md:w-[70%] border-r border-dark/40">
          <div className="h-fit p-10 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Choose credits</h1>
            <div className="grid grid-cols-2 xl:grid-cols-3 justify-between items-center gap-8">
              {credits.map((credit: any, index: number) => (
                <TokenCard
                  key={index}
                  price={credit.price}
                  setSelected={setSelected}
                  setCustom={setCustom}
                  selected={selected}
                  credits={credit.credits}
                  id={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="md:w-[30%] flex flex-col justify-between gap-4 p-10">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h1 className="font-medium">Credits</h1>
              <div className="relative flex items-center">
                {!isFetchingCredits ? (
                  <div className="border border-dark/20 w-full py-1 pl-8 rounded">
                    {!selected && custom < 250
                      ? <span className="text-red-500">Price must be greater than 250</span>
                      : selected === 0
                        ? customCredits
                        : credits[selected - 1].credits}
                  </div>
                ) : (
                  <div className="border border-dark/20 w-full py-1 pl-8 rounded">
                    <Spinner light={false} />
                  </div>
                )}
                <Coins
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-medium">Price (Change for custom)</h1>
              <div className="relative flex items-center">
                <input
                  value={selected === 0 ? custom : credits[selected - 1].price}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  min={250}
                  onChange={(e) => {
                    setCustom(Number(e.target.value));
                    setSelected(0);
                  }}
                  className="border border-dark/20 w-full py-1 pl-8 rounded"
                />
                <IndianRupee
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex flex-row my-3 justify-start items-start gap-1.75">
              <input
                onClick={() => setChecked((prev) => !prev)}
                type="checkbox"
                className="my-1"
              />
              <p className="text-sm">I agree to the Terms and Conditions</p>
            </div>
          </div>
          <div>
            {checked ? (
              <button className="flex justify-center transition-all duration-300 items-center py-2.5 hover:text-dark hover:bg-white border bg-dark text-white font-bold w-full">
                Checkout
              </button>
            ) : (
              <div className="relative group">
                <button className="flex justify-center items-center py-2.5 cursor-not-allowed brightness-50 border bg-muted text-white font-bold w-full">
                  Checkout
                </button>
                <p className="border absolute opacity-0 bottom-full text-nowrap right-full transition-all group-hover:opacity-100 duration-1000 text-xs p-1 bg-dark/20 text-dark">
                  Kindly agree to Terms and Conditions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
