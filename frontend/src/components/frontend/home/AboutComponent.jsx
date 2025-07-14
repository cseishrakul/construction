import React from 'react'
import AboutImg from "../../../assets/about-us.jpg";

const AboutComponent = () => {
  return (
    <section className="py-5">
           <div className="container">
             <div className="row">
               <div className="col-md-6 my-3">
                 <img src={AboutImg} alt="" className="rounded-xl" />
               </div>
               <div className="col-md-6 my-3">
                 <span className="text-purple-400 font-bold text-md text-uppercase">
                   About Us
                 </span>
                 <hr className="w-10 border-3 !text-purple-600 mt-1" />
                 <h2 className="my-3 font-bold">
                   {" "}
                   Crafting structures that a lifetime{" "}
                 </h2>
                 <p className="my-3">
                   {" "}
                   Building enduring structures requires a comprehensive approach
                   that combines advanced materials, resilient design, routine
                   maintenance,and sustainable practices. By drawing on historical
                   insights and utlizing modern technology.{" "}
                 </p>
                 <p className="mt-3">
                   {" "}
                   Designing structures that stand the test of time involves a
                   seamless blend of cutting-edge materials, durable design,
                   ongoing unkeep, and eco-friendly practices. By combining lessons
                   from the past with the power of modern technology.{" "}
                 </p>
               </div>
             </div>
           </div>
         </section>
  )
}

export default AboutComponent