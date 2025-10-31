import { useEffect, useState } from "react";
import { axiosInstance } from "../../api";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { SquarePen, Trash2Icon } from "lucide-react";

export default function ProductTable() {
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/product?limit=15");
        if (data?.success) {
          setLoading(false);
          setProducts(data.products);
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
                isHeader={true}
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Products
              </TableCell>
              <TableCell
                isHeader={true}
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                MRP
              </TableCell>
              <TableCell
                isHeader={true}
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Products?.length > 0 ? (
              Products.map((product) => (
                <TableRow key={product._id}>
                  {/* Products */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-10">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}${
                            product.image
                          }`}
                          alt={product.name}
                          className="size-32 rounded"
                        />
                        <span>{product.name}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Quantities */}
                  <TableCell className="px-4  py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.price}
                  </TableCell>

                  {/* Payment Status */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.discountedPrice}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-5">
                      <Button
                        size="xs"
                        variant="outline"
                        className="rounded-full"
                        // onClick={() => openEditModal(c)}
                      >
                        <SquarePen color="blue" size={20} />
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        className="rounded-full"
                        // onClick={() =>
                        //   setConfirmDelete({
                        //     open: true,
                        //     categoryId: c._id,
                        //     categoryName: c.name,
                        //   })
                        // }
                      >
                        <Trash2Icon color="red" size={20} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-5">
                  No Product found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
