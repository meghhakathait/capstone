import Link from "next/link";
import { getCurrentUser } from "./lib/session";
import LogoutButton from "./(auth)/logout/LogoutButton";
import { Heart, ShoppingBag, User, User2 } from "lucide-react";
import CategoryNav from "@/components/CategoryNav";
import SearchBar from "@/components/SearchBar";
import { getCartCount } from "./lib/cart";

export default async function Header() {
  const user = await getCurrentUser();
  const cartCount = user ? await getCartCount(user.id) : 0;
  console.log(user);
  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className=" p-5 px-40 flex items-center justify-between text-teal-900 border-b border-gray-300 pb-4">
        <div>
          <Link href="/" className="text-3xl font-display text-red-600">
            MyStore
          </Link>
        </div>

        <div className="flex gap-15 font-sarif font-semibold">
          <Link href="/">Home</Link>

          <div className="relative group">
            <Link href="/products" className="flex gap-1">
              Product
            </Link>

            <div className="absolute hidden bg-white p-2 shadow-lg group-hover:flex gap-15 min-w-xl">
              <div>
                {/* <CategoryNav name="Electronics" /> */}
                <Link
                  href="/categories/electronics"
                  className="font-bold text-red-600 pl-3"
                >
                  Electronics
                </Link>
                <div className="flex flex-col font-mono">
                  <Link
                    href="/categories/electronics/smartphone"
                    className=" px-3 py-2 hover:bg-gray-100"
                  >
                    Smartphone
                  </Link>
                  <Link
                    href="/products/electronics/smartwatch"
                    className=" px-3 py-2 hover:bg-gray-100"
                  >
                    Smartwatch
                  </Link>
                  <Link
                    href="/products/electronics/bluetooth-speaker"
                    className=" px-3 py-2 hover:bg-gray-100"
                  >
                    Bluetooth Speaker
                  </Link>
                  <Link
                    href="/products/electronics/laptop"
                    className=" px-3 py-2 hover:bg-gray-100"
                  >
                    Laptop
                  </Link>
                </div>
              </div>

              <div>
                <Link
                  href="/categories/apparel"
                  className="font-bold text-red-600 pl-3"
                >
                  Apparel
                </Link>
                <div className="flex flex-col">
                  <Link
                    href="/products/apparel/classic-t-shirt"
                    className=" px-3 py-2 hover:bg-gray-100"
                  >
                    Classic T-Shirt
                  </Link>
                  <Link
                    href="/products/apparel/denim-jacket"
                    className=" px-3 py-2 hover:bg-gray-100"
                  >
                    Denim Jacket
                  </Link>
                  <Link
                    href="/products/apparel/slim-fit-jeans"
                    className=" px-3 py-2 hover:bg-gray-100"
                  >
                    Slim Fit Jeans
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/cart">
            Cart{" "}
            <span className="py-1 px-2 rounded-full bg-amber-400 text-black">
              {cartCount}
            </span>
          </Link>
        </div>

        <SearchBar />
        <div className="flex gap-6">
          {user ? (
            <>
              <Link href="/orders">My Orders</Link>
              <span>Welcome, {user.name}</span>
              <Link href="/profile">
                Profile
                {/* <User2 />{" "} */}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login">
              <User /> Login
            </Link>
          )}
          <Link href="/register">
            <User /> Register
          </Link>
          <Link href="/wishlist">
            <Heart />
            Wishlist
          </Link>
          <Link href="/bag">
            <ShoppingBag />
            Bag
          </Link>
        </div>
      </nav>
    </header>
  );
}
