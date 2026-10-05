import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET as string;
// interface User {
//   userId: number;
// }
export function signToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
} //iss funct se token banate hai

export function verifyToken(token: string): { userId: number } | null { //we can use interface also
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number }; 
  } catch {
    return null;
  } //iss func se token match krte hai
  //we use trycatch to handle the case where the token is invalid or expired. If the token is valid, we return the decoded payload which contains the userId. If it's invalid, we return null.
}


//localstorage vs sessionstorage vs cookies