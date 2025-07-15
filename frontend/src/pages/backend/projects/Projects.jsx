import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { apiurl, token } from "../../../components/frontend/Http";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    const res = await fetch(apiurl + "projects", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    const result = await res.json();
    setProjects(result.data);
  };

  const deleteProject = async (id) => {
    if (confirm("Are you sure you want to delete?")) {
      const res = await fetch(apiurl + "projects/" + id, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();

      if (result.status === true) {
        const newProjects = projects.filter((project) => project.id !== id);
        setProjects(newProjects);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

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
            <h4 className="text-2xl font-semibold text-gray-800">Projects</h4>
            <Link to="/admin/projects/create">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white transition duration-200">
                Create
              </button>
            </Link>
          </div>
          <hr className="mb-4 border-gray-300" />

          <div className="overflow-x-auto">
            <table className="table-auto w-full border text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Location</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects &&
                  projects.map((project) => (
                    <tr key={project.id}>
                      <td className="py-2 px-4 border">
                        <img
                          src={
                            project.image
                              ? `https://construction-aqri.onrender.com/uploads/projects/small/${project.image}`
                              : "https://via.placeholder.com/100x60.png?text=No+Image"
                          }
                          alt={project.title}
                          className="w-20 h-14 object-cover mx-auto rounded"
                        />
                      </td>
                      <td className="py-2 px-4 border">{project.title}</td>
                      <td className="py-2 px-4 border">{project.location}</td>
                      <td className="py-2 px-4 border">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                            project.status == 1 ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {project.status == 1 ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(project)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          >
                            <FaEye />
                          </button>
                          <Link to={`/admin/projects/edit/${project.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                              <FaEdit />
                            </button>
                          </Link>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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

          {/* MODAL */}
          {showModal && selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-red-500"
                >
                  ✖
                </button>
                <h2 className="text-xl font-semibold mb-4">
                  {selectedProject.title}
                </h2>
                <img
                  src={
                    selectedProject.image
                      ? `http://localhost:8000/uploads/projects/small/${selectedProject.image}`
                      : "https://via.placeholder.com/400x200.png?text=No+Image"
                  }
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <p>
                  <strong>Slug:</strong> {selectedProject.slug}
                </p>
                <p>
                  <strong>Location:</strong> {selectedProject.location}
                </p>
                <p>
                  <strong>Type:</strong> {selectedProject.construction_type}
                </p>
                <p>
                  <strong>Sector:</strong> {selectedProject.sector}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                      selectedProject.status == 1 ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {selectedProject.status == 1 ? "Active" : "Blocked"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Projects;
