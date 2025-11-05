import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { Order } from "../tables/BasicTables/orderTable";
import { axiosInstance } from "../../api";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/orders?limit=6`);
        if (data?.success) {
          setOrders(data.orders);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            See all
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3  text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Products
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start  text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Quantity
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-start t text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Payment Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start  text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Total Amount
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((order) => (
              <TableRow key={order._id} className="align-top">
                {/* Product Images */}
                <TableCell className="px-4 py-3  text-theme-sm text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col gap-2">
                    {order.cartItems.map((item, i) => (
                      <img
                        key={i}
                        src={`${import.meta.env.VITE_BACKEND_URL}${
                          item.productId?.image
                        }`}
                        alt={item.productId?.name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </TableCell>

                {/* Product Names */}
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col gap-2 justify-center">
                    {order.cartItems.map((item, i) => (
                      <span key={i}>{item?.productId?.name}</span>
                    ))}
                  </div>
                </TableCell>

                {/* Quantities */}
                <TableCell className="px-4 py-3  text-theme-sm text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col gap-2 justify-center">
                    {order.cartItems.map((item, i) => (
                      <span key={i}>{item.qty}</span>
                    ))}
                  </div>
                </TableCell>

                {/* Payment Status */}
                <TableCell className="px-4 py-3  text-theme-sm text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.paymentStatus === "Pending"
                        ? "warning"
                        : order.paymentStatus === "Paid"
                        ? "success"
                        : "error"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </TableCell>

                {/* Total */}
                <TableCell className="px-4 py-3  text-theme-sm text-gray-500 dark:text-gray-400">
                  ${order.totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
