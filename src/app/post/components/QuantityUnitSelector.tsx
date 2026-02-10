import { QuantityUnit } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

interface Props {
  quantityUnit: string;
  onChange: (item: Partial<ItemData>) => void;
}
interface ItemData {
  categoryId: number | undefined;
  details: string;
  units: number;
  budget: number;
  subCategoryId: number | undefined;
  quantity: number;
  quantityUnit: string;
}

const QuantityUnitSelector: NextPage<Props> = ({ quantityUnit, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  const values = QuantityUnit;
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={menuRef}
      className={`flex flex-col relative px-1 border border-dark/20 z-100 ${expanded ? "rounded-t": "rounded"}`}
      onClick={(e) => {
        e.stopPropagation();
        setExpanded((prev) => !prev);
      }}
    >
      <div className={`cursor-pointer transition-all duration-300 ring-dark flex items-center gap-5 text-dark p-2 h-full`}>
        {quantityUnit}
        <ChevronDown size={16} className={`${!expanded ? "rotate-180" : ""} transition-all duration-300`} />
      </div>
      {expanded && (
        <div className={`absolute thin-scrollbar left-0 max-h-40 overflow-y-scroll border border-dark/20 rounded-b border-t-0 top-full w-full z-500`}>
          {Object.values(values).map((value) => (
            <div
              key={value}
              onClick={() => {
                onChange({ quantityUnit: value });
              }}
              className={`border-t text-center cursor-pointer border-dark/20 z-500 w-full hover:bg-dark hover:text-light transition-all duration-300 flex items-center gap-2 p-2 h-full last:rounded-b ${quantityUnit === value ? "bg-dark text-light" : "bg-white text-dark"}`}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuantityUnitSelector;
