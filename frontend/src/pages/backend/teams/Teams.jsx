import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import { apiurl, token } from "../../../components/frontend/Http";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async () => {
    const res = await fetch(apiurl + "teams", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    const result = await res.json();
    setTeams(result.data);
  };

  const deleteTeam = async (id) => {
    if (confirm("Are you sure you want to delete?")) {
      const res = await fetch(apiurl + "teams/" + id, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();
      if (result.status === true) {
        setTeams(teams.filter((item) => item.id !== id));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const openModal = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  return (
    <main className="p-5">
      <div className="flex gap-6">
        <div className="w-64">
          <Sidebar />
        </div>

        <div className="flex-grow bg-white shadow rounded-lg p-6 min-h-[450px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-semibold text-gray-800">Team Members</h4>
            <Link to="/admin/teams/create">
              <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white">
                Add Member
              </button>
            </Link>
          </div>

          <hr className="mb-4 border-gray-300" />

          <div className="overflow-x-auto">
            <table className="table-auto w-full border text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Phone</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((member) => (
                  <tr key={member.id}>
                    <td className="py-2 px-4 border">{member.id}</td>
                    <td className="py-2 px-4 border">
                      <img
                        src={
                          member.image
                            ? `https://construction-aqri.onrender.com/uploads/teams/small/${member.image}`
                            : "https://via.placeholder.com/100x100.png?text=No+Image"
                        }
                        alt={member.name}
                        className="w-16 h-16 object-cover rounded-full mx-auto"
                      />
                    </td>
                    <td className="py-2 px-4 border">{member.name}</td>
                    <td className="py-2 px-4 border">{member.phone}</td>
                    <td className="py-2 px-4 border">{member.email}</td>
                    <td className="py-2 px-4 border">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal(member)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          <FaEye />
                        </button>
                        <Link to={`/admin/teams/edit/${member.id}`}>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                            <FaEdit />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteTeam(member.id)}
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

          {showModal && selectedTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-red-500"
                >
                  ✖
                </button>
                <h2 className="text-xl font-semibold mb-4">
                  {selectedTeam.name}
                </h2>
                <img
                  src={
                    selectedTeam.image
                      ? `https://construction-aqri.onrender.com/uploads/teams/large/${selectedTeam.image}`
                      : "https://via.placeholder.com/300x200.png?text=No+Image"
                  }
                  alt={selectedTeam.name}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <p><strong>Phone:</strong> {selectedTeam.phone}</p>
                <p><strong>Email:</strong> {selectedTeam.email}</p>
                <p><strong>Role:</strong> {selectedTeam.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Teams;
