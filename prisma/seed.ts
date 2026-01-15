import prisma from "@/lib/prisma";

async function main(){
    const catgories = ["Bottles", "Pouches","Bags","Cardboard Boxes"]
    for(const name of catgories){
        await prisma.category.upsert({
            where: {name: name},
            update: {},
            create: {name: name}
        })
    }
}
main();