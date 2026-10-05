"use client";

import { useActionState } from "react";
import { loginUser } from "./action";

const initialState = { error: undefined };
export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState,
  );
  return (
    <form action={formAction}>
      {/* The form action is set to the formAction returned by useActionState,
      which will handle the form submission and update the state accordingly. */}
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
