import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { token } from "../../../components/frontend/Http";

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
    uploadData.append("upload_preset", "react_unsigned"); // 🔁 Replace
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

    // Append image fields
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
            "Content-Type": "multipart/form-data", // Needed if you're sending FormData
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
    <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-4">
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full"
      />
      <input
        name="slug"
        value={formData.slug}
        onChange={handleChange}
        placeholder="Slug"
        className="border p-2 w-full"
      />
      <input
        name="short_desc"
        value={formData.short_desc}
        onChange={handleChange}
        placeholder="Short Description"
        className="border p-2 w-full"
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Content"
        className="border p-2 w-full"
      />
      <input
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="border p-2 w-full"
      />
      <input
        name="details"
        value={formData.details}
        onChange={handleChange}
        placeholder="Details"
        className="border p-2 w-full"
      />
      <input
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        placeholder="Budget"
        className="border p-2 w-full"
      />
      <input
        name="timeline"
        value={formData.timeline}
        onChange={handleChange}
        placeholder="Timeline"
        className="border p-2 w-full"
      />

      <div className="space-y-2">
        <label className="block">Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2"
        />
        {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
        {imageData?.url && (
          <img
            src={imageData.url}
            alt="Uploaded"
            className="w-40 h-40 object-cover border"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateServices;
