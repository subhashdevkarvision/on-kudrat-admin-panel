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

export interface Language {
  _id: string;
  name: string;
  code: string;
}

export default function LanguagePage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageName, setLanguageName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLanguages, setTotalLanguages] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    languageId?: string;
    languageName?: string;
  }>({ open: false });
  const [limit, setLimit] = useState(5);

  const handleSaveLanguage = async () => {
    if (!languageName.trim()) {
      setError("Language name is required");
      return;
    }

    try {
      if (editingLanguage) {
        const { data } = await axiosInstance.put(
          `/language/${editingLanguage._id}`,
          { name: languageName }
        );
        if (data.success) {
          toast.success("Language updated successfully");
          fetchLanguages(currentPage);
        }
      } else {
        const { data } = await axiosInstance.post("/language", {
          name: languageName,
        });
        if (data.success) {
          toast.success("Language added successfully");
          setLanguages([...languages, data.data]);
          fetchLanguages(currentPage);
        }
      }

      setIsModalOpen(false);
      setEditingLanguage(null);
      setLanguageName("");
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
    if (!deleteModal.languageId) return;
    try {
      const { data } = await axiosInstance.delete(
        `/language/${deleteModal.languageId}`
      );
      if (data.success) {
        toast.success("Language deleted");
        fetchLanguages(currentPage);
        setDeleteModal({ open: false });
      }
    } catch {
      toast.error("Failed to delete language");
    }
  };

  const openEditModal = (lang: Language) => {
    setEditingLanguage(lang);
    setLanguageName(lang.name);
    setIsModalOpen(true);
    setError("");
  };

  const openAddModal = () => {
    setEditingLanguage(null);
    setLanguageName("");
    setIsModalOpen(true);
    setError("");
  };

  const fetchLanguages = async (currentPage: number, limitVal = limit) => {
    try {
      const { data } = await axiosInstance.get(
        `/language?page=${currentPage}&limit=${limitVal}`
      );
      if (data.success) {
        setLanguages(data.data);
        setTotalLanguages(data.pagination.total);
        setTotalPages(data.pagination.pages);
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
    fetchLanguages(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <>
      <PageMeta title="Language Management" description="Manage languages" />
      <PageBreadcrumb pageTitle="Language" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-end">
          <Button onClick={openAddModal} className="float-end">
            Add Language
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
                    Language Name
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
                {languages.map((lang) => (
                  <TableRow key={lang._id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {lang.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                      <div className="flex gap-5 justify-end">
                        <Button
                          size="xs"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => openEditModal(lang)}
                        >
                          <SquarePen color="blue" size={20} />
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          className="rounded-full"
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              languageId: lang._id,
                              languageName: lang.name,
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
        {totalLanguages > 5 && (
          <PaginationComponent
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
            totals={totalLanguages}
            limit={limit}
            currentPage={currentPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 m-0 w-full max-w-[500px]">
          <h2 className="text-lg font-semibold mb-4  dark:text-gray-400">
            {editingLanguage ? "Edit Language" : "Add New Language"}
          </h2>
          <Label htmlFor="languageName">Language Name</Label>
          <Input
            type="text"
            name="languageName"
            placeholder="Enter language name"
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingLanguage(null);
                setLanguageName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveLanguage}>
              {editingLanguage ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        showCloseButton={false}
        onClose={() => setDeleteModal({ open: false })}
      >
        <div className="p-6 w-full max-w-[500px]">
          <h2 className="text-xl font-semibold mb-2  dark:text-gray-400">
            Delete Language
          </h2>
          <p className="text-gray-600 text-xl dark:text-gray-400 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              {deleteModal.languageName}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false })}
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
