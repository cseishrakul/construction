import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { apiurl, token } from "../../../components/frontend/Http";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState({});
  const [image, setImage] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(apiurl + "teams/" + id, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const result = await res.json();
      setTeam(result.data);
      return {
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        status: result.data.status,
        role: result.data.role,
      };
    },
  });

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_unsigned"); // your preset
    formData.append("cloud_name", "dwelnewv8");         // your Cloudinary name

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dwelnewv8/image/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.secure_url && result.public_id) {
        setImage(result.secure_url);
        setImagePublicId(result.public_id);
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed.");
      }
    } catch (err) {
      toast.error("Upload error");
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      image: image || team.image,
      image_public_id: imagePublicId || team.image_public_id,
    };

    try {
      setLoading(true);
      const res = await fetch(apiurl + "teams/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status) {
        toast.success("Team member updated!");
        navigate("/admin/teams");
      } else {
        toast.error(result.message || "Update failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
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
            <h4 className="text-2xl font-semibold text-gray-800">Edit Team Member</h4>
            <Link to="/admin/teams">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white transition">
                Back
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label>Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className={`form-control ${errors.name && "is-invalid"}`}
              />
              {errors.name && <p className="invalid-feedback">{errors.name.message}</p>}
            </div>

            <div className="mb-4">
              <label>Phone</label>
              <input
                {...register("phone", { required: "Phone is required" })}
                className={`form-control ${errors.phone && "is-invalid"}`}
              />
              {errors.phone && <p className="invalid-feedback">{errors.phone.message}</p>}
            </div>

            <div className="mb-4">
              <label>Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`form-control ${errors.email && "is-invalid"}`}
              />
              {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <label>Role</label>
              <input
                type="text"
                {...register("role", { required: "Role is required" })}
                className={`form-control ${errors.role && "is-invalid"}`}
              />
              {errors.role && <p className="invalid-feedback">{errors.role.message}</p>}
            </div>

            <div className="mb-4">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFile}
              />
              {(image || team.image) && (
                <img
                  src={image || team.image}
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
              {errors.status && <p className="invalid-feedback">{errors.status.message}</p>}
            </div>

            <div className="text-center">
              <button
                disabled={loading}
                className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {loading ? "Updating..." : "Update Team Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
