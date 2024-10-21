import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useDB } from "../../context/db/DBContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../server/firebase";
import STGONCLOGO from '../../static/images/STGONC-LOGO-WHITE.png'
import Menu from '../../static/images/menu.png'

const Navbar = () => {
  const { currentUser } = useAuth();
  const db = useDB();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const navLinks = [
    { name: "About Us", link: "#", inAuthHide: false },
    { name: "Contact Us", link: "#", inAuthHide: false },
    { name: "Login", link: "/auth/Login", inAuthHide: true },
    { name: "Register", link: "/auth/StudentRegistration", inAuthHide: true },
  ];

  const handleOpenMenu = () => setMenuIsOpen(!menuIsOpen);

  const handleGetUser = async (uid) => {
    try {
      setLoading(true);
      if (uid) {
        const userData = await db.getUser(uid);
        if (userData) {
          setUser(userData);
        } else {
         
          console.warn("User data not found in database");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribe;
    
    const setupAuthListener = () => {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          await handleGetUser(currentUser.uid);
        } else {
          setUser(null);
          setLoading(false);
        }
      });
    };

    setupAuthListener();
    return () => unsubscribe?.();
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (loading) return;
    
    if (currentUser && user?.role) {
      navigate(`/private/${user.role}/dashboard`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="navbar-container bg-[#360000] flex flex-row fixed items-center w-full justify-between z-20 p-[20px]">
      <div className="logo-wrapper flex flex-row items-center justify-start w-[40%]">
        <a href="#" onClick={handleLogoClick}>
          <img 
            src={STGONCLOGO} 
            alt="stgonc-logo" 
            width={40} 
            className={loading ? 'opacity-50' : 'opacity-100'} 
          />
        </a>
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