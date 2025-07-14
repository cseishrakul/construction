import React from "react";
import heroImage from "../../../assets/hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section>
      <div
        className="h-[600px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4 flex flex-col items-center">
            <span className="text-lg text-purple-400 font-bold">
              Welcome Amazing Constructions
            </span>
            <h1 className="text-5xl md:!text-6xl font-bold mt-1">
              Crafting dreams with <br /> precision and excellence.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto">
              We excel at transforming visions into reality through outstanding
              craftsmanship and precision.
            </p>

            {/* Buttons below the text */}
            <div className="mt-6 space-x-4">
              <Link to="/contact">
                <button className="bg-purple-400 !text-black px-6 py-2 !rounded-md font-semibold hover:bg-transparent hover:border hover:border-white hover:!text-white transition">
                  Contact Now
                </button>
              </Link>
              <Link to="/projects">
                <button className="bg-transparent border border-white text-white px-6 py-2 !rounded-md font-semibold hover:!bg-white hover:!text-black transition">
                  View Project
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
