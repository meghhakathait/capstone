"use server";
import { db } from "@/prisma/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerUser(
  prevState:{error?: string}, //we use useActionState hook that takes two arguments, the first is the action function and the second is the initial state. The initial state is an object that can have any properties you want. In this case, we are using an object with an optional error property of type string.
  formdata: FormData,
): Promise<{ error?: string }> {
  //Function ek Promise return karega, aur Promise ke andar ek object hoga jisme optional error property hogi, aur wo string type ki hogi.
  const name = formdata.get("name") as string; //get method to take value from input
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const existingUser = await db.orm.public.User.where({ email }).first();
  if (existingUser) {
    //existing to nhi hai user check krne k liye
    // throw new Error("An account with this email is already registered");
    return { error: "An account with this email is already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10); // plaintext ko incrypt krna nd then match krna true hai ya false

  await db.orm.public.User.create({
    name,
    email,
    password: hashedPassword,
  });

  const newUser = await db.orm.public.User.where({ email }).first();
  if (newUser) {
    await db.orm.public.Cart.create({ userId: newUser.id });
    await db.orm.public.Wishlist.create({ userId: newUser.id });
  }

  //create where and all ye hame prisma provide kr rha hai
  redirect("/login");
}
