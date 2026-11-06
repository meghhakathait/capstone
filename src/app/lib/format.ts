interface Address {
  id: number;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
  //toLocaleString - india k hisab se amount to manage krega
}

export function formatAddress(a: Address): string {
  return `${a.fullName},${a.line1},{a.line2},${a.city},${a.state},${a.postalCode},Phone: ${a.phone}`;
}
