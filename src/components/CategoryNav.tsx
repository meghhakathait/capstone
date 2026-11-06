import { db } from "@/prisma/db";
import Link from "next/link";

export default async function CategoryNav() {
  const categories = await db.orm.public.Category.include(
    "product",
    (products) => products.count(),
  )
    .orderBy((c) => c.name.asc())
    .all();

  return (
    <nav className="flex gap-4 px-6 py-2">
      {categories.map((c) => (
        <Link key={c.id} href={`/categories/${c.slug}`}>
          {c.name} ({c.product})
        </Link>
      ))}
    </nav>
  );
}
