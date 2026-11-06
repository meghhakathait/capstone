import { db } from "@/prisma/db";
import {
  calculateTotal,
  getCartItems,
  getOrCreateCart,
  MAX_QUANTITY,
} from "../lib/cart";
import { requireAuth } from "../lib/session";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { changeQuantity, clearCart, removeFromCart } from "./action";
import RemoveFromCart from "@/components/RemoveFromCart";

import Link from "next/link";

export default async function CartPage() {
  const user = await requireAuth();

  // we make a common func to get cartitem so that  we can use it in multiplepages
  // const cart = await getOrCreateCart(user.id);

  //first we get user by userid then we get cartitem of that user
  // const items = await db.orm.public.CartItem.include("product")
  //   .where({
  //     cartId: cart.id,
  //   })
  //   .orderBy((i) => i.id.asc())
  //   .all();

  const { items } = await getCartItems(user.id);

  if (items.length === 0) {
    return (
      <div className="p-4">
        <p>Your Cart is empty</p>
        <Link href="/products">Browse Products</Link>
      </div>
    );
  }

  // const total = items.reduce(
  //   (sum, item) => sum + item.product.price * item.quantity,
  //   0,
  // );

  const total = calculateTotal(items);
  const hasUnavailable = items.some((item) => !item.product.inStock);

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Your Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div>
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                width={200}
                height={200}
              />
              <h3 className="text-2xl font-semibold">{item.product.name}</h3>
              {!item.product.inStock && (
                <p>The item is out of stock - remove it to chekcout</p>
              )}
              <p>
                {item.product.price} x {item.quantity}
              </p>
              <div className="flex items-center gap-3">
                <form action={changeQuantity.bind(null, item.id, -1)}>
                  <button>-</button>
                </form>
                <span>{item.quantity}</span>
                <form action={changeQuantity.bind(null, item.id, +1)}>
                  <button disabled={item.quantity >= MAX_QUANTITY}>+</button>
                </form>
              </div>
            </div>
            {/* cart se remove krne k liye item ki id chahiye hoti hai nd product add krte hue product ki id chahiye hoti hai */}
            <form action={removeFromCart.bind(null, item.id)}>
              <RemoveFromCart />
              {/* <button type="submit">Remove</button> */}
            </form>
          </div>
        ))}
      </div>
      <p className="text-xl font-bold">total:${total.toFixed(2)}</p>

      <form action={clearCart}>
        <button>Clear Cart</button>
      </form>
      {hasUnavailable ? (
        <p> Remove Unavailable items to continue</p>
      ) : (
        <Link href="/checkout">Proceed to Checkout</Link>
      )}
    </div>
  );
}
