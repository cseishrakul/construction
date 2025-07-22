import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { toast } from "react-toastify";
import { apiurl, token, fileurl } from "../../../components/frontend/Http";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${apiurl}services/${id}`, {
          headers: {
            Authorization: `Bearer ${token()}`,
            Accept: "application/json",
          },
        });
        const result = await res.json();
        if (result.status && result.data) {
          setServiceData(result.data);
          setImagePreview(result.data.image || null);
          reset({
            title: result.data.title,
            slug: result.data.slug,
            short_desc: result.data.short_desc,
            content: result.data.content,
            price: result.data.price,
            details: result.data.details || "",
            budget: result.data.budget || "",
            timeline: result.data.timeline || "",
            status: String(result.data.status),
          });
        } else {
          toast.error("Failed to load service data");
        }
      } catch (error) {
        toast.error("Failed to fetch service data");
      }
    };

    fetchService();
  }, [id, reset]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${apiurl}temp-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token()}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await res.json();

      if (result.status) {
        setImageId(result.data.id);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.errors?.image?.[0] || "Image upload failed");
      }
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      ...data,
      imageId: imageId || serviceData?.image_id || null,
    };

    try {
      const res = await fetch(`${apiurl}services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status) {
        toast.success("Service updated successfully!");
        navigate("/admin/services");
      } else {
        toast.error(result.message || "Failed to update service");
      }
    } catch (error) {
      toast.error("An error occurred during submission");
    }

    setIsSubmitting(false);
  };

  return (
    <main className="p-5 min-h-screen flex gap-6 bg-gray-100">
      <Sidebar />
      <div className="flex-grow bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Edit Service</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className={`w-full border p-2 rounded ${errors.title ? "border-red-500" : "border-gray-300"}`}
              type="text"
            />
            {errors.title && <p className="text-red-600">{errors.title.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Slug</label>
            <input
              {...register("slug", { required: "Slug is required" })}
              className={`w-full border p-2 rounded ${errors.slug ? "border-red-500" : "border-gray-300"}`}
              type="text"
            />
            {errors.slug && <p className="text-red-600">{errors.slug.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Short Description</label>
            <textarea
              {...register("short_desc", { required: "Short description is required" })}
              className={`w-full border p-2 rounded ${errors.short_desc ? "border-red-500" : "border-gray-300"}`}
              rows={3}
            />
            {errors.short_desc && <p className="text-red-600">{errors.short_desc.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Content</label>
            <textarea
              {...register("content", { required: "Content is required" })}
              className={`w-full border p-2 rounded ${errors.content ? "border-red-500" : "border-gray-300"}`}
              rows={5}
            />
            {errors.content && <p className="text-red-600">{errors.content.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Price</label>
            <input
              {...register("price", { required: "Price is required" })}
              className={`w-full border p-2 rounded ${errors.price ? "border-red-500" : "border-gray-300"}`}
              type="number"
            />
            {errors.price && <p className="text-red-600">{errors.price.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Details</label>
            <textarea
              {...register("details")}
              className="w-full border p-2 rounded border-gray-300"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Budget</label>
            <input
              {...register("budget")}
              className="w-full border p-2 rounded border-gray-300"
              type="text"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Timeline</label>
            <input
              {...register("timeline")}
              className="w-full border p-2 rounded border-gray-300"
              type="text"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select
              {...register("status", { required: "Status is required" })}
              className={`w-full border p-2 rounded ${errors.status ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
            {errors.status && <p className="text-red-600">{errors.status.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded border-gray-300"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-3 w-40 rounded border" />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full"
          >
            {isSubmitting ? "Updating..." : "Update Service"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditService;
