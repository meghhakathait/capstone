export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const; //by using const we made it ready only we cannot chnge values in any case

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
    //agr value kisii se nhi match ho gyi 
  return ORDER_STATUSES.some((status) => status === value);
}

//so kiuki multiple values aa skti hai isliye OrderStatus[]
//ALLOWED_TRANSITIONS means agla step kya hoga - that's why we left empty after delivered nd cancelled bcoz agla step kuch nhi hoga
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

// ye vala part sirf errors se bachne k liye kiya hai taki vha pr hum vha kuch gkti se bhi kuch or value na likhde
