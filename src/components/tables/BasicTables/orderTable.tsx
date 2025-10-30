import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../api";
import toast from "react-hot-toast";
import axios from "axios";

interface Order {
  _id: string;
  cartItems: {
    productId: {
      name: string;
      image?: string;
      price: number;
    };
    qty: number;
  }[];
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
}

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/orders");
        if (data?.success) {
          setLoading(false);
          setOrders(data.orders);
        }
      } catch (error: unknown) {
        setLoading(false);
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Products
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Quantity
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {orders.map((order) => (
              <TableRow key={order._id}>
                {/* Products */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex flex-col gap-1">
                    {order.cartItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}${
                            item.productId?.image
                          }`}
                          alt={item.productId?.name}
                          className="size-16 rounded"
                        />
                        <span>{item.productId?.name}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>

                {/* Quantities */}
                <TableCell className="px-4  py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.cartItems.map((item, i) => (
                    <div
                      className="h-16 flex justify-start items-center"
                      key={i}
                    >
                      {item.qty}
                    </div>
                  ))}
                </TableCell>

                {/* Payment Status */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  ${order.totalAmount.toFixed(2)}
                </TableCell>

                {/* Date */}
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
