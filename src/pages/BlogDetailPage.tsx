import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import FileInput from "../components/form/input/FileInput";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useEffect, useState } from "react";
import Button from "../components/ui/button/Button";
import toast from "react-hot-toast";
import { ChevronLeft, X } from "lucide-react";
import { axiosInstance } from "../api";
import { useNavigate, useParams } from "react-router";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    image: null as File | null,
    content: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const { data } = await axiosInstance.get(`/blog/${id}`);
        if (data.success && data.data) {
          const blog = data.data;
          setFormData({
            title: blog.title || "",
            shortDescription: blog.shortDescription || "",
            image: null,
            content: blog.content || "",
          });
          setImagePreview(`${import.meta.env.VITE_BACKEND_URL}${blog.image}`);
          setIsEditing(true);
        } else {
          toast.error("Failed to load blog data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading blog");
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 3)
      newErrors.title = "Title must be at least 3 characters";

    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    else if (formData.shortDescription.length < 10)
      newErrors.shortDescription = "Description must be at least 10 characters";

    if (!imagePreview && !formData.image) newErrors.image = "Image is required";

    if (!formData.content.trim()) newErrors.content = "Content is required";
    else if (formData.content.length < 20)
      newErrors.content = "Content must be at least 20 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("content", formData.content);
      if (formData.image) formDataToSend.append("image", formData.image);

      if (isEditing) {
        const { data } = await axiosInstance.put(
          `/blog/${id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.success) {
          toast.success("Blog updated successfully!");
          navigate("/blogs");
        } else {
          toast.error(data.message || "Failed to update blog");
        }
      } else {
        const { data } = await axiosInstance.post("/blog", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (data.success) {
          toast.success("Blog added successfully!");
          navigate("/blogs");
        } else {
          toast.error(data.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "Failed to update blog" : "Failed to add blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title={isEditing ? "Edit Blog" : "Add Blog"}
        description="Admin panel - Manage blog post"
      />
      <PageBreadcrumb pageTitle={isEditing ? "Edit Blog" : "Add Blog"} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <button
          onClick={() => navigate("/blogs")}
          className="bg-gray-500 p-3 rounded-full mb-10"
        >
          <ChevronLeft color="black" />
        </button>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              name="shortDescription"
              placeholder="Enter description"
              value={formData.shortDescription}
              onChange={handleChange}
            />
            {errors.shortDescription && (
              <p className="text-sm text-red-500 mt-1">
                {errors.shortDescription}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <FileInput name="image" onChange={handleChange} />
            {errors.image && (
              <p className="text-sm text-red-500 mt-1">{errors.image}</p>
            )}

            {imagePreview && (
              <div className="relative inline-block mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your blog content here..."
              className="mt-2 rounded-lg bg-white custom-quill"
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">{errors.content}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Submitting..."
              : isEditing
              ? "Update Blog"
              : "Add Blog"}
          </Button>
        </form>
      </div>
    </>
  );
}
