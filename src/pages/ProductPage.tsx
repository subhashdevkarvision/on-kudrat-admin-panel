import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { SquarePen, Trash2Icon, X } from "lucide-react";
import { axiosInstance } from "../api";
import axios from "axios";
import toast from "react-hot-toast";
import Select, { Option } from "../components/form/Select";
import { Category } from "./CategoryPage";
import { Language } from "./LanguagePage";
import Form from "../components/form/Form";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import MultiSelect from "../components/form/MultiSelect";
// import Checkbox from "../components/form/input/Checkbox";
import FileInput from "../components/form/input/FileInput";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountedPrice: number;
  image: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  categoryId: string;
  languageId: string;
}

const ProductPage = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [Products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [languageOptions, setLanguageOptions] = useState<Option[]>([]);
  // const [selectedValues, setSelectedValues] = useState<string[]>([]);
  // const [isDealOfTheWeek, setIsDealOfTheWeek] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [formdata, setFormData] = useState({
    name: "",
    price: "",
    discountedPrice: "",
    category: "",
    language: "",
    isBestSeller: false,
    isFeartured: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    discountedPrice: "",
    category: "",
    language: "",
    image: "",
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    productId?: string;
    productName?: string;
  }>({ open: false });
  const multiOptions = [
    { value: "isFeatured", text: "Featured", selected: false },
    { value: "isBestSeller", text: "Best Seller", selected: false },
  ];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  const fetchAllCategory = async () => {
    try {
      const { data } = await axiosInstance.get("/category");
      if (data.success) {
        const categories = data?.data.map((item: Category) => {
          return { value: item._id, label: item.name };
        });
        setCategoryOptions(categories);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const fetchLanguages = async () => {
    try {
      const { data } = await axiosInstance.get("/language");
      if (data.success) {
        const languages = data?.data.map((item: Language) => {
          return { value: item._id, label: item.name };
        });
        setLanguageOptions(languages);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const handleEditClick = (product: Product) => {
    setIsModelOpen(true);
    setIsEditMode(true);
    setEditProductId(product._id);
    setFormData({
      name: product.name,
      price: String(product.price),
      discountedPrice: String(product.discountedPrice),
      category: product.categoryId,
      language: product.languageId,
      isBestSeller: product.isBestSeller,
      isFeartured: product.isFeatured,
    });

    setImagePreview(`${import.meta.env.VITE_BACKEND_URL}${product.image}`);
  };
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      discountedPrice: "",
      category: "",
      language: "",
      isBestSeller: false,
      isFeartured: false,
    });
    setErrors({
      name: "",
      price: "",
      discountedPrice: "",
      category: "",
      language: "",
      image: "",
    });
    setImage(null);
    setImagePreview(null);
    setIsEditMode(false);
    setEditProductId(null);
  };
  const validateForm = () => {
    const newErrors: any = {};

    if (!formdata.name.trim()) newErrors.name = "Product name is required.";
    if (!formdata.price) newErrors.price = "Price is required.";
    else if (isNaN(Number(formdata.price)))
      newErrors.price = "Price must be a number.";

    if (!formdata.discountedPrice)
      newErrors.discountedPrice = "Discounted price is required.";
    else if (isNaN(Number(formdata.discountedPrice)))
      newErrors.discountedPrice = "Discounted price must be a number.";

    if (!formdata.category) newErrors.category = "Please select a category.";
    if (!formdata.language) newErrors.language = "Please select a language.";

    if (!isEditMode && !image)
      newErrors.image = "Please upload a product image.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formDataToSend = new FormData();
    formDataToSend.append("name", formdata.name);
    formDataToSend.append("price", formdata.price);
    formDataToSend.append("discountedPrice", formdata.discountedPrice);
    formDataToSend.append("categoryId", formdata.category);
    formDataToSend.append("languageId", formdata.language);
    formDataToSend.append("isBestSeller", String(formdata.isBestSeller));
    formDataToSend.append("isFeatured", String(formdata.isFeartured));
    // formDataToSend.append("isDealOfTheWeek", String(isDealOfTheWeek));
    if (image) {
      formDataToSend.append("image", image);
    }
    try {
      const { data } = isEditMode
        ? await axiosInstance.put(`/product/${editProductId}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axiosInstance.post("/product/add", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      if (data.success) {
        toast.success(data?.message);
        setIsModelOpen(false);

        fetchProducts();
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
      toast.error("Something went wrong");
    }
  };
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        "/product/all-products?limit=18"
      );
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
  const handleDelete = async () => {
    if (!deleteModal.productId) return;
    try {
      const { data } = await axiosInstance.delete(
        `/product/${deleteModal.productId}`
      );
      if (data.success) {
        toast.success("Product deleted");
        setDeleteModal({ open: false });
        fetchProducts();
      }
    } catch {
      toast.error("Failed to delete Product");
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchAllCategory();
    fetchLanguages();
  }, []);
  if (loading) return <p className="p-5">Loading...</p>;
  return (
    <>
      <PageMeta title="Product Management" description="Manage Products" />
      <PageBreadcrumb pageTitle="Products" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div>
          <Button
            className="float-end"
            variant="primary"
            onClick={() => setIsModelOpen(true)}
          >
            Add New Product
          </Button>
        </div>
        <div className="mt-16">
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
                      Price
                    </TableCell>
                    <TableCell
                      isHeader={true}
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Discount price
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
                              onClick={() => handleEditClick(product)}
                            >
                              <SquarePen color="blue" size={20} />
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              className="rounded-full"
                              onClick={() => {
                                setDeleteModal({
                                  open: true,
                                  productId: product._id,
                                  productName: product.name,
                                });
                              }}
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
        </div>
      </div>
      <Modal
        onClose={() => {
          setIsModelOpen(false);
          resetForm();
        }}
        isOpen={isModelOpen}
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h2 className="text-lg font-semibold mb-4  dark:text-gray-400">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h2>
          <Form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-x-10 gap-y-5 "
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                onChange={handleInputChange}
                value={formdata.name}
                type="text"
                placeholder="Enter Product Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  name="price"
                  type="text"
                  onChange={handleInputChange}
                  value={formdata.price}
                  placeholder="Enter Product price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <Label htmlFor="discountedPrice">Discount Price</Label>
                <Input
                  name="discountedPrice"
                  type="text"
                  placeholder="Enter Product Discount Price"
                  onChange={handleInputChange}
                  value={formdata.discountedPrice}
                />
                {errors.discountedPrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.discountedPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                {" "}
                <Label htmlFor="language">Select Language</Label>
                <Select
                  options={languageOptions}
                  placeholder="Select Option"
                  onChange={(value) =>
                    setFormData({ ...formdata, language: value })
                  }
                  className="dark:bg-dark-900"
                  defaultValue={formdata.language}
                />
                {errors.language && (
                  <p className="text-red-500 text-sm mt-1">{errors.language}</p>
                )}
              </div>
              <div>
                <Label htmlFor="Category">Select Category</Label>
                <Select
                  options={categoryOptions}
                  placeholder="Select Option"
                  onChange={(value) =>
                    setFormData({ ...formdata, category: value })
                  }
                  className="dark:bg-dark-900"
                  defaultValue={formdata.category}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>
            <MultiSelect
              label="Multiple Select Options"
              options={multiOptions}
              defaultSelected={[
                ...(formdata.isFeartured ? ["isFeartured"] : []),
                ...(formdata.isBestSeller ? ["isBestSeller"] : []),
              ]}
              onChange={(values) => {
                setFormData((prev) => ({
                  ...prev,
                  isFeartured: values.includes("isFeartured"),
                  isBestSeller: values.includes("isBestSeller"),
                }));
              }}
            />
            {/* <Checkbox
              label="Deal of the week"
              checked={isDealOfTheWeek}
              onChange={setIsDealOfTheWeek}
            />
            <Label htmlFor="Image">Image</Label> */}
            <div>
              <Label htmlFor="image">Image</Label>
              <FileInput name="image" onChange={handleImageChange} />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                >
                  <X />
                </button>
              </div>
            )}
            <Button type="submit">{isEditMode ? "Update" : "Add"}</Button>
          </Form>
        </div>
      </Modal>
      <Modal
        isOpen={deleteModal.open}
        showCloseButton={false}
        onClose={() => setDeleteModal({ open: false })}
      >
        <div className="p-6 w-full max-w-[500px]">
          <h2 className="text-lg font-semibold mb-2  dark:text-gray-400">
            Delete Product
          </h2>
          <p className="text-gray-600 text-theme-sm dark:text-gray-400 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              {deleteModal.productName}
            </span>
            ?
          </p>
          <div className="flex gap-4">
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
};

export default ProductPage;
