import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { motion } from "framer-motion";
import {
  FaUser,
  FaSignOutAlt,
  FaPills,
  FaChartLine,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaBoxes,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const NavbarPratik = () => {
  const { user, setIsAuth, setUser } = UserData();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      toast.success(data.message);
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navLinks =
    user?.role === "pharmacist"
      ? [
          {
            name: "Dashboard",
            path: "/pharmacist/dashboard",
            icon: <FaChartLine />,
          },
          {
            name: "Medicines",
            path: "/pharmacist/medicines.pratik",
            icon: <FaPills />,
          },
          {
            name: "Add Medicine",
            path: "/pharmacist/add-medicine.pratik",
            icon: <FaPlus />,
          },
          {
            name: "Orders",
            path: "/pharmacist/orders.pratik",
            icon: <FaShoppingCart />,
          },
          {
            name: "Inventory",
            path: "/pharmacist/inventory.pratik",
            icon: <FaBoxes />,
          },
        ]
      : [
          { name: "Home", path: "/", icon: <FaPills /> },
          { name: "Medicines", path: "/medicines.pratik", icon: <FaPills /> },
        ];

  return (
    <nav className="bg-[#FCFCFE] border-b border-[#C7C9CE] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#055AF9]">PROIMG</span>
            {user?.role === "pharmacist" && (
              <span className="hidden sm:block px-2 py-1 bg-[#055AF9] text-white text-xs rounded-full">
                Pharmacist
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-2 text-[#343838] hover:text-[#055AF9] transition-colors duration-200 font-medium"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-[#F0F3FB] rounded-lg">
              <FaUser className="text-[#055AF9]" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#343838]">
                  {user?.name}
                </span>
                <span className="text-xs text-[#7F7E85]">{user?.email}</span>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#343838] hover:text-[#055AF9] p-2"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-[#C7C9CE]"
          >
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-3 bg-[#F0F3FB] rounded-lg mb-4">
              <FaUser className="text-[#055AF9] text-xl" />
              <div>
                <p className="text-sm font-medium text-[#343838]">
                  {user?.name}
                </p>
                <p className="text-xs text-[#7F7E85]">{user?.email}</p>
                {user?.role === "pharmacist" && (
                  <span className="inline-block mt-1 px-2 py-1 bg-[#055AF9] text-white text-xs rounded-full">
                    Pharmacist
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-[#343838] hover:bg-[#F0F3FB] hover:text-[#055AF9] transition-colors rounded-lg"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-3 w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default NavbarPratik;
