import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { apiurl, token } from "../../../components/frontend/Http";
import Sidebar from "../../../components/backend/dashboard/Sidebar";

const CreateProject = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [imageData, setImageData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_unsigned");

    setUploading(true);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwelnewv8/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setImageData({ url: data.secure_url, public_id: data.public_id });
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Image upload failed!");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      content,
      image: imageData?.url || null,
      image_public_id: imageData?.public_id || null,
    };

    setLoading(true);
    try {
      const res = await fetch(apiurl + "projects", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status) {
        toast.success("Project added successfully!");
        reset();
        setContent("");
        setImageData(null);
        navigate("/admin/projects");
      } else {
        toast.error(result.message || "Failed to create project");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-5">
      <div className="flex gap-6"></div>
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar />

        <div className="flex-grow">
          <div className="max-w-full mx-auto bg-white p-10 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-2xl font-semibold text-gray-800">
                Create Project
              </h4>
              <Link to="/admin/projects">
                <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 !rounded-lg text-white transition duration-200">
                  Back
                </button>
              </Link>
            </div>

            <hr />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  ["title", "Title"],
                  ["slug", "Slug"],
                  ["short_desc", "Short Description"],
                  ["construction_type", "Construction Type"],
                  ["location", "Location"],
                  ["sector","sector"]
                ].map(([key, label]) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      {...register(key, { required: true })}
                      placeholder={label}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors[key] && (
                      <span className="text-red-500 text-sm">
                        {label} is required
                      </span>
                    )}
                  </div>
                ))}
                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <select
                    {...register("status", { required: true })}
                    className="w-full border p-2 rounded border-gray-300"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && (
                    <span className="text-red-500 text-sm">
                      Status is required
                    </span>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded-lg hover:file:bg-blue-700"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-500 mt-2">Uploading...</p>
                  )}
                  {imageData?.url && (
                    <img
                      src={imageData.url}
                      alt="Uploaded"
                      className="w-40 h-40 mt-4 object-cover rounded-lg border"
                    />
                  )}
                </div>
              </div>

              {/* Jodit Content Editor */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <JoditEditor
                  value={content}
                  onChange={(newContent) => setContent(newContent)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 bg-purple-500 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Submit Project"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateProject;
