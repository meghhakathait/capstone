"use server";

import { signToken } from "@/app/lib/auth";
import { db } from "@/prisma/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  //we write email to check if the user exists in the database or not. If the user exists, we will compare the password with the hashed password stored in the database. If the passwords match, we will return a success message. If the passwords do not match, we will return an error message. If the user does not exist, we will return an error message.
  const user = await db.orm.public.User.where({ email }).first();

  if (!user) {
    return { error: "User doesn't exist,please register" };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return { error: "Invalid Credentials" };
  }

  const token = signToken(user.id);  //token mai save kiya then cokkie mai 
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true, //restricts access to the cookie from client-side JavaScript, enhancing security against XSS attacks. its for server side only.
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", //ensures the cookie is only sent over HTTPS connections, protecting it from being intercepted during transmission. its for production only.
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });

//another option
//localStorage.setItem("session",token);

  redirect("/");
}

//we donot use this method in every website to check email and password separately
