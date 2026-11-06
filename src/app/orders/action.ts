"use server";

import { db } from "@/prisma/db";
import { requireAdmin, requireAuth } from "../lib/session";
import { revalidatePath } from "next/cache";
import {
  ALLOWED_TRANSITIONS,
  isOrderStatus,
  ORDER_STATUSES,
} from "../lib/orders";

export async function cancelOrder(orderId: number) {
  const user = await requireAuth();

  await db.orm.public.Order.where({
    id: orderId,
    userId: user.id,
    status: "PENDING",
  }).update({ status: "CANCELLED" });
  revalidatePath(`/orders/${orderId}`);
}

export async function updateOrderStatus(orderId: number, formData: FormData) {
  await requireAdmin();
  const next = formData.get("status");
  if (!isOrderStatus(next)) return;

  //if value is valid
  const order = await db.orm.public.Order.where({ id: orderId }).first();
  if (!order) return;

  //jo bhi server se aya status then hum check krege ki humne kya dala paid cancelled etc.
  if (!ALLOWED_TRANSITIONS[order.status].includes(next)) return;
  await db.orm.public.Order.where({ id: orderId }).update({ status: next });
  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);
}
