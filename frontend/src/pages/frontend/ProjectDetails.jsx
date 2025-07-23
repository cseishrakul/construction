import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiurl } from "../../components/frontend/Http";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(apiurl + `projects/${id}`);
        const result = await res.json();

        if (result.status) {
          setProject(result.data);
        } else {
          console.error("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-10 text-red-600">Project not found</div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
        {/* Title and Slug */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-700">
            {project.title}
          </h1>
        </div>

        {/* Image */}
        <div className="mb-10">
          <img
            src={
              project.image}
            alt={project.title}
            className="w-full h-64 object-contain rounded-xl"
          />
        </div>

        {/* Basic Details */}
        <div className="row">
          <div className="col-md-4">
            <h4 className="font-semibold text-gray-700">Construction Type</h4>
            <p className="text-gray-600">{project.construction_type}</p>
          </div>
          <div className="col-md-4">
            <h4 className="font-semibold text-gray-700">Sector</h4>
            <p className="text-gray-600">{project.sector}</p>
          </div>
          <div className="col-md-4">
            <h4 className="font-semibold text-gray-700">Location</h4>
            <p className="text-gray-600">{project.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-700">Short Description</h4>
            <p className="text-gray-600">{project.short_desc}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Content</h4>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
