import React from "react";
import AvatarImage from "../../../assets/author-2.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaStar } from "react-icons/fa";

const Testimonial = () => {
  return (
    <section className="bg-gray-100">
      <div className="container py-5">
        {" "}
        <div className="py-3">
          <div className="text-center py-10 px-4">
            <span className="text-sm uppercase font-bold text-purple-600">
              Testimonials
            </span>
            <h2 className="!text-4xl font-bold my-2">
              What people are saying about us
            </h2>
            <p className="text-gray-700 mx-auto">
              We offer a diverse array of construction services, spanning
              residential, commercial, and industrial projects.
            </p>
          </div>
          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {[...Array(5)].map((_, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-1 mb-3 text-purple-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-purple-500" />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. In
                    quasi non reprehenderit suscipit vel architecto neque error
                    consequatur mollitia, ea accusantium exercitationem ratione
                    est provident quam explicabo necessitatibus cupiditate.
                    Magnam!
                  </p>

                  <hr className="my-4 border-gray-200" />

                  <div className="flex items-center gap-4">
                    <img
                      src={AvatarImage}
                      alt="Jhon Doe"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-gray-900 font-semibold text-sm">
                        Jhon Doe
                      </h5>
                      <p className="text-gray-500 text-xs">CEO</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
