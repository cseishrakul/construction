import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {AuthContext} from '../context/Auth';

const Sidebar = () => {
    const {logout} = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Services", path: "/admin/services", icon: "🛠️" },
    { name: "Projects", path: "/admin/projects", icon: "📂" },
    { name: "Blogs", path: "/admin/blogs", icon: "📂" },
    { name: "Teams", path: "/admin/teams", icon: "👨‍👨" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-b from-purple-50 to-indigo-50">
      <div className="bg-white shadow-xl rounded-r-xl p-6 w-72 flex flex-col border-r border-gray-200">
        <div className="mb-8">
          <h4 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Admin Panel
          </h4>
          <p className="text-sm text-gray-500 text-center">Welcome back!</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-1 py-3 !text-gray-600 hover:bg-purple-50 hover:!text-purple-700 rounded-lg transition-all duration-200 !no-underline group
                    ${
                      location.pathname === item.path
                        ? "bg-purple-100 text-purple-700 font-medium"
                        : ""
                    }`}
                >
                  <span className="mr-3 text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <span className="ml-auto w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]" onClick={logout}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
