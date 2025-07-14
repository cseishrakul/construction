import React from 'react'
import BlogsComponent from '../../components/frontend/home/BlogsComponent'
import Hero from '../../components/frontend/Hero'
import heroImg from "../../assets/about-us.jpg";


const Blog = () => {
  return (
    <main className="">
        <Hero
        title="Blogs"
        subtitle="Learn more about our mission, vision, and values."
        image={heroImg}
      />
        <BlogsComponent />
    </main>
  )
}

export default Blog