import React from "react";
import Icone1 from "../../../assets/icon-1.svg";
import Icone2 from "../../../assets/icon-2.svg";
import Icone3 from "../../../assets/icon-3.svg";

const Choose = () => {
  return (
    <section className="">
      <div className="container">
        <div className="text-center py-10 px-4">
          <span className="text-sm uppercase font-bold text-purple-600">
            Why Choose Us
          </span>
          <h2 className="!text-4xl font-bold my-2">
            Discover our wide variety of projects
          </h2>
          <p className="text-gray-700 mx-auto">
            We offer a diverse array of construction services, spanning
            residential, commercial, and industrial projects.
          </p>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex justify-center">
                <img
                  src={Icone1}
                  alt="Cutting-Edge Solutions"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Cutting-Edge Solutions
              </h3>
              <p className="text-gray-600 text-sm">
                Small actions create big impacts. It all begins and ends with
                each employee committing to safer work practices daily, ensuring
                they return safely.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex justify-center">
                <img
                  src={Icone2}
                  alt="Cutting-Edge Solutions"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Cutting-Edge Solutions
              </h3>
              <p className="text-gray-600 text-sm">
                Small actions create big impacts. It all begins and ends with
                each employee committing to safer work practices daily, ensuring
                they return safely.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex justify-center">
                <img
                  src={Icone3}
                  alt="Cutting-Edge Solutions"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Cutting-Edge Solutions
              </h3>
              <p className="text-gray-600 text-sm">
                Small actions create big impacts. It all begins and ends with
                each employee committing to safer work practices daily, ensuring
                they return safely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Choose;
