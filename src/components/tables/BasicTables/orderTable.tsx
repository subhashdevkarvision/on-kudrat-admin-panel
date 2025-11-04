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
import PaginationComponent from "../../paginationComponent/PaginationComponent";

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchOrders = async (currentPage: number) => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/orders?page=${currentPage}&limit=10`
        );
        if (data?.success) {
          setLoading(false);
          setOrders(data.orders);
          setTotalPages(data.pagination.pages);
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
    fetchOrders(currentPage);
  }, [currentPage]);
  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto ">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader={true}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Image
                </TableCell>
                <TableCell
                  isHeader={true}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader={true}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Quantity
                </TableCell>
                <TableCell
                  isHeader={true}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User Name
                </TableCell>
                <TableCell
                  isHeader={true}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User Email
                </TableCell>

                <TableCell
                  isHeader={true}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader={true}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total
                </TableCell>
                <TableCell
                  isHeader={true}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    {/* Products */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-col gap-1">
                        {order.cartItems.map((item, i) => (
                          <img
                            key={i}
                            src={`${import.meta.env.VITE_BACKEND_URL}${
                              item.productId?.image
                            }`}
                            alt={item.productId?.name}
                            className="size-16 rounded"
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="px-4  py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {order.cartItems.map((item, i) => (
                        <div
                          key={i}
                          className="h-16 flex justify-start items-center"
                        >
                          {item?.productId?.name}
                        </div>
                      ))}
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

                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.userId?.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.userId?.email}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-5">
                    No order found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {orders.length > 0 && (
          <div className="my-5">
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          </div>
        )}
      </div>
    </>
  );
}
