import { IndianRupee } from "lucide-react";
import { NextPage } from "next";
import { useEffect } from "react";
import QuantityUnitSelector from "./QuantityUnitSelector";

interface ItemData {
  categoryId: number | undefined;
  details: string;
  units: number;
  budget: number;
  subCategoryId: number | undefined;
  quantity: number;
  quantityUnit: string;
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
          <span className="text-dark font-medium">Item Category:</span>
          <select
            value={value.subCategoryId ?? ""}
            onChange={(e) => update({ subCategoryId: Number(e.target.value) })}
            className="border border-dark/20 w-full focus:outline-0 rounded-md p-2"
          >
            <option value="" disabled>
              {value.categoryId ? "Select a category" : "Select an item first"}
            </option>
            {value.categoryId &&
              allCategories[value.categoryId - 1].subCategories.map(
                (cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ),
              )}
          </select>
        </label>
      </div>
      <hr className="mt-2 text-dark/20" />
      <div className="flex flex-col md:flex-row gap-2 justify-center md:gap-[10%] items-center">
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Units</span>
          <input
            type="number"
            min={1}
            value={value.units}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => update({ units: e.target.valueAsNumber })}
            className="border border-dark/20 rounded-md w-full p-2"
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          <span className="text-dark font-medium">Estimated Price / Unit</span>
          <div className="relative flex items-center">
            <input
              onScroll={(e) => e.preventDefault()}
              type="number"
              min={0}
              value={value.budget === 0 ? "" : String(value.budget)}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*\.?\d*$/.test(v)) {
                  update({ budget: v === "" ? 0 : Number(v) });
                }
              }}
              className="border pl-8 border-dark/20 w-full rounded-md p-2"
            />
            <IndianRupee size={16} className="absolute text-dark left-2" />
          </div>
        </label>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="quantity" className="text-dark font-medium">
            Quantity
          </label>

          <div className="flex items-start focus-within:border-dark justify-between border border-dark/20 rounded-md">
            <input
              id="quantity"
              type="number"
              min={1}
              onWheel={(e) => e.currentTarget.blur()}
              onScroll={(e) => e.preventDefault()}
              value={value.quantity}
              onChange={(e) => update({ quantity: e.target.valueAsNumber })}
              className="w-full focus:outline-0 p-2"
            />

            <QuantityUnitSelector
              quantityUnit={value.quantityUnit}
              onChange={update}
            />
          </div>
        </div>
      </div>
      <label className="flex flex-col gap-2 w-full">
        <span className="text-dark font-medium flex items-center gap-1">
          Details <span className="text-sm text-dark/70">(Optional)</span>
        </span>
        <input
          value={value.details}
          placeholder="Size, Color, Material etc."
          onChange={(e) => update({ details: e.target.value })}
          className="border border-dark/20 rounded-md w-full p-2"
        />
      </label>
    </div>
  );
};

export default Item;
