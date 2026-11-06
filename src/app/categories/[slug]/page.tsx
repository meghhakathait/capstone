// for SEO purpose we use slug taki ye search mai jaye
//we not use slug on products bcoz category usually kam hoti hai but products multiple ho skte hai nd itna sara data name se get krna performance pr effect padhta hai

import ProductCard from "@/components/ProductCard";
import { db } from "@/prisma/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getCategory(slug: string) {
  // return db.orm.public.Category.include("product").where({ slug }).first(); -we can do this also but then it get all products at once we cannot apply any condition.

  return db.orm.public.Category.where({ slug }).first();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  //predefined
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "Product Not Found" };
  }
  return {
    title: category.name,
    description: `Browse all ${category.name} products`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const products = await db.orm.public.Product.where({
    categoryId: category.id,
  })
    .orderBy((p) => p.createdAt.desc())
    .limit(25)
    .all();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">{category.name}</h1>

      {/* <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {category.product.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            imageUrl={p.imageUrl}
            price={p.price}
          />
        ))}
      </div> */}

      {products.length === 0 ? (
        <p>No products in this category</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              imageUrl={p.imageUrl}
              price={p.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}
