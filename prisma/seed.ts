import prisma from "@/lib/prisma";

async function main() {
  const data = [
    {
      name: "Bottles",
      subCategories: ["Plastic", "Glass", "Aluminum", "PLA"],
    },
    {
      name: "Pouches",
      subCategories: ["Plastic", "Aluminum", "Laminated Paper Based"],
    },
    {
      name: "Bags",
      subCategories: [
        "Plastic",
        "Paper",
        "Jute",
        "Cloth",
        "Woven",
        "Non Woven",
        "Compostable",
      ],
    },
    {
      name: "Cardboard Boxes",
      subCategories: [
        "Single Wall",
        "Double Wall",
        "Triple Wall",
        "Duplex Boxes",
      ],
    },
    {
      name: "Flexible Packaging Rolls & Films",
      subCategories: [
        "Plastic Films",
        "Aluminum Foil Rolls",
        "Laminated Films",
        "Biodegradable Films",
      ],
    },
    {
      name: "Containers & Trays",
      subCategories: ["Plastic", "Aluminum", "Paper", "Glass"],
    },
  ];
  const credits = [
    { credits: 200, price: 250 },
    { credits: 500, price: 500 },
    { credits: 1150, price: 1000 },
    { credits: 2500, price: 2000 },
    { credits: 6000, price: 4000},
    { credits: 8000, price: 5000},
  ]
  for (const category of data) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });

    for (const subName of category.subCategories) {
      await prisma.subCategory.upsert({
        where: {
          categoryId_name: {
            name: subName,
            categoryId: createdCategory.id,
          },
        },
        update: {},
        create: {
          name: subName,
          categoryId: createdCategory.id,
        },
      });
    }
  }
  for(const credit of credits){
    await prisma.credits.create({
      data: {
        credits: credit.credits,
        price: credit.price,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
