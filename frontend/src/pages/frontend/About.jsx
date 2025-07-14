import React from 'react'
import AboutComponent from '../../components/frontend/home/AboutComponent'
import Team from '../../components/frontend/about/Team'
import Hero from '../../components/frontend/Hero'
import heroImg from "../../assets/about-us.jpg";

const About = () => {
  return (
    <main className="pb-5">
       <Hero
        title="About Us"
        subtitle="Learn more about our mission, vision, and values."
        image={heroImg}
      />
      <AboutComponent />
      <Team />
    </main>
  )
}

export default About