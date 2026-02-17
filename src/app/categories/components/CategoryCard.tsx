import { NextPage } from "next";

interface Props {
  category: any;
  subCategories: any[];
}

const CategoryCard: NextPage<Props> = ({ category, subCategories }) => {
  return (
    <div className="flex flex-col gap-3 bg-white 
                    w-full h-full p-5 rounded-xl 
                    border border-dark/10
                    hover:shadow-md transition-shadow md:min-h-40">
      
      <h2 className="text-lg font-semibold text-dark">
        {category}
      </h2>

      <div className="flex flex-wrap gap-2">
        {subCategories.map((sub) => (
          <span
            key={sub.id}
            className="px-3 py-1 text-xs rounded-full 
                       bg-dark/5 text-dark 
                       hover:bg-dark hover:text-white
                       transition-all cursor-pointer"
          >
            {sub.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
