import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiurl } from '../../components/frontend/Http';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(apiurl + `services/${id}`);
        const result = await res.json();

        if (result.status) {
          setService(result.data);
        } else {
          console.error('Service not found');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!service) {
    return <div className="text-center py-10 text-red-600">Service not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-700">{service.title}</h1>
          <p className="text-sm text-gray-500 italic mt-1">Slug: {service.slug}</p>
          <p className="text-sm mt-1">
            <span className="font-semibold text-gray-700">Status:</span>{' '}
            <span className={service.status === 1 ? 'text-green-600' : 'text-red-600'}>
              {service.status === 1 ? 'Active' : 'Inactive'}
            </span>
          </p>
        </div>

        {/* Image */}
        <div className="mb-10">
          <img
            src={
              service.image
                ? `https://construction-aqri.onrender.com/uploads/services/large/${service.image}`
                : 'https://via.placeholder.com/600x300.png?text=No+Image'
            }
            alt={service.title}
            className="w-full h-64 object-contain rounded-xl"
          />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-700">Short Description</h4>
            <p className="text-gray-600">{service.short_desc}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Content</h4>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Price</h4>
            <p className="text-gray-600">৳ {parseFloat(service.price).toLocaleString()}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Budget</h4>
            <p className="text-gray-600">{service.budget || 'N/A'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Timeline</h4>
            <p className="text-gray-600">{service.timeline || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
