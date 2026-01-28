import { X } from "lucide-react";
import { NextPage } from "next";

interface Props {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]|null|undefined>>;
}

const AllItems: NextPage<Props> = ({items, setItems}:Props) => {
  return (
    <div className="flex justify-center fixed w-screen h-screen z-100 top-0 left-0 items-center bg-black/80">
      <div className="bg-white relative min-w-[50%] max-w-[95%] h-fit rounded">
        <div onClick={()=>{
          setItems(null);
        }} className="transition-all absolute hover:bg-dark/30 top-1 left-[1%] p-2 flex justify-center items-center w-fit rounded-full">
          <X className="cursor-pointer text-dark" />
        </div>
        <div className="flex flex-wrap py-10 px-14 max-w-[95%]">
          {
            items.map((item, key)=>(
              <div key={key} className="border text-sm md:text-[16px] px-3 py-1 w-fit bg-dark text-white font-medium rounded-full">
                {item.category.name}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default AllItems;
