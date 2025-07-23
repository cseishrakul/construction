import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import { apiurl, token } from "../../../components/frontend/Http";
import { toast } from "react-toastify";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { Link, useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const editor = useRef(null);

  const onSubmit = async (data) => {
    if (!imageUrl) {
      toast.error("Please upload an image first.");
      return;
    }

    const payload = { ...data, content, image: imageUrl };

    try {
      setLoading(true);
      const res = await fetch(apiurl + "blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status) {
        toast.success("Blog created successfully!");
        navigate("/admin/blogs");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_unsigned"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "dwelnewv8"); // Replace with your Cloudinary cloud name

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dwelnewv8/image/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.secure_url) {
        setImageUrl(result.secure_url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      toast.error("Image upload error");
    }
  };

  return (
    <main className="p-5">
      <div className="flex gap-6">
        <div className="w-64">
          <Sidebar />
        </div>

        <div className="flex-grow bg-white shadow rounded-lg p-6 min-h-[450px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-semibold text-gray-800">Create Blog</h4>
            <Link to="/admin/blogs">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 !rounded-lg text-white transition duration-200">
                Back
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create Blog</h2>

            <div className="mb-3">
              <label>Title</label>
              <input
                className="form-control"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>

            <div className="mb-3">
              <label>Slug</label>
              <input
                className="form-control"
                {...register("slug", { required: "Slug is required" })}
              />
            </div>

            <div className="mb-3">
              <label>Short Description</label>
              <textarea
                className="form-control"
                {...register("short_desc", { required: "Description is required" })}
              />
            </div>

            <div className="mb-3">
              <label>Content</label>
              <JoditEditor
                ref={editor}
                value={content}
                onBlur={(newContent) => setContent(newContent)}
              />
            </div>

            <div className="mb-3">
              <label>Image</label>
              <input type="file" className="form-control" onChange={handleFile} />
              {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />}
            </div>

            <div className="mb-3">
              <label>Status</label>
              <select className="form-control" {...register("status")}>
                <option value="1">Active</option>
                <option value="0">Blocked</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Creating..." : "Create Blog"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
