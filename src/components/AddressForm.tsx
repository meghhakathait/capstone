"use client";

import { addAddress } from "@/app/checkout/action";
import { useActionState } from "react";

// const initialState = { error: undefined };

export default function AddressForm() {
  const [state, formAction, pending] = useActionState(addAddress, {});
  return(
  <form action={formAction} className="py-4">
    <h3>Add a new address</h3>
    <div className="mb-3">
      <input type="text" name="fullName" placeholder="Full Name" required />
    </div>
    <div className="mb-3">
      <input type="text" name="line1" placeholder="line 1" required />
    </div>
    <div className="mb-3">
      <input type="text" name="line2" placeholder="line 2" />
    </div>
    {/* for city we can use library of next */}
    <div className="mb-3">
      <input type="text" name="city" placeholder="City" required />
    </div>
    
    <div className="mb-3">
      <input type="text" name="state" placeholder="State" required />
    </div>
    <div className="mb-3">
      <input
        type="number"
        name="postalCode"
        placeholder="Postal Code"
        required
      />
    </div>
    <div className="mb-3">
      <input type="number" name="phone" placeholder="Phone" required />
    </div>

    {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Adress"}
    </button>
  </form>)
}
