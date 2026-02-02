"use client";
import axios from "axios";
import { ChevronDown, X } from "lucide-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "./Spinner";

interface Props {
  interestedCategories: any[];
  setInterestedCategories: React.Dispatch<React.SetStateAction<any[]>>;
}

const InterestedCategories: NextPage<Props> = ({
  interestedCategories,
  setInterestedCategories,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [catExpanded, setCatExpanded] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/v1/category");
        if (res.data.status === "success") {
          setCategories(res.data.categories);
          console.log(res.data);
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
      className="bg-white select-none p-3 flex flex-col gap-4 w-full border border-dark text-dark rounded-md"
    >
      {interestedCategories.length > 0 ? (
        <div className="flex items-center relative">
          <div className="flex flex-wrap gap-2 items-center">
            {interestedCategories.map((cat) => (
              <div
                key={cat.id}
                className="px-3 py-1 font-medium flex flex-wrap items-center gap-2 cursor-pointer text-light bg-dark rounded-full"
              >
                <span>{cat.name}:</span>

                {cat.subCategories.map((sub: any) => (
                  <span
                    key={sub.id}
                    className="text-white font-medium py-0.5 rounded-full text-sm"
                  >
                    {sub.name}
                  </span>
                ))}

                <X
                  size={14}
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInterestedCategories((prev) =>
                      prev.filter((c) => c.id !== cat.id),
                    );
                  }}
                />
              </div>
            ))}
          </div>
          <div className="absolute right-0">
            <ChevronDown
              className={`${
                expanded ? "rotate-180" : ""
              } text-dark transition-all duration-300`}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-dark opacity-50">Select</p>
          </div>
          <div className="absolute right-[12%]">
            <ChevronDown
              className={`${
                expanded ? "rotate-180" : ""
              } text-dark transition-all duration-300`}
            />
          </div>
        </>
      )}
      {expanded && (
        <>
          <hr className="text-dark/50" />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ scrollbarWidth: "thin" }}
            className="bg-white gap-2 flex flex-col overflow-y-scroll max-h-100"
          >
            {categories ? (
              categories.map((cat) => {
                return (
                  <div key={cat.id} className="flex gap-2 flex-col">
                    <div
                      onClick={() => {
                        catExpanded === cat.id
                          ? setCatExpanded(undefined)
                          : setCatExpanded(cat.id);
                      }}
                      className={`px-3 mr-5 flex justify-between items-center border-dark transition-all duration-300 border rounded-full font-medium text-[16px] py-1 cursor-pointer ${catExpanded === cat.id ? "bg-dark text-white hover:bg-dark" : " hover:bg-dark/10"}`}
                      key={cat.id}
                    >
                      {cat.name}{" "}
                      <ChevronDown
                        className={`${catExpanded === cat.id ? "rotate-180 text-white" : ""} text-dark transition-all duration-300`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        {catExpanded === cat.id &&
                          cat.subCategories.map((subCat: any) => {
                            return (
                              <div
                                onClick={() => {
                                  setInterestedCategories((prev) => {
                                    const existingCategory = prev.find(
                                      (c) => c.id === cat.id,
                                    );
                                    if (existingCategory) {
                                      const subExists =
                                        existingCategory.subCategories.some(
                                          (s: any) => s.id === subCat.id,
                                        );

                                      if (subExists) return prev;

                                      return prev.map((c) =>
                                        c.id === cat.id
                                          ? {
                                              ...c,
                                              subCategories: [
                                                ...c.subCategories,
                                                subCat,
                                              ],
                                            }
                                          : c,
                                      );
                                    }
                                    return [
                                      ...prev,
                                      {
                                        id: cat.id,
                                        name: cat.name,
                                        subCategories: [subCat],
                                      },
                                    ];
                                  });
                                }}
                                className="px-3 flex w-fit justify-between items-center border-dark hover:bg-dark/10 transition-all duration-300 border rounded-full font-medium text-[14px] py-1 cursor-pointer"
                                key={subCat.id}
                              >
                                {subCat.name}
                              </div>
                            );
                          })}
                      </div>
                      {catExpanded === cat.id && (
                        <hr className="text-dark/30 px-5" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center">
                <Spinner light={false} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InterestedCategories;
