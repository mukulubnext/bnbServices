import { QuantityUnit } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";

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
  return (
    <div
      className="flex flex-col relative z-100"
      onClick={(e) => {
        e.stopPropagation();
        setExpanded((prev) => !prev);
      }}
    >
      <div className={`border border-dark/20 cursor-pointer transition-all duration-300 ring-dark flex items-center gap-2 text-dark p-2 h-full ${expanded ? "rounded-t-0 rounded-b-md": "rounded-md"}`}>
        {quantityUnit}
        <ChevronDown size={16} className={`${!expanded ? "rotate-180" : ""} transition-all duration-300`} />
      </div>
      {expanded && (
        <div className={`absolute border border-dark/20 rounded-t border-t-0 bottom-full w-full z-500`}>
          {Object.values(values).map((value) => (
            <div
              key={value}
              onClick={() => {
                onChange({ quantityUnit: value });
              }}
              className={`border-t text-center cursor-pointer border-dark/20 z-500 w-full hover:bg-dark hover:text-light transition-all duration-300 flex items-center gap-2 p-2 h-full first:rounded-t ${quantityUnit === value ? "bg-dark text-light" : "bg-white text-dark"}`}
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
