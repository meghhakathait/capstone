import { addToCart } from "@/app/cart/action";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import { db } from "@/prisma/db";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

//to get single value in a different PAGE we have to get value from the url

//we pass id nd the function get data from the DB
async function getProduct(id: string) {
  return db.orm.public.Product.include("category") //jb koi or table sedata include kerana hai jo relation mai already hai current table k sath
    .where({ id: Number(id) })
    .first(); // first returns the object ({id:1, name:"tshirt"}) or null..not the whole arr of obj
}

async function getRelatedProducts(
  categoryId: number | undefined,
  excludedId: number | undefined,
) {
  if (excludedId)
    return db.orm.public.Product.where({ categoryId }) // within obj if we see single value means property nd value both same
      .where((p) => p.id.neq(excludedId))
      .limit(5)
      .all();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  //predefined
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

//url se jo id milri uss basis se database se get krna ha
export default async function ProductDetailsPage({
  params, //after slash we can get all value from the url with using inbluit property params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // destructing
  const product = await getProduct(id); // we pass the id (using params) it to getProduct function
  const realtedProducts = await getRelatedProducts(
    product?.categoryId,
    product?.id,
  );

  if (!product) {
    notFound();
  } // if product not found  nd if we found then below code will run
  // we are showing the err

  return (
    <div className="flex flex-col">
      <div className="grid md:grid-cols-3 gap-8 p-6">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-lg object cover"
        />
        <div>
          <p className="text-sm text-gray-400">{product.category.name}</p>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          <p className="text-xl text-gray-300 mt-2">{product.price}</p>
          <p className=" mt-4">{product.description}</p>
          <p>
            {product.inStock ? (
              <span>In Stock</span>
            ) : (
              <span>Out of Stock</span>
            )}
          </p>
          <div className="flex">
            {/* With this approach, you write the Server Action function, and Next.js handles the communication between the browser and server. You don't manually write a fetch() URL or create a separate API route just for this action. btn needs an endpoint URL  */}

            <button className="bg-pink-400 px-8 py-2">Add to Wishlist</button>

            {/* when we want to use pending property nd also hum server se kr rhe hai sb..if we use api then button se ho jata just how we do in react */}
            {/* server prhi action hona hai ..hum data to bhej hi rhe hai isliye form use kiya but hum koi data ni bhejre input verg ause krke..hum phle null rakhre hai ki data kuch nhi hona chahiye jo hum param pass kr rhe vhi ho */}
            <form action={addToCart.bind(null, product.id)}>
              <AddToCartButton disabled={!product.inStock} />
            </form>
            {/* <div className="flex">
              <button
                disabled={!product.inStock}
                className="bg-amber-200 px-8 py-2 disabled:opacity-40"
              >
                Add To Cart
              </button>
            </div> */}
          </div>
        </div>
      </div>
      {realtedProducts && realtedProducts?.length > 0 && (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">You may also like</h2>
          <div className="grid grid-cols2 md:grid-cols-4 gap-6">
            {realtedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                imageUrl={p.imageUrl}
                price={p.price}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
