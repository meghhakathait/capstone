"use client";

import { updateProfile } from "@/app/profile/action";
import { useActionState } from "react";

export default function ProfileForm({
  name,
  email,
}: {
  name: string;
  email: string; //we only use it for readonly purpose
}) {
  const [state, formAction, pending] = useActionState(updateProfile, {});

  return (
    <form action={formAction} className="space-y-3">

        <label className="font-bold">Name :  </label>
        <input type="text" name="name" defaultValue={name} required />
    

      <div>
        <label className="font-bold">Email (cannot be changed) : </label>
        <input type="text" value={email} disabled readOnly />
      </div>

      {state?.error && <p>{state.error}</p>}
      {state?.message && <p>{state.message}</p>}

      <button type="submit" disabled={pending} className="font-bold text-lg" >
        {pending ? "Saving" : "Save Changes"}
      </button>
    </form>
  );
}
