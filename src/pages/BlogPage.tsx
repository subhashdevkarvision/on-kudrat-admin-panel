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
import { SquarePen, Trash2Icon } from "lucide-react";
import { axiosInstance } from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Modal } from "../components/ui/modal";
import toast from "react-hot-toast";
import PaginationComponent from "../components/paginationComponent/PaginationComponent";

interface Blog {
  _id: string;
  title: string;
  image: string;
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    id: "",
    blogTitle: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(1);

  const navigate = useNavigate();

  const fetchBlogs = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get(`/blog?page=${page}&limit=5`);
      if (data.success) {
        setBlogs(data.data);
        setTotalPages(data.pagination.pages);
        setCurrentPage(data.pagination.page);
        setTotalBlogs(data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const { id } = confirmDelete;
      const { data } = await axiosInstance.delete(`/blog/${id}`);
      if (data.success) {
        toast.success(data?.message);
        const updatedBlogs = blogs.filter((b) => b._id !== id);
        if (updatedBlogs.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchBlogs(currentPage);
        }
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
    } finally {
      setConfirmDelete({ open: false, id: "", blogTitle: "" });
    }
  };
  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Blogs" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-end">
          <Button className="" onClick={() => navigate("/blog/add")}>
            Add blog
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
                    Image
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Title
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Created At
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
                {blogs.length > 0 ? (
                  blogs.map((b) => (
                    <TableRow key={b._id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}${b.image}`}
                          className="size-32 rounded"
                          alt={b.title}
                        />
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-gray-500 text-theme-sm dark:text-gray-400">
                        {b.title}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-gray-500 text-theme-sm dark:text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                        <div className="flex gap-5 justify-end">
                          <Button
                            size="xs"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => navigate(`/blog/add/${b._id}`)}
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
                                id: b._id,
                                blogTitle: b.title,
                              })
                            }
                          >
                            <Trash2Icon color="red" size={20} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-5">
                      No Blogs Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-6">
          {blogs.length > 0 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              limit={5}
              totals={totalBlogs}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={confirmDelete.open}
        showCloseButton={false}
        onClose={() =>
          setConfirmDelete({
            open: false,
            id: "",
            blogTitle: "",
          })
        }
      >
        <div className="p-6 w-full max-w-[500px]">
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-400">
            Delete Blog
          </h2>
          <p className="text-gray-600 text-xl mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              {confirmDelete.blogTitle}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDelete({
                  open: false,
                  id: "",
                  blogTitle: "",
                })
              }
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
