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
  const [imageId, setImageId] = useState(null);
  const editor = useRef(null);

  const onSubmit = async (data) => {
    const payload = { ...data, content, imageId };

    try {
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
    }
  };

  const handleFile = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    const res = await fetch(apiurl + "temp-images", {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: formData,
    });

    const result = await res.json();
    if (result.status) setImageId(result.data.id);
    else toast.error("Image upload failed");
  };

  return (
    <main className="p-5">
      <div className="flex gap-6">
        <div className="w-64">
          <Sidebar />
        </div>

        <div className="flex-grow bg-white shadow rounded-lg p-6 min-h-[450px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-semibold text-gray-800">
              Create Blog
            </h4>
            <Link to="/admin/blogs">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 !rounded-lg text-white transition duration-200">
                Back
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 bg-white rounded shadow"
          >
            <h2 className="text-xl font-bold mb-4">Create Blog</h2>

            <div className="mb-3">
              <label>Title</label>
              <input
                className="form-control"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
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
                {...register("short_desc", {
                  required: "Description is required",
                })}
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
              <input
                type="file"
                className="form-control"
                onChange={handleFile}
              />
            </div>

            <div className="mb-3">
              <label>Status</label>
              <select className="form-control" {...register("status")}>
                <option value="1">Active</option>
                <option value="0">Blocked</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
