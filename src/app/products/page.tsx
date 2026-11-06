import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import { db } from "@/prisma/db";
import { all, and } from "@prisma/orm-postgres/orm-client";

// Ye tumhara Server Component hai. Iska kaam URL se selected filters lena, database query run karna aur results display karna hai.

export default async function ProductsPage({
  searchParams, //its a in-built props. server component mai ? k baad jitne hoge utne ko lekr ayega
}: {
  searchParams: Promise<{
    category?: string;
    maxPrice?: string;
    Instock?: string;
    //URL search parameters hamesha strings hote hain.
  }>;
}) {
  const { category, maxPrice, Instock } = await searchParams;
  //Yahan destructuring se object ki properties alag variables mein nikaal rahe hain.
  const isInStock = Instock === "true";
  //URL se inStock string aata hai, lekin checkbox filter ko decide karne ke liye hum boolean condition banate hain.

  const [products, categories] = await Promise.all([
    db.orm.public.Product.where((p) =>
      // const products = await db.orm.public.Product.where((p) =>
      and(
        //add means all condition
        category ? p.category.some({ name: category }) : all(), // all returns whole array
        maxPrice ? p.price.lte(Number(maxPrice)) : all(),
        isInStock ? p.inStock.eq(true) : all(),
      ),
    )
      .orderBy((p) => p.createdAt.desc())
      .all(), //Query execute karke matching products ki list return karta hai.

    db.orm.public.Category.orderBy((c) => c.name.asc()).all(),
  ]);

  //no data received -
  //   const products = await db.orm.public.Product.orderBy((product) =>
  //     product.createdAt.desc(),
  //   ).where({categoryId:3}).all();

  //ye possibility bhi hoti hai jb list aye nd its empty
  // if (products.length === 0) {
  //   return <p className="p-6 text-gray-300">No products availale right now</p>;
  // }
  return (
    <div className="flex gap-6 p-6">
      <ProductFilter categories={categories.map((c) => c.name)} />
      <div className="flex-1">
        {products.length === 0 ? (
          <p className="p-6 text-gray-300">No products availale right now</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
            {products.map(({ id, name, price, imageUrl }) => (
              <ProductCard
                key={id}
                id={id}
                name={name}
                imageUrl={imageUrl}
                price={price}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
