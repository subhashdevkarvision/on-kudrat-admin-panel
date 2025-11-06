import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../api";
import { SquarePen, Trash2Icon } from "lucide-react";
import { Modal } from "../components/ui/modal";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import PaginationComponent from "../components/paginationComponent/PaginationComponent";
export interface Category {
  _id: string;
  name: string;
}
export default function CategoryPage() {
  const [category, setCategory] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [limit, setLimit] = useState(5);

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    categoryId?: string;
    categoryName?: string;
  }>({ open: false });
  const handleSaveCategory = async () => {
    try {
      if (!categoryName.trim()) {
        setError("Please enter a category name");
        console.log(error);
        return;
      }
      if (editingCategory) {
        const { data } = await axiosInstance.put(
          `/category/${editingCategory._id}`,
          { name: categoryName }
        );
        if (data.success) {
          toast.success("Category updated successfully");
          fetchCategory(currentPage);
          // setCategory((prev) =>
          //   prev.map((cat) =>
          //     cat._id === editingCategory._id ? data.data : cat
          //   )
          // );
        }
      } else {
        const { data } = await axiosInstance.post("/category", {
          name: categoryName,
        });
        if (data.success) {
          toast.success("Category added successfully");
          // setCategory([...category, data.data]);
          fetchCategory(currentPage);
        }
      }

      setIsModalOpen(false);
      setCategoryName("");
      setEditingCategory(null);
      setError("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const handleDelete = async () => {
    if (!confirmDelete.categoryId) return;
    try {
      const { data } = await axiosInstance.delete(
        `/category/${confirmDelete.categoryId}`
      );
      if (data.success) {
        toast.success("Category deleted");
        // setCategory((prev) =>
        //   prev.filter((cat) => cat._id !== confirmDelete.categoryId)
        // );
        fetchCategory(currentPage);
        setConfirmDelete({ open: false });
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };
  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setIsModalOpen(true);
    setError("");
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setIsModalOpen(true);
    setError("");
  };

  const fetchCategory = async (currentPage: number, limitVal = limit) => {
    try {
      const { data } = await axiosInstance.get(
        `/category?page=${currentPage}&limit=${limitVal}`
      );
      if (data.success) {
        setCategory(data.data);
        setTotalPages(data.pagination.pages);
        setTotalCategories(data.pagination.total);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  useEffect(() => {
    fetchCategory(currentPage, limit);
  }, [currentPage, limit]);
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Category" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-end">
          <Button onClick={() => openAddModal()} className="">
            Add Category
          </Button>
        </div>
        <div className="overflow-hidden my-10 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Category Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {category.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {c.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                      <div className="flex gap-5 justify-end">
                        <Button
                          size="xs"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => openEditModal(c)}
                        >
                          <SquarePen color="blue" size={20} />
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          className="rounded-full"
                          onClick={() =>
                            setConfirmDelete({
                              open: true,
                              categoryId: c._id,
                              categoryName: c.name,
                            })
                          }
                        >
                          <Trash2Icon color="red" size={20} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {totalCategories > 5 && (
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            totals={totalCategories}
            limit={limit}
            onPageChange={(newPage) => setCurrentPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 m-0 w-full max-w-[500px]">
          <h2 className="text-lg font-semibold  dark:text-gray-400 mb-4">
            Add New Category
          </h2>
          <Label htmlFor="categoryName">Caterory Name</Label>
          <Input
            type="text"
            name="categoryName"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCategory(null);
                setCategoryName("");
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={confirmDelete.open}
        showCloseButton={false}
        onClose={() => setConfirmDelete({ open: false })}
      >
        <div className="p-6  w-full">
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-400">
            Delete Category
          </h2>
          <p className="text-gray-600 text-xl mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              {confirmDelete.categoryName}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete({ open: false })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
