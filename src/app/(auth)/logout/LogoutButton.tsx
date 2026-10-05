"use client";

import { logoutUser } from "./action";

export default function LogoutButton() {
  return <button onClick={logoutUser}>Logout</button>;
}
