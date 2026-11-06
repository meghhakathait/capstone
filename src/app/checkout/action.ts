"use server";
import { db } from "@/prisma/db";
import { requireAuth } from "../lib/session";
import { revalidatePath } from "next/cache";
import { calculateTotal, getCartItems } from "../lib/cart";
import { formatAddress } from "../lib/format";
import { parseCheckoutForm } from "../lib/checkout";
import { redirect } from "next/navigation";

//yha hum form k through data bhejege isliye prevState nd formData use kr rhe hai
export async function addAddress(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const user = await requireAuth();
  const field = (name: string) => String(formData.get(name) ?? "").trim();

  const fullName = field("fullName");
  const line1 = field("line1");
  const line2 = field("line2");
  const city = field("city");
  const state = field("state");
  const postalCode = field("postalCode");
  const phone = field("phone");
  const postalRegex = /^[1-9]\d{2}\d{3}$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!fullName || !line1 || !city || !state) {
    return { error: "Please fill in every address field" };
  }

  //regular expression for postal code - we can find it online
  if (!postalRegex.test(postalCode)) {
    return { error: "PIN code must be exactly 6 digits" };
  }

  if (!phoneRegex.test(phone)) {
    return { error: "Phone number must be exactly 10 digits" };
  }

  await db.orm.public.Address.create({
    userId: user.id,
    fullName,
    line1,
    line2,
    city,
    state,
    postalCode,
    phone,
  });
  revalidatePath("/checkout");
  return {};
}

export async function placeOrder(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string; message?: string }> {
  const user = await requireAuth();
  // const addressId = Number(formData.get("addressId"));
  // const paymentMethodType = formData.get("paymentMethod");

  // if (!Number.isInteger(addressId) || addressId <= 0) {
  //   return { error: "Please choose a delivery address" };
  // }
  // if (!paymentMethodType) {
  //   return { error: "Please select a payment method" };
  // }

  //parseCheckoutForm is function se check hokr ayega nd input mai save ho jayega
  const input = parseCheckoutForm(formData);
  if (!input.ok) {
    return { error: input.error };
  }

  const address = await db.orm.public.Address.where({
    id: input.addressId,
    userId: user.id,
  }).first();

  if (!address) {
    return { error: "Please choose a valid delivery address" };
  }

  const { cart, items } = await getCartItems(user.id);

  if (items.length === 0) {
    return { error: "your cart is empty" };
  }

  const unavailable = items.find((item) => !item.product.inStock);
  if (unavailable) {
    return { error: `${unavailable.product.name} is out of stock` };
  }

  const total = calculateTotal(items);
  const addressText = formatAddress(address);

  const status =
    input.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID";

  let orderId = 0;
  await db.transaction(async (tx) => {
    const order = await tx.orm.public.Order.create({
      userId: user.id,
      total,
      status,
      addressText,
      paymentMethod: input.paymentMethod, //ye ab verify hokr aara hai
    });

    await tx.orm.public.OrderItem.createAll(
      items.map((item) => ({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    );
    //delete items from the cart
    await tx.orm.public.CartItem.where({ cartId: cart.id }).deleteAndCount();
    orderId = order.id;
  });

  revalidatePath("/", "layout");
  redirect(`/orders/${orderId}`);

  // return { message: "Valid payment and address selected" };
}
