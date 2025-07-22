import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiurl, token } from "../../../components/frontend/Http";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

const EditService = () => {
  const editor = useRef(null);
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

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${apiurl}services/${id}`, {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        });
        const result = await res.json();
        if (result.status) {
          setFormData(result.data);
          if (result.data.image) {
            setImageData({
              url: result.data.image,
              public_id: result.data.image_public_id,
            });
          }
        } else {
          toast.error("Failed to load service");
        }
      } catch (err) {
        toast.error("An error occurred while fetching service data");
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setImageData({ url: data.secure_url, public_id: data.public_id });
        toast.success("Image uploaded!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    console.log("Submitting formData:", formData);

    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    if (imageData?.url) submitData.append("image", imageData.url);
    if (imageData?.public_id)
      submitData.append("image_public_id", imageData.public_id);

    try {
      const response = await fetch(
        `https://construction-aqri.onrender.com/api/services/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "multipart/form-data",
          },
          body: submitData,
        }
      );

      const result = await response.json();
      if (result.status) {
        toast.success("Service updated successfully!");
        navigate("/admin/services");
      } else {
        toast.error("Validation error");
        console.log(result.errors);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 mt-0">
        <Sidebar />
      </div>

      {/* Form Section */}
      <div className="w-3/4 p-6 mt-4">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}
          <div className="flex flex-col">
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="border p-2"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col">
            <label>Slug</label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Slug"
              className="border p-2"
            />
          </div>

          {/* Short Description */}
          <div className="flex flex-col col-span-2">
            <label>Short Description</label>
            <input
              name="short_desc"
              value={formData.short_desc}
              onChange={handleChange}
              placeholder="Short Description"
              className="border p-2 w-full"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col col-span-2">
            <label>Content</label>
            <JoditEditor
              ref={editor}
              value={formData.content}
              tabIndex={1}
              onBlur={(newContent) =>
                setFormData({ ...formData, content: newContent })
              }
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label>Price</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <label>Details</label>
            <input
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Details"
              className="border p-2"
            />
          </div>

          {/* Budget */}
          <div className="flex flex-col">
            <label>Budget</label>
            <input
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Budget"
              className="border p-2"
            />
          </div>

          {/* Timeline */}
          <div className="flex flex-col">
            <label>Timeline</label>
            <input
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="Timeline"
              className="border p-2"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col col-span-2">
            <label>Upload Image</label>
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
                className="w-40 h-40 object-cover mt-2 border"
              />
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col col-span-2">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded w-full"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;
