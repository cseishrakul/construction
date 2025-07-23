import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiurl, fileurl, token } from "../../../components/frontend/Http";
import { toast } from "react-toastify";

const Editproject = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [project, setProject] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [imageData, setImageData] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Content",
    }),
    [placeholder]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(apiurl + "projects/" + params.id, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();
      setContent(result.data.content);
      setProject(result.data);
      return {
        title: result.data.title,
        slug: result.data.slug,
        short_desc: result.data.short_desc,
        construction_type: result.data.construction_type,
        sector: result.data.sector,
        location: result.data.location,
        status: result.data.status,
      };
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_unsigned");

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
    }
  };

  const onSubmit = async (data) => {
    const newData = {
      ...data,
      content: content,
      image: imageData?.url || project.image || null,
      image_public_id: imageData?.public_id || project.image_public_id || null,
    };

    setIsDisable(true);
    try {
      const res = await fetch(apiurl + "projects/" + params.id, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(newData),
      });

      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message);
        navigate("/admin/projects");
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setIsDisable(false);
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
            <h4 className="text-2xl font-semibold text-gray-800">Edit Project</h4>
            <Link to="/admin/projects">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 !rounded-lg text-white transition duration-200">
                Back
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  className={`form-control ${errors.title && "is-invalid"}`}
                />
                {errors.title && <p className="invalid-feedback">{errors.title.message}</p>}
              </div>
              <div className="col-md-6 mb-3">
                <label>Slug</label>
                <input
                  {...register("slug", { required: "Slug is required" })}
                  type="text"
                  className={`form-control ${errors.slug && "is-invalid"}`}
                />
                {errors.slug && <p className="invalid-feedback">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-3">
                <label>Short Description</label>
                <textarea
                  {...register("short_desc", { required: "Short description is required" })}
                  rows={3}
                  className={`form-control ${errors.short_desc && "is-invalid"}`}
                />
                {errors.short_desc && <p className="invalid-feedback">{errors.short_desc.message}</p>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Construction Type</label>
                <input {...register("construction_type")} type="text" className="form-control" />
              </div>
              <div className="col-md-4 mb-3">
                <label>Sector</label>
                <input {...register("sector")} type="text" className="form-control" />
              </div>
              <div className="col-md-4 mb-3">
                <label>Location</label>
                <input {...register("location")} type="text" className="form-control" />
              </div>
            </div>

            <div className="mb-3">
              <label>Content</label>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => {}}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-control"
                />
                {imageData?.url ? (
                  <img
                    src={imageData.url}
                    alt="preview"
                    className="my-2 rounded shadow-md max-w-full h-auto"
                    style={{ maxHeight: "200px" }}
                  />
                ) : project.image ? (
                  <img
                    src={fileurl + "uploads/projects/small/" + project.image}
                    alt="preview"
                    className="my-2 rounded shadow-md max-w-full h-auto"
                    style={{ maxHeight: "200px" }}
                  />
                ) : null}
              </div>
              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select
                  {...register("status", { required: "Status is required" })}
                  className={`form-control ${errors.status && "is-invalid"}`}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
                {errors.status && <p className="invalid-feedback">{errors.status.message}</p>}
              </div>
            </div>

            <div className="text-center">
              <button
                className="bg-purple-500 text-white py-2 px-6 rounded hover:bg-purple-600 transition"
                disabled={isDisable}
              >
                Update Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Editproject;
