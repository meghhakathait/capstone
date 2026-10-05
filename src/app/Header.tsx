import Link from "next/link";
import { getCurrentUser } from "./lib/session";
import LogoutButton from "./(auth)/logout/LogoutButton";

export default async function Header() {
  const user = await getCurrentUser();
  console.log(user);
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/products">Product</Link>

        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Link href="/profile">Profile</Link>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
