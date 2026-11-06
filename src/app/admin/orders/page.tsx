import { ALLOWED_TRANSITIONS } from "@/app/lib/orders";
import { requireAdmin, requireAuth } from "@/app/lib/session";
import { updateOrderStatus } from "@/app/orders/action";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { db } from "@/prisma/db";
import Link from "next/link";

export default async function adminOrderPage() {
  await requireAdmin();

  const orders = await db.orm.public.Order.include("user")
    .orderBy((o) => o.createdAt.desc())
    .limit(50)
    .all();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All orders</h1>
      <table>
        <thead>
          <tr>
            <th className="py-2">Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const nextOptions = ALLOWED_TRANSITIONS[order.status];
            return (
              <tr key={order.id}>
                <td>
                  <Link href={`/orders/${order.id}`}>#{order.id}</Link>
                </td>
                <td>{order.user.name}</td>
                <td>{order.createdAt}</td>
                <td>{order.total}</td>
                <td>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td>
                  {nextOptions.length === 0 ? (
                    <span>---</span>
                  ) : (
                    <form action={updateOrderStatus.bind(null, order.id)}>
                      <select name="status">
                        {nextOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button type="submit">Save</button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
