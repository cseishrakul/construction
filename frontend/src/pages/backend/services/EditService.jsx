import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiurl, token } from "../../../components/frontend/Http";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null); // { url, public_id }
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");
  const [service, setService] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch existing service and set defaults
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(apiurl + `services/${id}`, {
          headers: {
            Authorization: `Bearer ${token()}`,
            Accept: "application/json",
          },
        });
        const result = await res.json();
        if (result.status && result.data) {
          const data = result.data;
          setService(data);
          setContent(data.content || "");

          // set form defaults
          setValue("title", data.title);
          setValue("slug", data.slug);
          setValue("short_desc", data.short_desc);
          setValue("price", data.price);
          setValue("details", data.details);
          setValue("budget", data.budget);
          setValue("timeline", data.timeline);
          setValue("status", String(data.status));

          if (data.image) {
            setImageData({
              url: data.image,
              public_id: data.image_public_id || null,
            });
          }
        } else {
          toast.error("Failed to load service data");
        }
      } catch (error) {
        toast.error("Failed to fetch service data");
      }
    };
    fetchService();
  }, [id, setValue]);

  // Handle Cloudinary image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "react_unsigned"); // your unsigned preset here

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwelnewv8/image/upload",
        {
          method: "POST",
          body: uploadData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setImageData({
          url: data.secure_url,
          public_id: data.public_id,
        });
        toast.success("Image uploaded!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Submit form
  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      content,
      image: imageData?.url || service?.image || null,
      image_public_id: imageData?.public_id || service?.image_public_id || null,
    };
    setLoading(true);

    try {
      const res = await fetch(apiurl + `services/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
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
      toast.error("Something went wrong!");
      console.error(error);
    }finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-5">
      <div className="flex gap-6"></div>
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar />
        <div className="flex-grow p-8 max-w-5xl mx-auto bg-white shadow-sm rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-semibold text-gray-800">
              Edit Services
            </h4>
            <Link to="/admin/services">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 !rounded-lg text-white transition duration-200">
                Back
              </button>
            </Link>
          </div>

          <hr />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Title */}
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className={`w-full border p-2 rounded ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
              />
              {errors.title && (
                <p className="text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block font-medium mb-1">Slug</label>
              <input
                {...register("slug", { required: "Slug is required" })}
                className={`w-full border p-2 rounded ${
                  errors.slug ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
              />
              {errors.slug && (
                <p className="text-red-500 mt-1">{errors.slug.message}</p>
              )}
            </div>

            {/* Short Description - full width */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">
                Short Description
              </label>
              <textarea
                {...register("short_desc")}
                className="w-full border p-2 rounded border-gray-300"
                rows={3}
                placeholder="Short description"
              />
            </div>

            {/* Content - full width */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Content</label>
              <textarea
                className="w-full border p-2 rounded border-gray-300"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed content"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block font-medium mb-1">Price</label>
              <input
                {...register("price")}
                type="number"
                className="w-full border p-2 rounded border-gray-300"
                placeholder="Price"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block font-medium mb-1">Details</label>
              <input
                {...register("details")}
                type="text"
                className="w-full border p-2 rounded border-gray-300"
                placeholder="Details"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block font-medium mb-1">Budget</label>
              <input
                {...register("budget")}
                type="text"
                className="w-full border p-2 rounded border-gray-300"
                placeholder="Budget"
              />
            </div>

            {/* Timeline */}
            <div>
              <label className="block font-medium mb-1">Timeline</label>
              <input
                {...register("timeline")}
                type="text"
                className="w-full border p-2 rounded border-gray-300"
                placeholder="Timeline"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                {...register("status")}
                className="w-full border p-2 rounded border-gray-300"
                defaultValue={service?.status ?? "1"}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Image Upload - full width */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border p-2 rounded border-gray-300"
                disabled={uploading}
              />
              {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
              {imageData?.url && (
                <img
                  src={imageData.url}
                  alt="Service"
                  className="mt-2 w-40 h-40 object-cover rounded border"
                />
              )}
              {!imageData?.url && service?.image && (
                <img
                  src={service.image}
                  alt="Service"
                  className="mt-2 w-40 h-40 object-cover rounded border"
                />
              )}
            </div>

            {/* Submit Button - full width */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
              >
                {loading ? "Updating..." : "Update Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditService;
