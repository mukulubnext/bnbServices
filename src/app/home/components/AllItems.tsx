import { X } from "lucide-react";
import { NextPage } from "next";

interface Props {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[] | null | undefined>>;
}

const AllItems: NextPage<Props> = ({ items, setItems }: Props) => {
  return (
    <div className="flex justify-center fixed w-screen h-screen z-100 top-0 left-0 items-center bg-black/80">
      <div className="bg-white relative min-w-[50%] max-w-[95%] h-fit rounded">
        <div
          onClick={() => {
            setItems(null);
          }}
          className="transition-all absolute hover:bg-dark/30 top-1 left-[1%] p-2 flex justify-center items-center w-fit rounded-full"
        >
          <X className="cursor-pointer text-dark" />
        </div>
        <div className="flex flex-col py-10 px-5 md:px-14 max-w-[95%]">
          <h1 className="font-bold text-dark md:text-xl">All Items</h1>
          <div className="w-100% max-h-[70vh] overflow-y-scroll overflow-x-auto mt-5">
            <table className="w-full">
              <thead>
                <tr className="text-dark text-sm md:text-[16px]">
                  <th className="text-left px-5 py-3">Item Name</th>
                  <th className="text-center px-5 py-3">Price/unit</th>
                  <th className="text-center px-5 py-3">Quantity</th>
                  <th className="text-center px-5 py-3">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {items &&
                  items.map((item, index) => (
                    <tr key={index} className="border-t last:border-b text-dark">
                      <td className="px-5 py-3 flex flex-col">
                        <span className="font-bold">{item.category.name}</span>
                        <span className="text-sm text-dark/90">{item.subCategory.name}</span>
                      </td>
                      <td className="text-center px-5 py-3">₹{item.budget}</td>
                      <td className="text-center px-5 py-3">{item.quantity}</td>
                      <td className="text-center px-5 py-3">
                        ₹{item.quantity * Number(item.budget)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t text-dark">
                    <td className="px-5 py-3 font-bold text-dark">Total</td>
                    <td></td>
                    <td className="text-center">{items.reduce((acc, item) => acc + Number(item.quantity), 0)}</td>
                    <td className="px-5 py-3 font-medium text-center text-dark">₹{items.reduce((acc, item) => acc + Number(item.budget) * Number(item.quantity), 0)}</td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllItems;
