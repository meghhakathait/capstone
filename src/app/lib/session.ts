import { verify } from "crypto";
import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { db } from "@/prisma/db";

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
