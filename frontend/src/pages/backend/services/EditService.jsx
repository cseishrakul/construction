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
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });
    if (imageData?.url) submitData.append("image", imageData.url);
    if (imageData?.public_id)
      submitData.append("image_public_id", imageData.public_id);

    try {
      const response = await fetch(`${apiurl}services/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token()}`,
        },
        body: submitData,
      });
      const result = await response.json();
      if (result.status) {
        toast.success("Service updated successfully!");
        navigate("/admin/services");
      } else {
        toast.error("Validation error");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="">
      <Sidebar />
      <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-4">
        <label>Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full"
        />

        <label>Slug</label>
        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Slug"
          className="border p-2 w-full"
        />

        <label>Short Description</label>
        <input
          name="short_desc"
          value={formData.short_desc}
          onChange={handleChange}
          placeholder="Short Description"
          className="border p-2 w-full"
        />

        <label>Content</label>
        <JoditEditor
          ref={editor}
          value={formData.content}
          tabIndex={1}
          onBlur={(newContent) => setFormData({ ...formData, content: newContent })}
        />

        <label>Price</label>
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 w-full"
        />

        <label>Details</label>
        <input
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="Details"
          className="border p-2 w-full"
        />

        <label>Budget</label>
        <input
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Budget"
          className="border p-2 w-full"
        />

        <label>Timeline</label>
        <input
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          placeholder="Timeline"
          className="border p-2 w-full"
        />

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
            className="w-40 h-40 object-cover border"
          />
        )}

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditService;
