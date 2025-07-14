import React from "react";
import ProjectsComponent from "../../components/frontend/home/ProjectsComponent";
import heroImg from "../../assets/about-us.jpg";
import Hero from "../../components/frontend/Hero";

const Projects = () => {
  return (
    <main className="">
       <Hero
        title="Our Projects"
        subtitle="Learn more about our mission, vision, and values."
        image={heroImg}
      />
      <ProjectsComponent />
    </main>
  );
};

export default Projects;
