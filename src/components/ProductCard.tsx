"use client";
import { formatPrice } from "@/app/lib/format";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
}
export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  description,
}: ProductCardProps) {
  return (
    <>
      <Link
        key={id}
        href={`/products/${id}`}
        className="border rounded-lg p-4 bg-gray-500"
      >
        <Image
          src={imageUrl}
          alt={name}
          width={200}
          height={300}
          className="rounded-md object-cover w-full"
        />
        <h3 className="mt-2 font-semibold text-lg">{name}</h3>
        <p className="text-gray-200">{formatPrice(price)}</p>
      </Link>
    </>
  );
}
