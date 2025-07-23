import { Link, NavLink, useLocation } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../assets/logo.jpg";
const Footer = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/projects", label: "Projects" },
    { to: "/blogs", label: "Blogs" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <footer className="bg-black text-white pt-10 pb-4">
      <div className="container">
        <div className="flex flex-wrap -mx-3">
          {/* Column 1 */}
          <div className="w-full md:w-1/2 lg:w-1/4 px-3 mb-8 md:mb-0">
            <img src={logo} alt="Logo" className="w-[60px] h-[70px] mb-3" />
            <p className="text-sm text-gray-300">
              Our post-construction services give you peace of mind knowing that
              we are still here for you even after.
            </p>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 px-3 mb-8 md:mb-0">
            <h3 className="!text-purple-500 text-xl font-bold mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `text-sm font-semibold no-underline ${
                        isActive
                          ? "text-purple-500"
                          : "text-white hover:text-purple-400"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 px-3 mb-8 md:mb-0">
            <h3 className="!text-purple-500 text-xl font-bold mb-3">
              Working Hours
            </h3>
            <ul className="text-sm text-white space-y-2">
              <li>Mon - Fri: 9:00 AM - 6:00 PM</li>
              <li>Saturday: 10:00 AM - 4:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="w-full sm:w-1/2 lg:w-1/4 px-3">
            <h3 className="!text-purple-500 text-xl font-bold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-white">
              <li className="flex items-center gap-2">
                <FaPhone className="text-purple-400" />
                <span>+880 1734 567890</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-purple-400" />
                <span>contact@buildCraft.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-400" />
                <span>Sylhet, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />
        <p className="text-center text-sm text-gray-400">
          © 2025 Construction. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
