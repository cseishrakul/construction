import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/frontend/Home";
import About from "./pages/frontend/About";
import Menu from "./components/frontend/Menu";
import Footer from "./components/frontend/Footer";
import Services from "./pages/frontend/Services";
import Projects from "./pages/frontend/Projects";
import Blog from "./pages/frontend/Blog";
import ContactUs from "./pages/frontend/ContactUs";
import Login from "./pages/backend/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/backend/Dashboard";
import RequireAuth from "./components/backend/context/RequireAuth";
import { default as ShowServices } from "./pages/backend/services/Services";
import CreateServices from "./pages/backend/services/CreateServices";
import EditService from "./pages/backend/services/EditService";
import AdminProjects from "./pages/backend/projects/Projects";
import CreateProject from "./pages/backend/projects/CreateProjects";
import Editproject from "./pages/backend/projects/EditProjects";
import ServiceDetails from "./pages/frontend/ServiceDetails";
import ProjectDetails from "./pages/frontend/ProjectDetails";
import AdminBlogs from "./pages/backend/blogs/Blogs";
import CreateBlogs from "./pages/backend/blogs/CreateBlogs";
import EditBlogs from "./pages/backend/blogs/EditBlogs";
import Teams from "./pages/backend/teams/Teams";
import CreateTeam from "./pages/backend/teams/CreateTeam";
import EditTeam from "./pages/backend/teams/EditTeam";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Menu />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <RequireAuth>
                    <ShowServices />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/services/create"
                element={
                  <RequireAuth>
                    <CreateServices />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/services/edit/:id"
                element={
                  <RequireAuth>
                    <EditService />
                  </RequireAuth>
                }
              />

              {/* Project Routes */}
              <Route
                path="/admin/projects"
                element={
                  <RequireAuth>
                    <AdminProjects />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/projects/create"
                element={
                  <RequireAuth>
                    <CreateProject />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/projects/edit/:id"
                element={
                  <RequireAuth>
                    <Editproject />
                  </RequireAuth>
                }
              />

              {/* Blog Routes */}
              <Route
                path="/admin/blogs"
                element={
                  <RequireAuth>
                    <AdminBlogs />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/blogs/create"
                element={
                  <RequireAuth>
                    <CreateBlogs />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/blogs/edit/:id"
                element={
                  <RequireAuth>
                    <EditBlogs />
                  </RequireAuth>
                }
              />
              {/* Team Routes */}
              <Route
                path="/admin/teams"
                element={
                  <RequireAuth>
                    <Teams />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/teams/create"
                element={
                  <RequireAuth>
                    <CreateTeam />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/teams/edit/:id"
                element={
                  <RequireAuth>
                    <EditTeam />
                  </RequireAuth>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
