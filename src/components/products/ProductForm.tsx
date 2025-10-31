// import React, { useEffect, useState } from "react";
// import Form from "../form/Form";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../../api";
// import { Category } from "../../pages/CategoryPage";
// import { Language } from "../../pages/LanguagePage";
// import axios from "axios";
// import Select, { Option } from "../form/Select";

// const ProductForm = ({ id }) => {
//   const [formdata, setFormData] = useState({
//     name: "",
//     price: "",
//     discountedPrice: "",
//     category: "",
//     language: "",
//     isBestSeller: false,
//     isFeartured: false,
//     isDealOfTheWeek: false,
//   });
//   const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
//   const [languageOptions, setLanguageOptions] = useState<Option[]>([]);
//   const isEdit = Boolean(id);
//   const handleSelectChange = (value: string) => {
//     console.log("Selected value:", value);
//   };
//   const fetchAllCategory = async () => {
//     try {
//       const { data } = await axiosInstance.get("/category");
//       if (data.success) {
//         const categories = data?.data.map((item: Category) => {
//           return { value: item.name, label: item.name };
//         });
//         setCategoryOptions(categories);
//       }
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error?.response?.data?.message || "Something went wrong");
//       } else {
//         toast.error("Something went wrong");
//       }
//     }
//   };
//   const fetchLanguages = async () => {
//     try {
//       const { data } = await axiosInstance.get("/language");
//       if (data.success) {
//         const languages = data?.data.map((item: Language) => {
//           return { value: item.name, Label: item.name };
//         });
//         setLanguageOptions(languages);
//       }
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error?.response?.data?.message || "Something went wrong");
//       } else {
//         toast.error("Something went wrong");
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//   };
//   useEffect(() => {
//     fetchAllCategory();
//     fetchLanguages();
//   }, []);
//   return (
//     <>
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
//         <Form onSubmit={handleSubmit}>
//           <Label htmlFor="name">Name</Label>
//           <Input name="name" type="text" placeholder="Enter Product Name" />
//           <Label htmlFor="price">MRP</Label>
//           <Input name="price" type="text" placeholder="Enter Product MRP" />
//           <Label htmlFor="discountedPrice">Price</Label>
//           <Input
//             name="discountedPrice"
//             type="text"
//             placeholder="Enter Product Price"
//           />
//           <Label htmlFor="Category">Select Category</Label>
//           <Select
//             options={categoryOptions}
//             placeholder="Select Option"
//             onChange={handleSelectChange}
//             className="dark:bg-dark-900"
//           />
//           <Label htmlFor="Category">Select Language</Label>
//           <Select
//             options={languageOptions}
//             placeholder="Select Option"
//             onChange={handleSelectChange}
//             className="dark:bg-dark-900"
//           />
//         </Form>
//       </div>
//     </>
//   );
// };

// export default ProductForm;
