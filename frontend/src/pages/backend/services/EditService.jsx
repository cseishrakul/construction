import React, { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { toast } from "react-toastify";
import { apiurl, token } from "../../../components/frontend/Http";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
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
        return {
          title: result.data.title,
          slug: result.data.slug,
          short_desc: result.data.short_desc,
          content: result.data.content,
          price: result.data.price,
          details: result.data.details || "",
          budget: result.data.budget || "",
          timeline: result.data.timeline || "",
          status: String(result.data.status), // make sure it’s a string for select
        };
      } else {
        toast.error("Failed to load service data");
        return {};
      }
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append all form fields except image
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "image") formData.append(key, value);
      });

      // Handle image file upload (if any)
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      } else if (serviceData?.image) {
        // keep existing image if no new upload
        formData.append("image", serviceData.image);
        if (serviceData.image_public_id) {
          formData.append("image_public_id", serviceData.image_public_id);
        }
      }

      const res = await fetch(`${apiurl}services/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token()}`,
          // Don't set Content-Type when using FormData
        },
        body: formData,
      });

      const result = await res.json();
      if (result.status) {
        toast.success("Service updated successfully!");
        navigate("/admin/services"); // adjust route if needed
      } else {
        toast.error(result.message || "Failed to update service");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during submission");
    }
    setIsSubmitting(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", e.target.files); // update react-hook-form value for image
    }
  };

  return (
    <main className="p-5 min-h-screen flex gap-6 bg-gray-100">
      <Sidebar />
      <div className="flex-grow bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Edit Service</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
              onChange={handleImageChange}
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
