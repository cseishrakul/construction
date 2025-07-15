import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiurl } from "../Http";

const ProjectsComponent = () => {
  const [projects, setProjects] = useState([]);

  const fetchLatestProjects = async () => {
    try {
      const res = await fetch(apiurl + "get-latest-projects?limit=4");
      const result = await res.json();

      console.log("Project API response:", result);

      if (Array.isArray(result.data)) {
        setProjects(result.data);
      } else {
        setProjects([]);
        console.warn("Invalid project data structure:", result);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchLatestProjects();
  }, []);

  return (
    <section className="bg-gray-100">
      <div className="container">
        <div className="py-3">
          <div className="text-center py-10 px-4">
            <span className="text-sm uppercase font-bold text-purple-600">
              Our Projects
            </span>
            <h2 className="!text-4xl font-bold my-2">
              Our Construction Projects
            </h2>
            <p className="text-gray-700 mx-auto">
              We offer a diverse array of construction services, spanning
              residential, commercial, and industrial projects.
            </p>
          </div>

          <div className="row">
            {projects && projects.length > 0 ? (
              projects.map((project, i) => (
                <div className="col-md-3 mb-5" key={i}>
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                    <img
                      src={
                        project.image
                          ? `https://construction-aqri.onrender.com/uploads/projects/small/${project.image}`
                          : "https://via.placeholder.com/400x200.png?text=No+Image"
                      }
                      alt={project.title}
                      className="w-full h-52 object-cover bg-white rounded-t-2xl"
                    />
                    <div className="px-3 py-4 flex flex-col flex-grow">
                      <h5 className="text-md text-center font-semibold text-gray-800 mb-2">
                        {project.title}
                      </h5>
                      <p className="text-sm text-left text-gray-600 flex-grow line-clamp-4">
                        {project.short_desc}
                      </p>
                      <p className="text-sm text-left text-gray-600 flex-grow line-clamp-4">
                        {project.construction_type}
                      </p>
                      <p className="text-sm text-left text-gray-600 flex-grow line-clamp-4">
                        {project.location}
                      </p>
                      <Link
                        to={`/projects/${project.id}`}
                        className="inline-block mt-3"
                      >
                        <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-600 hover:text-white transition duration-200">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-12">No projects found.</div>
            )}
          </div>

          <Link to="/projects">
            <div className="text-center">
              <button className="mb-4 bg-purple-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-purple-700 transition duration-200 shadow-md">
                View All Projects
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsComponent;
