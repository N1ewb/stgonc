import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useDB } from "../../context/db/DBContext";

import Menu from "../../static/images/menu.png";
import STGONCLOGO from "../../static/images/STGONC-LOGO-WHITE.png";
import "./Navbar.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../server/firebase";

const Navbar = () => {
  const {currentUser} = useAuth();
  const db = useDB();
  const [user, setUser] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const navLinks = [
    { name: "About Us", link: "#", inAuthHide: false },
    { name: "Contact Us", link: "#", inAuthHide: false },
    { name: "Login", link: "/auth/Login", inAuthHide: true },
    { name: "Register", link: "/auth/StudentRegistration", inAuthHide: true },
  ];

  const handleOpenMenu = () => setMenuIsOpen(!menuIsOpen);

  const handleGetUser = async (uid) => {
    if (uid) {
      const userData = await db.getUser(uid);
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      handleGetUser(currentUser ? currentUser.uid : null);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="navbar-container bg-[#360000] flex flex-row fixed items-center w-full justify-between z-20 p-[20px]">
      <div className="logo-wrapper flex flex-row items-center justify-start w-[40%]">
        <Link to={currentUser ? `/private/${user?.role}/dashboard` : "/"}>
          <img src={STGONCLOGO} alt="stgonc-logo" width={40} />
        </Link>
      </div>

      <div className="nav-links flex flex-row justify-around md:hidden w-[30%] xl:w-[50%] items-center">
        {navLinks
          .filter((navLink) => !(currentUser && navLink.inAuthHide))
          .map((navLink) => (
            <React.Fragment key={navLink.name}>
              <Link className="no-underline text-white" to={navLink.link}>
                <p className="m-0">{navLink.name}</p>
              </Link>
            </React.Fragment>
          ))}
      </div>

      <div className="mobile-nav-links hidden md:flex flex-col">
        <img
          className="w-[40px]"
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
          {navLinks
            .filter((navLink) => !(currentUser && navLink.inAuthHide))
            .map((navLink, index) => (
              <React.Fragment key={`${navLink.name} ${index}`}>
                <Link className="no-underline text-white" to={navLink.link}>
                  <p className="m-0">{navLink.name}</p>
                </Link>
                <div className="div-underline bg-[#a0a0a0] h-[1px] w-[80%]"></div>
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
