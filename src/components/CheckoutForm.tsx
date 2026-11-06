// we make it form bcoz hame submit verga bhi krna hai
"use client";
import { placeOrder } from "@/app/checkout/action";
import { PAYMENT_LABELS, PAYMENT_METHODS } from "@/app/lib/checkout";
import { useActionState } from "react";

interface AddressOptionPros {
  id: number;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export default function CheckoutForm({
  addresses,
}: {
  addresses: AddressOptionPros[];
}) {
  //intialstate ki need nhi hai becoz input se value aahi rhi hai
  const [state, formAction, pending] = useActionState(placeOrder, {});
  return (
    <form action={formAction} className="border rounded p-4 space-y-4">
      {/* Group related elements in a form: */}
      <fieldset>
        {/* The <legend> tag defines a caption for the <fieldset> element. */}
        <legend>
          Delivery Address
          {addresses.length === 0 && (
            <p>no addresses found. please add an address</p>
          )}
          {addresses.map((a, index) => (
            <label key={a.id} className="flex gap-2 items-start py-1">
              <input
                type="radio"
                name="addressId"
                value={a.id}
                defaultChecked={index === 0}
              />
              <span className="text-sm">
                {a.fullName},{a.line1},{a.line2},{a.city},{a.state},
                {a.postalCode},{a.phone}{" "}
              </span>
            </label>
          ))}
        </legend>
      </fieldset>

      <fieldset>
        <legend>Pyment method</legend>
        {PAYMENT_METHODS.map((method, index) => (
          <label key={method} className="flex gap-2 py-1">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              defaultChecked={index === 0}
            />
            {/* when we want to access obj dynamic value coming from a variable then we use square brackets..vrna direct . laga k we can access */}
            <span className="text-sm">{PAYMENT_LABELS[method]}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        {state?.error && <p>{state.error}</p>}
        {state?.message && <p>{state.message}</p>}
        <button disabled={pending || addresses.length === 0} type="submit">
          {pending ? "Placing Order" : "Place order"}
        </button>
      </fieldset>
    </form>

    // <div>
    //   {addresses.length === 0 && (
    //     <p>no addresses found. please add an address</p>
    //   )}
    //   {addresses.map((address) => {
    //     return (
    //       <div key={address.id}>
    //         <p>{address.fullName}</p>
    //         <p>{address.line1}</p>
    //         <p>{address.line2}</p>
    //         <p>{address.city}</p>
    //         <p>{address.state}</p>
    //         <p>{address.postalCode}</p>
    //         <p>{address.phone}</p>
    //       </div>
    //     );
    //   })}
    // </div>
  );
}
