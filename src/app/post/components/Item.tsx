import { IndianRupee, X } from "lucide-react";
import { NextPage } from "next";
import { JSX, useState } from "react";

interface Props {
  allCategories: any[];
}

const Item: NextPage<Props> = ({
  allCategories,
}: Props) => {
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [budget, setBudget] = useState(0);
  return (
    <div className="py-3 pb-10 relative text-sm md:text-[16px] flex flex-col gap-2">
      <div className="flex flex-col md:flex-row gap-2 justify-center md:gap-[10%] items-center">
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Item:</span>
          <select
            value={category}
            defaultValue={""}
            onChange={(e) => setCategory(Number(e.target.value))}
            className="border border-dark/20 w-full rounded-md p-2 focus:outline-none focus:border-dark transition-all"
          >
            <option value={""} disabled>
              Select an item
            </option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">
            Details (max 100 characters):
          </span>
          <input
            type="text"
            maxLength={100}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Size, Material, Type etc."
            className="border border-dark/20 rounded-md w-full p-2 focus:outline-none focus:border-dark transition-all"
          />
        </label>
      </div>
      <div className="flex justify-center gap-[10%] items-center">
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Quantity (min 1):</span>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.valueAsNumber)}
            type="number"
            min={1}
            placeholder="1, 5, 10, 100 etc."
            className="border border-dark/20 rounded-md w-full p-2 focus:outline-none focus:border-dark transition-all"
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Budget:</span>
          <div className="relative flex items-center">
            <input
              type="number"
              value={budget}
              min={0}
              onChange={(e) => setBudget(e.target.valueAsNumber)}
              placeholder="Budget for whole order (in INR)"
              className="border pl-8 border-dark/20 w-full rounded-md p-2 focus:outline-none focus:border-dark transition-all"
            />
            <IndianRupee size={16} className="absolute text-dark left-2" />
          </div>
        </label>
      </div>
    </div>
  );
};

export default Item;
