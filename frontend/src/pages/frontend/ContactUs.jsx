import React, { useState } from "react";
import heroImg from "../../assets/about-us.jpg";
import Hero from "../../components/frontend/Hero";
import { useForm } from "react-hook-form";
import { apiurl } from "../../components/frontend/Http";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(apiurl + "contact-now", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Hero
        title="Contact Us"
        subtitle="Learn more about our mission, vision, and values."
        image={heroImg}
      />

      <section className="py-16 bg-gray-100">
        <div className="container">
          <div className="row">
            {/* Left: Contact Info */}
            <div className="col-md-3 mb-4">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Contact Info
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Phone:</strong> +880 1734 567890
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Email:</strong> contact@buildCraft.com
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Address:</strong> Sylhet, Bangladesh
                </p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="col-md-9">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6 text-gray-800">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        {...register("name", {
                          required: "The name field is required",
                        })}
                        type="text"
                        placeholder="Your Name"
                        className={`w-full border border-gray-300 rounded-md p-2 form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="invalid-feedback">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        {...register("email", {
                          required: "The email field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        placeholder="you@example.com"
                        className={`w-full border border-gray-300 rounded-md p-2 form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="invalid-feedback">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        {...register("subject", {
                          required: "The subject field is required",
                        })}
                        type="text"
                        placeholder="Subject"
                        className={`w-full border border-gray-300 rounded-md p-2 form-control ${
                          errors.subject ? "is-invalid" : ""
                        }`}
                      />
                      {errors.subject && (
                        <p className="invalid-feedback">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        {...register("phone", {
                          required: "The phone number is required",
                        })}
                        type="tel"
                        placeholder="+880..."
                        className={`w-full border border-gray-300 rounded-md p-2 form-control ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="invalid-feedback">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="col-12 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        {...register("message", {
                          required: "The message is required",
                        })}
                        rows="4"
                        placeholder="Your message..."
                        className={`w-full border border-gray-300 rounded-md p-2 form-control ${
                          errors.message ? "is-invalid" : ""
                        }`}
                      ></textarea>
                      {errors.message && (
                        <p className="invalid-feedback">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-6 !rounded-md hover:bg-purple-700 transition"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
