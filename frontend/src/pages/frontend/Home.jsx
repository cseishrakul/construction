import React, { useEffect, useState } from "react";
import AboutComponent from "../../components/frontend/home/AboutComponent";
import Hero from "../../components/frontend/home/Hero";
import ServicesComponent from "../../components/frontend/home/ServicesComponent";
import Choose from "../../components/frontend/home/Choose";
import ProjectsComponent from "../../components/frontend/home/ProjectsComponent";
import Testimonial from "../../components/frontend/home/Testimonial";
import BlogsComponent from "../../components/frontend/home/BlogsComponent";
import { apiurl, token } from "../../components/frontend/Http";

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* About Us Section */}
      <AboutComponent />

      {/* Our  services */}
      <ServicesComponent />

      {/* Why Choose Us */}
      <Choose />
      {/* Our  Projects */}
      <ProjectsComponent />
      {/* Testimonials */}
      <Testimonial />
      {/* Blogs */}
      <BlogsComponent />
    </main>
  );
};

export default Home;
