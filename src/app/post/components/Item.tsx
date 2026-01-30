import { IndianRupee } from "lucide-react";
import { NextPage } from "next";
import { useEffect } from "react";

interface ItemData {
  categoryId: number | undefined;
  details: string;
  quantity: number;
  budget: number;
  subcategoryId: number | undefined;
}

interface Props {
  value: ItemData;
  allCategories: any[];
  onChange: (item: ItemData) => void;
}

const Item: NextPage<Props> = ({ value, allCategories, onChange }) => {
  const update = (patch: Partial<ItemData>) => {
    onChange({ ...value, ...patch });
  };
  return (
    <div className="py-3 pb-10 relative text-sm md:text-[16px] flex flex-col gap-2">
      <div className="flex flex-col md:flex-row gap-2 justify-center md:gap-[10%] items-center">
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Item:</span>
          <select
            value={value.categoryId ?? ""}
            onChange={(e) => update({ categoryId: Number(e.target.value) })}
            className="border border-dark/20 w-full focus:outline-0 rounded-md p-2"
          >
            <option value="" disabled>
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
          <span>Item Category:</span>
          <select
            value={value.subcategoryId ?? ""}
            onChange={(e) => update({ subcategoryId: Number(e.target.value) })}
            className="border border-dark/20 w-full focus:outline-0 rounded-md p-2"
          >
            <option value="" disabled>
              {value.categoryId ? "Select a category" : "Select an item first"}
            </option>
            {value.categoryId && allCategories[value.categoryId-1].subCategories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

      </div>
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Details</span>
          <input
            value={value.details}
            placeholder="Size, Color, Material etc."
            onChange={(e) => update({ details: e.target.value })}
            className="border border-dark/20 rounded-md w-full p-2"
          />
        </label>

      <div className="flex justify-center gap-[10%] items-center">
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Quantity</span>
          <input
            type="number"
            min={1}
            value={value.quantity}
            onChange={(e) =>
              update({ quantity: e.target.valueAsNumber })
            }
            className="border border-dark/20 rounded-md w-full p-2"
          />
        </label>

        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Estimated Price / Unit</span>
          <div className="relative flex items-center">
            <input
              type="number"
              min={0}
              value={value.budget}
              onChange={(e) =>
                update({ budget: e.target.valueAsNumber })
              }
              className="border pl-8 border-dark/20 w-full rounded-md p-2"
            />
            <IndianRupee size={16} className="absolute text-dark left-2" />
          </div>
        </label>
      </div>
    </div>
  );
};

export default Item;
