import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { Link } from "react-router-dom";
import { apiurl, token } from "../../../components/frontend/Http";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchServices = async () => {
    const res = await fetch(apiurl + "services", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    const result = await res.json();
    setServices(result.data);
  };

  const deleteService = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Service will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(apiurl + "services/" + id, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
          },
        });

        const result = await res.json();

        if (result.status === true) {
          const newServices = services.filter((service) => service.id !== id);
          setServices(newServices);

          Swal.fire("Deleted!", result.message, "success");
        } else {
          Swal.fire("Error!", result.message, "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong!", "error");
      }
    }
  };

  const handleShow = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedService(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <main className="p-5">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-white shadow rounded-lg p-6 min-h-[450px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-semibold text-gray-800">Services</h4>
            <Link to="/admin/services/create">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 !rounded-lg text-white transition duration-200">
                Create
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />
          <table className="table-auto w-full border text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Image</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Slug</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {services &&
                services.map((service) => (
                  <tr key={service.id} className="text-center">
                    <td className="py-2 px-4 border">{service.id}</td>
                    <td className="py-2 px-4 border">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-20 h-16 object-contain mx-auto"
                      />
                    </td>
                    <td className="py-2 px-4 border">{service.title}</td>
                    <td className="py-2 px-4 border">{service.slug}</td>
                    <td className="py-2 px-4 border">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                          service.status == 1 ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {service.status == 1 ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => handleShow(service)}
                        >
                          <FaEye />
                        </button>
                        <Link to={`/admin/services/edit/${service.id}`}>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                            <FaEdit />
                          </button>
                        </Link>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => deleteService(service.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[600px] max-h-[90vh] overflow-auto p-6 rounded-xl shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-red-600"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {selectedService.title}
            </h2>
            <img
              src={selectedService.image}
              alt={selectedService.title}
              className="w-full h-48 object-contain rounded mb-4"
            />
            <p>
              <strong>Slug:</strong> {selectedService.slug}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedService.status == 1 ? "Active" : "Block"}
            </p>
            <p>
              <strong>Short Description:</strong> {selectedService.short_desc}
            </p>
            <p>
              <strong>Content:</strong>
            </p>
            <div
              className="bg-gray-100 p-3 rounded mt-1 mb-2 text-sm"
              dangerouslySetInnerHTML={{ __html: selectedService.content }}
            />
            <p>
              <strong>Price:</strong> {selectedService.price || "N/A"}
            </p>
            <p>
              <strong>Budget:</strong> {selectedService.budget || "N/A"}
            </p>
            <p>
              <strong>Timeline:</strong> {selectedService.timeline || "N/A"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Services;
