
export const PAYMENT_METHODS = ["CASH_ON_DELIVERY", "UPI", "CARD"] as const; // this will make the array read only and we cannot assign any other value also .0 ="CASH_ONDELIVERY"

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// Record mai key:value aate hai jo humne uper define kr diya hai
export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  UPI: "UPI",
  CARD: "Credit/Debit Card",
};

//type hamara strictly match hona chahiye
//value paymentMethod hai ya nhi
export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return (
    typeof value === "string" &&
    PAYMENT_METHODS.includes(value as PaymentMethod) //
  );
}

export type CheckoutParseResult =
  | { ok: false; error: string }
  | { ok: true; addressId: number; paymentMethod: PaymentMethod };

export function parseCheckoutForm(formData: FormData): CheckoutParseResult {
  const addressId = Number(formData.get("addressId"));
  const paymentMethod = formData.get("paymentMethod");
  // ye hum direct string value pass kr rhe hai but hame check krna hai ye check hokr aari hai function se ki nhi

  if (!Number.isInteger(addressId) || addressId <= 0) {
    return { ok: false, error: "Please choose a delivery address" };
  }
  if (!isPaymentMethod(paymentMethod)) {
    return { ok: false, error: "Please select a payment method" };
  }
  return { ok: true, addressId, paymentMethod };
}
