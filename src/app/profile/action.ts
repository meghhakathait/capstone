"use server";

import { db } from "@/prisma/db";
import { requireAuth } from "../lib/session";
import { revalidatePath } from "next/cache";
import { Layout } from "lucide-react";
import bcrypt from "bcrypt";
import { match } from "assert";

type FormState = { error?: string; message?: string };

export async function updateProfile(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAuth();
  //use as a string
  const name = formData.get("name") as string;

  if (name.length < 2 || name.length > 80) {
    return { error: "Name must be between 2 and 80 characters" };
  }

  await db.orm.public.User.where({ id: user.id }).update({ name });
  revalidatePath("/", "layout");
  return { message: "Profile Updated" };
}
// to chnge password
export async function changePassword(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAuth();
  // convert it into string
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "New password must be atleast 8 characters" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "The new passwords do not match" };
  }

  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) {
    return { error: "Current password is incorrect" };
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.orm.public.User.where({ id: user.id }).update({ password: hashed });

  return { message: "Password Changed" };
}

export async function deleteAddress(addressId: number) {
  const user = await requireAuth();
  // where addresId and userId both match delete that
  await db.orm.public.Address.where({
    id: addressId,
    userId: user.id,
  }).delete();
  revalidatePath("/profile");
  revalidatePath("/checkout");
}
