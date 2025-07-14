import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiurl } from "../Http";

const ServicesComponent = () => {
  const [services, setServices] = useState([]);

  const fetchLatestServices = async () => {
    try {
      const res = await fetch(apiurl + "get-latest-services?limit=4");
      const result = await res.json();

      console.log("Full API response:", result);

      if (Array.isArray(result)) {
        setServices(result);
      } else {
        setServices([]);
        console.warn("API response is not an array:", result);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  useEffect(() => {
    fetchLatestServices();
  }, []);

  return (
    <section className="bg-gray-100">
      <div className="container">
        <div className="py-3">
          <div className="text-center py-10 px-4">
            <span className="text-sm uppercase font-bold text-purple-600">
              Our Services
            </span>
            <h2 className="!text-4xl font-bold my-2">
              Our Construction Services
            </h2>
            <p className="text-gray-700 mx-auto">
              We offer a diverse array of construction services, spanning
              residential, commercial, and industrial projects.
            </p>
          </div>

          <div className="row">
            {services && services.length > 0 ? (
              services.map((service, i) => (
                <div className="col-md-3 mb-5" key={i}>
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                    <img
                      src={
                        service.image
                          ? `http://localhost:8000/uploads/services/small/${service.image}`
                          : "https://via.placeholder.com/400x200.png?text=No+Image"
                      }
                      alt={service.title}
                      className="w-full h-52 object-cover rounded-t-2xl bg-gray-200"
                    />

                    <div className="px-4 py-5 flex flex-col flex-grow">
                      <h5 className="text-lg text-center font-semibold text-gray-800 mb-3">
                        {service.title}
                      </h5>
                      <p className="text-sm text-left text-gray-600 flex-grow line-clamp-4">
                        {service.short_desc}
                      </p>
                      <Link
                        to={`/services/${service.id}`}
                        className="inline-block mt-4"
                      >
                        <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-600 hover:text-white transition duration-200">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-12">No services found.</div>
            )}

            <Link to="/services">
              <div className="text-center">
                <button className="mb-4 bg-purple-600 text-white px-6 py-2 !rounded-md font-semibold hover:bg-purple-700 transition duration-200 shadow-md">
                  View All Services
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesComponent;
