import prisma from "@/lib/prisma";

async function main(){
    const catgories = ["Bottles", "Pouches","Bags","Cardboard Boxes"]
    const subcategories = [
                           ["Plastic","Glass","Aluminum","PLA"]
                           ,["Plastic","Aluminum","Laminated Paper Based"]
                          ,["Plastic","Paper","Jute","Cloth","Woven","Non Woven","Compostable"]
                          ,["Single Wall","Double Wall","Triple Wall","Duplex Boxes"]
                        ]
    for(const name of catgories){
        await prisma.category.upsert({
            where: {name: name},
            update:{
                subcategories: subcategories[catgories.indexOf(name)]
            },
            create: {name: name}
        })
    }
}
main();