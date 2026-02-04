"use client";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {}

const TransactionTable: NextPage<Props> = ({}) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const res = await axios.get("/api/v1/transactions");
        if (res.data.status === "success") {
          setTransactions(res.data.transactions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getTransactions();
  },[])

  if(loading){
    return(
        <div className="flex justify-center items-center">
            <Spinner light={false} />
        </div>
    )
  }
  
  return (
    <div className="w-full h-[50vh] border border-dark/40 rounded-lg">
      {!transactions || transactions.length === 0 ? (
        <div className="flex h-full relative bottom-[5%] text-black/40 justify-center items-center">
          No previous record.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead className="text-dark">
            <tr>
              <th className="border border-dark/20 p-2 text-left">Date</th>
              <th className="border text-center border-dark/20 p-2">Type</th>
              <th className="border text-center border-dark/20 p-2">Credits</th>
            </tr>
          </thead>
          <tbody className="text-dark">
            {transactions.map((trans: any) => (
              <tr key={trans.id}>
                <td className="border border-dark/20 p-2">{trans.createdAt}</td>
                <td className="border text-center border-dark/20">
                  {trans.type}
                </td>
                <td
                  className={`border text-center border-dark/20 p-2 ${trans.type === "OFFER" ? "text-red-400" : "text-dark"}`}
                >
                  {trans.type === "OFFER" ? "-" : "+"} {trans.credits}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
