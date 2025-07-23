import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { apiurl, token } from "../../../components/frontend/Http";
import { toast } from "react-toastify";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { Link, useNavigate } from "react-router-dom";

export default function CreateTeam() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [image, setImage] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      image,
      image_public_id: imagePublicId,
    };

    try {
      setLoading(true);
      const res = await fetch(apiurl + "teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status) {
        toast.success("Team member created successfully!");
        navigate("/admin/teams");
      } else {
        toast.error(result.message || "Creation failed.");
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
    formData.append("upload_preset", "react_unsigned"); // your cloudinary preset
    formData.append("cloud_name", "dwelnewv8");         // your cloudinary cloud name

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwelnewv8/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await res.json();
      if (result.secure_url && result.public_id) {
        setImage(result.secure_url);
        setImagePublicId(result.public_id);
        toast.success("Image uploaded to Cloudinary!");
      } else {
        toast.error("Image upload failed.");
      }
    } catch (err) {
      toast.error("Upload error");
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
            <h4 className="text-2xl font-semibold text-gray-800">Create Team Member</h4>
            <Link to="/admin/teams">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white">
                Back
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Team Member Info</h2>

            <div className="mb-3">
              <label>Name</label>
              <input
                className="form-control"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label>Phone</label>
              <input
                type="text"
                className="form-control"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid phone number",
                  },
                })}
              />
              {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
            </div>
            
            <div className="mb-3">
              <label>Role</label>
              <input
                type="text"
                className="form-control"
                {...register("role", {
                  required: "User role is required",
                })}
              />
              {errors.role && <p className="text-red-500">{errors.role.message}</p>}
            </div>

            <div className="mb-3">
              <label>Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFile}
              />
              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="mt-2 rounded shadow max-w-full h-auto"
                  style={{ maxHeight: "200px" }}
                />
              )}
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
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Creating..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
