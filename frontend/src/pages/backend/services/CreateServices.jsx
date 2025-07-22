import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { token } from "../../../components/frontend/Http";
import Sidebar from "../../../components/backend/dashboard/Sidebar";

const CreateServices = () => {
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

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    if (imageData?.url) submitData.append("image", imageData.url);
    if (imageData?.public_id) submitData.append("image_public_id", imageData.public_id);

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
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Create New Service</h2>

          <form onSubmit={onSubmit} className="space-y-4">
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
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={label}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
            ))}

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Content"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded hover:file:bg-blue-700"
              />
              {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
              {imageData?.url && (
                <img
                  src={imageData.url}
                  alt="Uploaded"
                  className="w-40 h-40 mt-2 object-cover rounded border"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
            >
              Submit Service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateServices;
