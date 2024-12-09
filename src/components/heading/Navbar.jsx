import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import stgonclogo from "../../static/images/STGONC-Logo.png";
import Profile from "../userProfile/Profile";
import Menu from "../../static/images/menu.png";
import { useMediaQuery } from "react-responsive";
const Navbar = ({ sidebarLinks }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  const defaultNavLinks = [
    {
      name: "About Us",
      link: "/Aboutus",
      inAuthHide: false,
      beforeMDHide: false,
    },
    {
      name: "Contact Us",
      link: "/Contactus",
      inAuthHide: false,
      beforeMDHide: false,
    },
  ];

  const navLinks = [...sidebarLinks, ...defaultNavLinks];

  const authLinks = [
    { name: "Login", link: "/auth/Login", inAuthHide: true, style: "" },
    {
      name: "Register",
      link: "/auth/StudentRegistration",
      inAuthHide: true,
      style: "rounded-3xl border-solid border-2 border-white px-8 py-2",
    },
  ];
  const handleOpenMenu = () => setMenuIsOpen(!menuIsOpen);

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (currentUser && currentUser?.role) {
      navigate(`/private/${currentUser?.role}/dashboard`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="navbar-container bg-[#360000] flex fixed items-center w-full justify- z-20 p-[20px] xsm:p-3">
      <div className="logo-wrapper flex-1 flex flex-row items-center justify-start w-[15%]">
        <button
          href="#"
          onClick={handleLogoClick}
          className="text-[36px] xsm:text-[16px] bg-transparent flex flex-row items-center gap-3"
        >
          <img
            src={stgonclogo}
            alt="stgonc-logo"
            className="w-[45px] xsm:w-[25px]"
          />
          stgonc
        </button>
      </div>
      <div className="mobile-nav-links hidden md:flex flex-col flex-1 items-center">
        <img
          className="w-[25px]"
          onClick={handleOpenMenu}
          src={Menu}
          alt="Menu"
        />
        <div
          className={`flex flex-col top-[80px] left-0 absolute w-full bg-[#360000] transition-all ease-in-out duration-300 z-30 items-center text-center gap-3 ${
            menuIsOpen
              ? "opacity-100 py-11 visible"
              : "invisible opacity-0 py-0"
          }`}
        >
          <div className="nav-links">
            {navLinks
              .filter(
                (navLink) =>
                  !(currentUser && navLink.inAuthHide && !navLink.beforeMDHide)
              )
              .map((navLink, index) => (
                <React.Fragment key={`${navLink.name} ${index}`}>
                  <Link
                    className="no-underline text-white mb-1"
                    to={navLink.link}
                  >
                    <p className="m-0">{navLink.name}</p>
                  </Link>
                  <div className="div-underline bg-[#dbdbdb] h-[1px] w-full mb-1"></div>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
      <div className="nav-links flex flex-row justify-around md:hidden w-[15%] xl:w-[25%] items-center flex-1">
        {navLinks
          .filter((navLink) => !(currentUser && navLink.inAuthHide) && !navLink.beforeMDHide)
          .map((navLink) => (
            <React.Fragment key={navLink.name}>
              <Link className="no-underline text-white" to={navLink.link}>
                <p className="m-0">{navLink.name}</p>
              </Link>
            </React.Fragment>
          ))}
      </div>
      <div className="auth-links flex flex-row justify-around md:hidden w-[15%] xl:w-[25%] items-center flex-1">
        {authLinks
          .filter((authLink) => !(currentUser && authLink.inAuthHide))
          .map((authLink) => (
            <React.Fragment key={authLink.name}>
              <Link
                className={`${authLink.style} no-underline text-white`}
                to={authLink.link}
              >
                <p className="m-0">{authLink.name}</p>
              </Link>
            </React.Fragment>
          ))}
      </div>
      {currentUser && (
        <div className="hidden lg:flex flex-1 justify-end">
          <Profile />
        </div>
      )}
    </div>
  );
};

export default Navbar;
