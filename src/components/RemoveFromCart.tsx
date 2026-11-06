"use client";

import { useFormStatus } from "react-dom";

export default function RemoveFromCart() {
  const { pending } = useFormStatus();
  return (
    <button className="bg-yellow-400 px-8 py-2 disabled:opacity-40">
      Remove To Cart
    </button>
  );
}
