import { NextPage } from "next";

interface Props {
  items: any[];
}

const ItemTable: NextPage<Props> = ({ items }: Props) => {
  return (
    <div className="w-100% max-h-[70vh] overflow-y-scroll overflow-x-auto mt-5">
      <table className="w-full">
        <thead>
          <tr className="text-dark text-sm md:text-[16px]">
            <th className="text-left px-5 py-3">Item Name</th>
            <th className="text-center px-5 py-3">Price/unit</th>
            <th className="text-center px-5 py-3">Quantity</th>
            <th className="text-center px-5 py-3">Units</th>
            <th className="text-center px-5 py-3">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-dark/20 group last:border-b text-dark"
              >
                <td className="px-5 py-3">
                  <div className="font-bold">{item.category.name}</div>
                  <div className="text-sm text-dark/80 min-w-60">
                    {item.subCategory.name}, {item.details}
                  </div>
                </td>

                <td className="text-center px-5 py-3">₹{Number(item.budget).toLocaleString()}</td>
                <td className="text-center px-5 py-3"> 
                  {item.quantity}{item.quantityUnit}
                </td>
                <td className="text-center px-5 py-3">{item.units}</td>
                <td className="text-center px-5 py-3">
                  ₹{item.units * Number(item.budget)}
                </td>
              </tr>
            ))}
          <tr className="border-t border-dark/20 text-dark">
            <td className="px-5 py-3 font-bold text-dark">Total</td>
            <td></td>
            <td></td>
            <td className="text-center">
              {items.reduce((acc, item) => acc + Number(item.units), 0)}
            </td>
            <td className="px-5 py-3 font-medium text-center text-dark">
              ₹
              {items.reduce(
                (acc, item) =>
                  acc + Number(item.budget) * Number(item.units),
                0,
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
