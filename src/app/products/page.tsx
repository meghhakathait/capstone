import { db } from "@/prisma/db";
import Image from "next/image";
import Link from "next/link";

export default async function () {
  const products = await db.orm.public.Product.orderBy((product) =>
    product.createdAt.desc(),
  ).all();

  //no data received -
  //   const products = await db.orm.public.Product.orderBy((product) =>
  //     product.createdAt.desc(),
  //   ).where({categoryId:3}).all();

  //ye possibility bhi hoti hai jb list aye nd its empty
  if (products.length === 0) {
    return <p className="p-6 text-gray-300">No products availale right now</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="border rounded-lg p-4 bg-gray-500"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={200}
            height={300}
            className="rounded-md object-cover w-full"
          />
          <h3 className="mt-2 font-semibold text-lg">{product.name}</h3>
          <p className="text-gray-200">₹{product.price}</p>
        </Link>
      ))}
    </div>
  );
}
