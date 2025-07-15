import React, { useEffect, useState } from "react";
import Sidebar from "../../components/backend/dashboard/Sidebar";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    blogs: 0,
    teams: 0,
  });
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const apiurl = "https://construction-aqri.onrender.com/api/";
  const userData = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userData.token || null;
  const fetchStats = async () => {
    try {
      const res = await fetch(apiurl + "dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      if (data.status) {
        setStats(data.data);
      } else {
        toast.error("Failed to load stats");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchProfile = async () => {
    try {
      const res = await fetch(apiurl + "profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      if (data.status) {
        setProfile(data.data);
        setFormData({ name: data.data.name, email: data.data.email });
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("No authentication token found. Please login.");
      return;
    }
    fetchStats();
    fetchProfile();
  }, [token]);
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apiurl + "profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status) {
        setProfile(data.data);
        toast.success(data.message);
        setEditMode(false);
      } else {
        if (data.errors) {
          Object.values(data.errors).forEach((err) => toast.error(err[0]));
        } else {
          toast.error("Failed to update profile");
        }
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
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
          <h4 className="text-2xl font-semibold mb-6">Dashboard</h4>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-purple-500 text-white rounded p-4 shadow">
              <h5>Total Services</h5>
              <p className="text-3xl font-bold">{stats.services}</p>
            </div>
            <div className="bg-blue-500 text-white rounded p-4 shadow">
              <h5>Total Projects</h5>
              <p className="text-3xl font-bold">{stats.projects}</p>
            </div>
            <div className="bg-green-500 text-white rounded p-4 shadow">
              <h5>Total Blogs</h5>
              <p className="text-3xl font-bold">{stats.blogs}</p>
            </div>
            <div className="bg-yellow-500 text-white rounded p-4 shadow">
              <h5>Total Team Members</h5>
              <p className="text-3xl font-bold">{stats.teams}</p>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="border p-8 rounded-lg shadow-lg max-w-full bg-white mx-auto">
            <h5 className="text-2xl font-semibold mb-6 text-gray-800">
              User Profile
            </h5>

            {!editMode ? (
              <div>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Name:</span>{" "}
                  {profile?.name || "Loading..."}
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Email:</span>{" "}
                  {profile?.email || "Loading..."}
                </p>
                <button
                  className="mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded text-white font-medium shadow"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile & Password
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-gray-700">
                      Old Password
                    </label>
                    <input
                      type="password"
                      name="old_password"
                      value={formData.old_password || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Required if changing password"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Leave blank if no change"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Leave blank if no change"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded text-white font-semibold shadow"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 transition rounded text-gray-800 font-semibold"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: profile.name,
                        email: profile.email,
                        old_password: "",
                        password: "",
                        password_confirmation: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
