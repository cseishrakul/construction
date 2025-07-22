import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditService = () => {
  const { id } = useParams();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch existing data
  useEffect(() => {
    axios.get(`/api/services/${id}`)
      .then(res => {
        const data = res.data.data;
        reset(data);
        setPreview(data.image);
      })
      .catch(err => console.error(err));
  }, [id, reset]);

  // Handle file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Upload to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'react_unsigned'); // Replace
    formData.append('cloud_name', 'dwelnewv8'); // Replace

    try {
      setImageUploading(true);
      const res = await axios.post('https://api.cloudinary.com/v1_1/dwelnewv8/image/upload', formData);
      setImageUploading(false);
      return {
        url: res.data.secure_url,
        public_id: res.data.public_id,
      };
    } catch (err) {
      setImageUploading(false);
      console.error('Cloudinary Upload Failed:', err);
      return null;
    }
  };

  // Submit form
  const onSubmit = async (data) => {
    setLoading(true);

    let imageData = null;
    if (imageFile) {
      imageData = await uploadImageToCloudinary();
      if (!imageData) {
        alert('Image upload failed!');
        setLoading(false);
        return;
      }
      data.image = imageData.url;
      data.image_public_id = imageData.public_id;
    }

    try {
      const res = await axios.put(`/api/services/${id}`, data);
      if (res.data.status) {
        alert('Service updated successfully!');
      } else {
        alert('Error: ' + JSON.stringify(res.data.errors || res.data.message));
      }
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Service</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">

        <input {...register('title')} placeholder="Title" className="border p-2" />
        <input {...register('slug')} placeholder="Slug (optional)" className="border p-2" />
        <input {...register('short_desc')} placeholder="Short Description" className="border p-2" />
        <textarea {...register('content')} placeholder="Content" className="border p-2" />
        <input {...register('price')} placeholder="Price" className="border p-2" />
        <input {...register('details')} placeholder="Details" className="border p-2" />
        <input {...register('budget')} placeholder="Budget" className="border p-2" />
        <input {...register('timeline')} placeholder="Timeline" className="border p-2" />

        <select {...register('status')} className="border p-2">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div>
          {preview && (
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover mb-2" />
          )}
          <input type="file" onChange={handleImageChange} className="border p-2" />
        </div>

        <button
          type="submit"
          disabled={loading || imageUploading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Updating...' : 'Update Service'}
        </button>
      </form>
    </div>
  );
};

export default EditService;
