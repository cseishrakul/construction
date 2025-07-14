import React, { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { apiurl, fileurl, token } from "../../../components/frontend/Http";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const [content, setContent] = useState("");
  const [blog, setBlog] = useState({});
  const [imageId, setImageId] = useState(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Write blog content...",
  }), []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(apiurl + "blogs/" + id, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const result = await res.json();
      setContent(result.data.content);
      setBlog(result.data);
      return {
        title: result.data.title,
        slug: result.data.slug,
        short_desc: result.data.short_desc,
        status: result.data.status,
      };
    },
  });

  const handleFile = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    const res = await fetch(apiurl + "temp-images", {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: formData,
    });

    const result = await res.json();
    if (result.status) {
      setImageId(result.data.id);
    } else {
      toast.error("Image upload failed.");
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      content,
      imageId: imageId || blog.image_id, // Use new or existing
    };

    try {
      const res = await fetch(apiurl + "blogs/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status) {
        toast.success("Blog updated successfully!");
        navigate("/admin/blogs");
      } else {
        toast.error(result.message || "Update failed.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
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
            <h4 className="text-2xl font-semibold text-gray-800">Edit Blog</h4>
            <Link to="/admin/blogs">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white transition">
                Back
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label>Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className={`form-control ${errors.title && "is-invalid"}`}
              />
              {errors.title && (
                <p className="invalid-feedback">{errors.title.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label>Slug</label>
              <input
                {...register("slug", { required: "Slug is required" })}
                className={`form-control ${errors.slug && "is-invalid"}`}
              />
              {errors.slug && (
                <p className="invalid-feedback">{errors.slug.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label>Short Description</label>
              <textarea
                {...register("short_desc", {
                  required: "Short description is required",
                })}
                rows={3}
                className={`form-control ${errors.short_desc && "is-invalid"}`}
              />
              {errors.short_desc && (
                <p className="invalid-feedback">{errors.short_desc.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label>Content</label>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={(newContent) => setContent(newContent)}
              />
            </div>

            <div className="mb-4">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFile}
              />
              {blog.image && (
                <img
                  src={fileurl + "uploads/blogs/small/" + blog.image}
                  alt="preview"
                  className="my-2 rounded shadow-md max-w-full h-auto"
                  style={{ maxHeight: "200px" }}
                />
              )}
            </div>

            <div className="mb-4">
              <label>Status</label>
              <select
                {...register("status", { required: "Status is required" })}
                className={`form-control ${errors.status && "is-invalid"}`}
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="0">Blocked</option>
              </select>
              {errors.status && (
                <p className="invalid-feedback">{errors.status.message}</p>
              )}
            </div>

            <div className="text-center">
              <button className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition">
                Update Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
