"use client"
import axios from "axios";
import { ChevronDown, X } from "lucide-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  interestedCategories : any[];
  setInterestedCategories: React.Dispatch<React.SetStateAction<any[]>>;
}

const InterestedCategories: NextPage<Props> = ({interestedCategories,setInterestedCategories}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/v1/category");
        if (res.data.status === "success") {
          setCategories(res.data.categories);
        }
      } catch (err) {
        toast.error("Something went wrong!");
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      onClick={() => setExpanded((prev) => !prev)}
      className="bg-white select-none text-xl p-3 flex flex-col gap-4 w-full border border-dark text-dark rounded-md"
    >
      {interestedCategories.length > 0 ? (
        <div className="flex flex-wrap gap-2 items-center">
          {interestedCategories.map((cat) => {
            return (
              <div
                onClick={(e) => {
                  const index = interestedCategories.indexOf(cat);
                  if (index !== -1) {
                    setInterestedCategories((prev) =>
                      prev.filter((c) => c.id !== cat.id)
                    );
                  }
                  e.stopPropagation();
                }}
                className="px-3 py-1 font-medium flex flex-row justify-center items-center cursor-pointer w-fit text-light bg-dark rounded-full"
                key={cat.id}
              >
                {cat.name} <X size={14} className="ml-2" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-dark opacity-50">Select</p>
          <div>
            <ChevronDown
              className={`${
                expanded ? "rotate-180" : ""
              } text-dark transition-all duration-300`}
            />
          </div>
        </div>
      )}
      {expanded && (
        <>
          <hr className="text-dark/50" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white gap-2 flex flex-wrap"
          >
            {categories.map((cat) => {
              return (
                <div
                  onClick={() =>
                    !interestedCategories.includes(cat) &&
                    setInterestedCategories((prev) => [...prev, cat])
                  }
                  className="px-3 border-dark hover:bg-dark/10 transition-all duration-300 border rounded-full font-medium text-[16px] py-1 cursor-pointer"
                  key={cat.id}
                >
                  {cat.name}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default InterestedCategories;
