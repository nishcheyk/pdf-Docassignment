import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "../Css/Navbar.css"; // Import styles

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark");
  const [activeTab, setActiveTab] = useState("/");

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prevTheme) => !prevTheme);
  };

  return (
    <>
      <input hidden className="mode" id="theme-mode" type="checkbox" checked={theme} onChange={toggleTheme} />
      <div className="container">
        <div className="wrap">
          {/* Home */}
          <label className={`label ${activeTab === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
            <span>Home</span>
          </label>

          {/* PDF Upload */}
          <label className={`label ${activeTab === "/upload" ? "active" : ""}`} onClick={() => navigate("/upload")}>
            <span>PDF Upload & Extract</span>
          </label>

          {/* Document Editor */}
          <label className={`label ${activeTab === "/editor" ? "active" : ""}`} onClick={() => navigate("/editor")}>
            <span>Document Editor</span>
          </label>

          {/* Active Selection Bar */}
          <div className="bar"></div>

          {/* Theme Toggle */}
          <label htmlFor="theme-mode" className="theme">
            <span className="light">🌞</span>
            <span className="dark">🌙</span>
          </label>


             <label className={'label '} onClick={logout}>
            <span>  Logout</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default NavBar;
