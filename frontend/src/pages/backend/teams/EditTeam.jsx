import React, { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { apiurl, fileurl, token } from "../../../components/frontend/Http";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const [team, setTeam] = useState({});
  const [imageId, setImageId] = useState(null);

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
      imageId: imageId || team.image_id, // keep old or new
    };

    try {
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
        toast.success("Team member updated successfully!");
        navigate("/admin/teams");
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
                {...register("role", {
                  required: "Role is required",
                })}
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
              {team.image && (
                <img
                  src={fileurl + "uploads/teams/small/" + team.image}
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
              <button className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition">
                Update Team Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
