import React from 'react'
import ServicesComponent from '../../components/frontend/home/ServicesComponent'
import heroImg from "../../assets/about-us.jpg";
import Hero from "../../components/frontend/Hero";

const Services = () => {
  return (
    <main className="">
        <Hero
        title="Our Services"
        subtitle="Learn more about our mission, vision, and values."
        image={heroImg}
      />
        <ServicesComponent />
    </main>
  )
}

export default Services