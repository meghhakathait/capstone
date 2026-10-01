// seed.ts ka purpose hota hai database mein initial/dummy data automatically insert karna.
// For example, tumhare database mein Category table initially empty hai.Instead of manually database mein jaake.add karne ke, hum seed.ts mein code likhte hain. Then seed run karne par ye data database mein insert ho jata hai.

import { db } from "./db";

async function main() {
  const electronics = await db.orm.public.Category.create({
    name: "Electronics",
    slug: "electronics",
  });
  const apparel = await db.orm.public.Category.create({
    name: "Apparel",
    slug: "apparel", //slug mai space verga use ni kr skte hai
  });

  const existing = await db.orm.public.Product.first();
  if (existing) {
    console.log("Products already exist, skipping product seed.");
    return;
  }

  await db.orm.public.Product.createAll([
    {
      name: "Smartphone",
      description:
        "A high-end smartphone with a sleek design and powerful features",
      price: 699.99,
      categoryId: electronics.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "Smartwatch",
      description:
        "A stylish smartwatch with fitness tracking and smart notifications",
      price: 199.99,
      categoryId: electronics.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "Bluetooth Speaker",
      description:
        "A portable Bluetooth speaker with powerful sound and deep bass",
      price: 79.99,
      categoryId: electronics.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "Laptop",
      description:
        "A powerful laptop designed for work, entertainment, and everyday use",
      price: 999.99,
      categoryId: electronics.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "Classic T-Shirt",
      description:
        "A comfortable cotton t-shirt with a simple and stylish design",
      price: 24.99,
      categoryId: apparel.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "Denim Jacket",
      description:
        "A stylish denim jacket perfect for casual and everyday outfits",
      price: 59.99,
      categoryId: apparel.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "Slim Fit Jeans",
      description:
        "Comfortable slim-fit jeans made with durable and stretchable fabric",
      price: 49.99,
      categoryId: apparel.id,
      imageUrl: "/placeholder.png",
    },
  ]);
}
main()
  .then(() => {
    console.log("Seed data created successfully.");
  })
  .catch((error) => {
    console.log("Error creating seed data:", error);
  })
  .finally(() => {
    db.close();
  });
