import { db } from "@/prisma/db";
import { isOrderStatus, ORDER_STATUSES } from "../lib/orders";
import { requireAuth } from "../lib/session";
import { all, and } from "@prisma/orm-postgres/orm-client";
import Link from "next/link";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { formatPrice } from "../lib/format";

const PAGE_SIZE = 3;
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; before?: string }>;
}) {
  const user = await requireAuth();
  const { status, before } = await searchParams;

  const statusFilter = isOrderStatus(status) ? status : null;
  //we chnge in num becoz url se str ayega
  const beforeNumber = Number(before);
  const cursor =
    Number.isInteger(beforeNumber) && beforeNumber > 0 ? beforeNumber : null;

  const rows = await db.orm.public.Order.where({ userId: user.id })
    //filter kiya hai statusFilder nd second cursor se
    .where((o) =>
      and(
        statusFilter ? o.status.eq(statusFilter) : all(),
        cursor ? o.id.lt(cursor) : all(),
      ),
    )
    //item include krke uska count return kr diya
    .include("orderItems", (items) => items.count()) // we can use count() func directly with the arr
    .orderBy((o) => o.id.desc())
    .limit(PAGE_SIZE + 1) // +1 bcoz agla page hai ya nhi check krne k liye
    .all();

  const hasMore = rows.length > PAGE_SIZE;
  const orders = rows.slice(0, PAGE_SIZE);
  const { totalOrders } = await db.orm.public.Order.where({
    userId: user.id,
  }).aggregate((o) => ({ totalOrders: o.count() }));
  // we need only count in this that's why we use aggregate instead of count() func directly with the arr

  // URLSearchParams() - ye built-in hame url bana k deta hai -  status=PENDING&before=4 
  const nextParams = new URLSearchParams();
  //if statusFilter milta hai 
  if (statusFilter) nextParams.set("status", statusFilter);
  // if orders.length
  if (orders.length > 0)
    nextParams.set("before", String(orders[orders.length - 1].id));

  return (
    <div className="space-y-4 px-6">
      <h1>My Orders</h1>
      <p>
        {totalOrders} order{totalOrders === 1 ? "" : "s"} in total
      </p>
      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/orders"
          className={`px-3 py-1 rounded border ${statusFilter === null ? "bg-amber-400" : ""}`}
        >
          All
        </Link>
        {/* URL = /orders?status=Paid */}
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/orders?status=${s}`}
            className={`px-3 py-1 rounded border ${statusFilter === s ? "bg-amber-400" : ""}`}
          >
            {s}
          </Link>
        ))}
      </div>
      {orders.length === 0 ? (
        <p>
          {statusFilter
            ? `No orders with ${statusFilter.toLocaleLowerCase()} status`
            : "You haven't placed any orders yet"}{" "}
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`}>
                <div>
                  <p>Order #{o.id}</p>
                  <p>
                    {o.createdAt} - {o.orderItems} item{" "}
                  </p>
                </div>
                <div className="space-y-3">
                  <OrderStatusBadge status={o.status} />
                  <p>Total: {formatPrice(o.total)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {/* nextParams={status = PENDING&before=3} */}
      {hasMore && (
        //convert it into string
        <Link href={`/orders?${nextParams.toString()}`}>Older orders</Link>
      )}
    </div>
  );
}
