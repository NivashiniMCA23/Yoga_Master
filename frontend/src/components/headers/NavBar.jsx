import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";
import photoURL from "../../assets/home/girl.jpg";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthContext } from "../../ultilities/provider/AuthProvider";
import Swal from "sweetalert2";

const navLinks = [
  { name: "Home", route: "/" },
  { name: "Instructors", route: "/instructors" },
  { name: "Classes", route: "/classes" },
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
    secondary: {
      main: "#00ff00",
    },
  },
});

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { logout, user } = useContext(AuthContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const root = document.documentElement;
    isDarkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDarkMode]);

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
          .then(() => {
            Swal.fire("Logged Out!", "You have successfully logged out.", "success");
          })
          .catch((err) => {
            Swal.fire("Error!", err.message, "error");
          });
      }
    });
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-black fixed top-0 w-full z-10 transition-all duration-500"
    >
      <div className="lg:w-[95%] mx-auto px-5 md:px-10">
        <div className="py-4 flex items-center justify-between">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer flex items-center">
            <h1 className="text-xl md:text-2xl font-extrabold">Yoga Master</h1>
            <img src="/yoga-logo.png" alt="Logo" className="w-6 h-6 ml-2" />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button type="button" onClick={toggleMobileMenu} className="text-gray-600 dark:text-white">
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-black dark:text-white">
            {navLinks.map((link) => (
              <NavLink
                key={link.route}
                to={link.route}
                className="font-bold hover:text-secondary transition duration-300"
              >
                {link.name}
              </NavLink>
            ))}

            {user ? (
              <>
                <NavLink to="/dashboard" className="font-bold hover:text-secondary transition duration-300">
                  Dashboard
                </NavLink>
                <img src={photoURL} alt="User" className="h-10 w-10 rounded-full" />
                <button onClick={handleLogout} className="bg-secondary text-white px-4 py-2 rounded-md">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="font-bold hover:text-secondary transition duration-300">
                  Login
                </NavLink>
                <NavLink to="/register" className="font-bold hover:text-secondary transition duration-300">
                  Register
                </NavLink>
              </>
            )}

            {/* Dark Mode Toggle */}
            <ThemeProvider theme={theme}>
              <Switch onChange={() => setIsDarkMode(!isDarkMode)} />
            </ThemeProvider>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} bg-white dark:bg-black shadow-lg`}>
          <ul className="flex flex-col items-center py-4 space-y-4 text-black dark:text-white">
            {navLinks.map((link) => (
              <li key={link.route} className="w-full text-center">
                <NavLink
                  to={link.route}
                  className="font-bold block py-2 hover:text-secondary transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {user ? (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    className="font-bold block py-2 hover:text-secondary transition duration-300"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <img src={photoURL} alt="User" className="h-10 w-10 rounded-full mx-auto" />
                </li>
                <li>
                  <button onClick={handleLogout} className="bg-secondary text-white px-4 py-2 rounded-md">
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className="font-bold block py-2 hover:text-secondary transition duration-300"
                    onClick={toggleMobileMenu}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className="font-bold block py-2 hover:text-secondary transition duration-300"
                    onClick={toggleMobileMenu}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {/* Dark Mode Toggle */}
            <li>
              <ThemeProvider theme={theme}>
                <div className="flex flex-col justify-center items-center">
                  <Switch onChange={() => setIsDarkMode(!isDarkMode)} />
                  <span className="text-xs">Light/Dark</span>
                </div>
              </ThemeProvider>
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
