import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { token } from "../../../components/frontend/Http";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { FaArrowLeft } from "react-icons/fa";

const CreateServices = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_desc: "",
    content: "",
    status: 1,
    price: "",
    details: "",
    budget: "",
    timeline: "",
  });

  const [imageData, setImageData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "react_unsigned");
    setUploading(true);

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
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    if (imageData?.url) submitData.append("image", imageData.url);
    if (imageData?.public_id)
      submitData.append("image_public_id", imageData.public_id);

    try {
      const response = await axios.post(
        "https://construction-aqri.onrender.com/api/services",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        toast.success("Service created successfully!");
        setFormData({
          title: "",
          slug: "",
          short_desc: "",
          content: "",
          status: 1,
          price: "",
          details: "",
          budget: "",
          timeline: "",
        });
        setImageData(null);
      } else {
        toast.error("Validation error");
        console.log(response.data.errors);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
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
                Create Services
              </h4>
              <Link to="/admin/services">
                <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 !rounded-lg text-white transition duration-200">
                  Back
                </button>
              </Link>
            </div>

            <hr />

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  ["title", "Title"],
                  ["slug", "Slug"],
                  ["short_desc", "Short Description"],
                  ["price", "Price"],
                  ["details", "Details"],
                  ["budget", "Budget"],
                  ["timeline", "Timeline"],
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
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={label}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
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

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Content"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                  "Submit Service"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateServices;
