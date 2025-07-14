import { useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/logo.jpg";

const Menu = () => {
  const [activeLink, setActiveLink] = useState("/");
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/projects", label: "Projects" },
    { to: "/blogs", label: "Blogs" },
    { to: "/contact", label: "Contact Us" },
    { to: "/admin/login", label: "Login" },
  ];

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <Navbar expand="lg" className="py-3">
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="text-xl font-bold !text-purple-600"
          >
            <img src={logo} alt="Logo" className="w-[60px] h-[70px]" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="ms-auto flex flex-col lg:flex-row gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => handleLinkClick(link.to)}
                  className={`text-sm font-semibold mt-2 lg:mt-0 ${
                    activeLink === link.to
                      ? "!text-purple-600"
                      : "!text-gray-500"
                  } !no-underline`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </header>
  );
};

export default Menu;
