import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiurl } from "../Http";

const BlogsComponent = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(apiurl + "get-blogs");
      const result = await res.json();

      if (Array.isArray(result.data)) {
        setBlogs(result.data);
      } else {
        setBlogs([]);
        console.warn("Invalid blog data structure:", result);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <section className="bg-gray-100">
      <div className="container py-5">
        <div className="text-center pb-10 px-4">
          <span className="text-sm uppercase font-bold text-purple-600">
            Blog & News
          </span>
          <h2 className="!text-4xl font-bold my-2">Articles & Blog Posts</h2>
          <p className="text-gray-700 mx-auto">
            Explore our latest blog posts and news updates.
          </p>
        </div>

        <div className="row">
          {blogs.length > 0 ? (
            blogs.map((blog, i) => (
              <div className="col-md-4 mb-5" key={i}>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-52 object-cover bg-white rounded-t-2xl"
                  />
                  <div className="px-3 py-4 flex flex-col flex-grow">
                    <h5 className="text-md text-center font-semibold text-gray-800 mb-2">
                      {blog.title}
                    </h5>
                    <p className="text-sm text-left text-gray-600 flex-grow line-clamp-3">
                      {blog.short_desc}
                    </p>
                    <div
                      className="text-sm text-left text-gray-600 flex-grow line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center col-12">No blogs found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogsComponent;
