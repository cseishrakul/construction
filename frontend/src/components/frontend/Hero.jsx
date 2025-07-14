import React from "react";

const Hero = ({ title, subtitle, image, overlay = true, height = "450px" }) => {
  return (
    <section>
      <div
        className={`bg-cover bg-center bg-no-repeat relative`}
        style={{ backgroundImage: `url(${image})`, height }}
      >
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30"></div>
        )}

        <div className="container relative z-10 h-full flex items-center px-6 md:px-20">
          <div className="text-white max-w-xl">
            <span className="text-base md:text-lg text-purple-400 font-semibold tracking-wider uppercase">
              Quality. Integrity. Value.
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
              {title}
            </h1>

            <p className="mt-4 text-sm md:text-base text-gray-300 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
