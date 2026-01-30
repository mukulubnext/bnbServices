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
  ];

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });