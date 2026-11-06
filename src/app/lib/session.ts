import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { db } from "@/prisma/db";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  //cookies url k sth hi hota hai nd local bhi
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value; //cookies mai jo mai get kiya
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await db.orm.public.User.where({ id: payload.userId }).first();
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

//uper vala func hame user return karega ghumko check krna hai user ka role kya hai
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}
