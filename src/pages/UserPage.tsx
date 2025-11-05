import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
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
import { useEffect, useState } from "react";
import Badge from "../components/ui/badge/Badge";
import PaginationComponent from "../components/paginationComponent/PaginationComponent";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}
const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchAllUsers = async (currentPage: number) => {
    try {
      const { data } = await axiosInstance.get(
        `/auth?page=${currentPage}&limit=10`
      );
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data?.pagination?.pages);
        setTotalUsers(data.pagination.total);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchAllUsers(currentPage);
  }, [currentPage]);
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Users" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader={true}
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User Name
                  </TableCell>
                  <TableCell
                    isHeader={true}
                    className="px-5 py-3 font-medium text-gray-500 text-start  text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader={true}
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Role
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {user.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={user.role === "user" ? "warning" : "success"}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="my-5">
          {users.length > 0 && (
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              limit={10}
              totals={totalUsers}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserPage;
