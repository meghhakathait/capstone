"use client";

import { useActionState } from "react";
import { registerUser } from "./action";

const initialState = { error: undefined };

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );

  return (
    <form action={formAction}>
      <input name="name" placeholder="Full Name" required />
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

// useActionState is a React Hook that lets you update state with side effects using Actions.
