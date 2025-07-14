import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiurl, fileurl, token } from "../../../components/frontend/Http";
import { toast } from "react-toastify";

const EditService = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [service, setService] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [imageId, setImageId] = useState(null);
  const params = useParams();

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "",
    }),
    [placeholder]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(apiurl + "services/" + params.id, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();
      setContent(result.data.content);
      setService(result.data);
      return {
        title: result.data.title,
        slug: result.data.slug,
        short_desc: result.data.short_desc,
        status: result.data.status,
        price: result.data.price,
        details: result.data.details,
        budget: result.data.budget,
        timeline: result.data.timeline,
      };
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newData = {
      ...data,
      content: content,
      imageId: imageId,
    };
    const res = await fetch(apiurl + "services/" + params.id, {
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
      navigate("/admin/services");
    } else {
      toast.error(result.message);
    }
  };

  const handleFile = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);

    try {
      const res = await fetch(apiurl + "temp-images", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!result.status) {
        toast.error(result.errors?.image?.[0] || "Upload failed.");
      } else {
        setImageId(result.data.id);
      }
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Upload error:", error);
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
            <h4 className="text-2xl font-semibold text-gray-800">Services</h4>
            <Link to="/admin/services">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white transition duration-200">
                Back
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    {...register("title", { required: "This title field is required" })}
                    type="text"
                    className={`form-control ${errors.title && "is-invalid"}`}
                  />
                  {errors.title && <p className="invalid-feedback">{errors.title?.message}</p>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Slug</label>
                  <input
                    {...register("slug", { required: "This slug field is required" })}
                    type="text"
                    className={`form-control ${errors.slug && "is-invalid"}`}
                  />
                  {errors.slug && <p className="invalid-feedback">{errors.slug?.message}</p>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Price</label>
                  <input
                    {...register("price")}
                    type="number"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Budget</label>
                  <input
                    {...register("budget")}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label>Timeline</label>
                  <input
                    {...register("timeline")}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label>Short Description</label>
                  <textarea
                    {...register("short_desc", { required: "This Description field is required" })}
                    className={`form-control ${errors.short_desc ? "is-invalid" : ""}`}
                    rows={4}
                  />
                  {errors.short_desc && <p className="invalid-feedback">{errors.short_desc?.message}</p>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label>Details</label>
                  <textarea
                    {...register("details")}
                    className="form-control"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
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
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Image</label>
                  <input
                    onChange={handleFile}
                    type="file"
                    className="form-control"
                  />
                  {service.image && (
                    <img
                      src={fileurl + 'uploads/services/small/' + service.image}
                      alt=""
                      className="my-2 w-32"
                    />
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Status</label>
                  <select
                    {...register("status", { required: "Status is required" })}
                    className={`form-control ${errors.status ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Block</option>
                  </select>
                  {errors.status && <p className="invalid-feedback">{errors.status.message}</p>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button
                  className="w-full border p-2 border-purple-400 rounded-lg font-semibold hover:bg-purple-400 hover:text-white"
                  disabled={isDisable}
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditService;
