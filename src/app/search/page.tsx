import ProductCard from "@/components/ProductCard";
import { db } from "@/prisma/db";
import { or } from "@prisma/orm-postgres/orm-client";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? ""; //trim- to remove white space
  //   console.log(q);

  if (!query) {
    return <p>Type something in the search box to find products</p>;
  }

  const pattern = `%${query}%`; // % - sql wildcard means we can write anything before nd after

  const products = await db.orm.public.Product.where((p) =>
    or(p.name.ilike(pattern), p.description.ilike(pattern)),
  ) //database se lekr ana hai data kisi bhi secnario mai 
    .orderBy((p) => p.name.asc())
    .limit(25)
    .all(); //ilike for caseinsensitive

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        {products.length}result{products.length === 1 ? "" : "s"} for {query}
        {products.length === 0 ? (
          <p>No products matched. Try a different search</p>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                imageUrl={p.imageUrl}
              />
            ))}
          </div>
        )}
      </h1>
    </div>
  );
}
