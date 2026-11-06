"use server";
//page pr chnge hoga thats why we make server actions

import { db } from "@/prisma/db";
import { requireAuth } from "../lib/session";
import { getOrCreateCart, MAX_QUANTITY } from "../lib/cart";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: number) {
  // product id humko milri hai click krne pr already
  const user = await requireAuth(); // check user login

  const product = await db.orm.public.Product.first({ id: productId }); //get product

  if (!product || !product.inStock) return; //check product availbility

  const cart = await getOrCreateCart(user.id); // get user's cart

  //now we can get user's data by userId from cart table and cart data by cartId from cartItem table.

  // read then write
  //
  await db.transaction(async (tx) => {
    //multiple kaam single query se krna hai then we use transaction

    //first we run get request
    const existing = await tx.orm.public.CartItem.where({
      //check product phle se to nhi hai
      cartId: cart.id,
      productId,
    }).first(); // we send cartId and productId

    if (existing) {
      await tx.orm.public.CartItem.where({ id: existing.id }).update({
        quantity: existing.quantity + 1,
      }); //if existing data added
    } else {
      await tx.orm.public.CartItem.create({
        cartId: cart.id,
        productId,
        quantity: 1,
      }); //if product added first time then add it to cartItem
    }
  });
  revalidatePath("/", "layout"); // to refresh the page
}

export async function removeFromCart(cartItemId: number) {
  const user = await requireAuth();
  const cart = await getOrCreateCart(user.id);

  await db.orm.public.CartItem.where({
    id: cartItemId,
    cartId: cart.id,
  }).delete();
  revalidatePath("/", "layout");
}

//plus one krte hi database mai save kerege thats why action pr bana rhe hai
// changeQuantity(1, -1)
export async function changeQuantity(cartItemId: number, changeVal: 1 | -1) {
  const user = await requireAuth();
  const cart = await getOrCreateCart(user.id);

  // we want to get the item and also update the item that's why we use transaction
  await db.transaction(async (tx) => {
    const item = await tx.orm.public.CartItem.where({
      id: cartItemId,
      cartId: cart.id,
    }).first();

    if (!item) return;
    const next = item.quantity + changeVal;
    if (next <= 0) {
      await tx.orm.public.CartItem.where({ id: item.id }).delete();
    } else if (next <= MAX_QUANTITY) {
      await tx.orm.public.CartItem.where({ id: item.id }).update({
        quantity: next,
      });
    }
  });
  revalidatePath("/", "layout");
}

export async function clearCart() {
  //user ara hai then user se uska cart ara hai nd 
  const user = await requireAuth();
  const cart = await getOrCreateCart(user.id);
  await db.orm.public.CartItem.where({ cartId: cart.id }).deleteAndCount(); //hame uneccessary data nhi chaiye hai isliye deleteAndCount use kiya hai agr pura obj chahiye to deleteAll use krte
  revalidatePath("/", "layout");
}
