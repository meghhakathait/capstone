import { OrderStatus } from "@/app/lib/orders";

const STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500",
  PAID: "bg-blue-500",
  SHIPPED: "bg-green-500",
  DELIVERED: "bg-purple-500",
  CANCELLED: "bg-red-500",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    //${STYLES[status] - styles is an obj nd value come from arr
    <span className={`px-3 py-1 rounded text-xs font-medium ${STYLES[status]}`}>
      {status}
    </span>
  );
}
