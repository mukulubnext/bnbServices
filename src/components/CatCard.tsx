import { NextPage } from 'next'

interface Props {
    category: any;
    subCategories: any[];
}

const CatCard: NextPage<Props> = ({category, subCategories}: Props) => {
  return <div className="flex flex-col gap-3 bg-white/10 
                    w-full h-full p-5 rounded-xl 
                    border border-white/40 text-light
                    hover:shadow-md transition-shadow md:min-h-40">
      
      <h2 className="text-lg font-semibold">
        {category}
      </h2>

      <div className="flex flex-wrap gap-2">
        {subCategories.map((sub) => (
          <span
            key={sub.id}
            className="px-3 py-1 text-xs rounded-full 
                       bg-light/5 border border-light/30
                       hover:bg-light/30 hover:text-white
                       transition-all cursor-pointer"
          >
            {sub.name}
          </span>
        ))}
      </div>
    </div>
}

export default CatCard