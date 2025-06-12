import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Wallet, Users, PieChart, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar({ logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine which section is active
  const isCustomerSection = location.pathname.includes('/getcustomers') || 
                           location.pathname === '/';
  const isSplitSection = location.pathname.includes('/splitrooms');
  const isProfileSection = location.pathname.includes('/profile');

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer flex items-center"
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded mr-2">MM</span>
          MoneyMate
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/getcustomers"
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition duration-300 ${
              isCustomerSection 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Wallet size={18} className={`mr-2 ${isCustomerSection ? 'text-blue-600' : 'text-gray-500'}`} />
            Customers
          </Link>
          <Link
            to="/splitrooms"
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition duration-300 ${
              isSplitSection 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users size={18} className={`mr-2 ${isSplitSection ? 'text-purple-600' : 'text-gray-500'}`} />
            Split Rooms
          </Link>
          <Link
            to="/profile"
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition duration-300 ${
              isProfileSection 
                ? 'bg-teal-100 text-teal-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <PieChart size={18} className={`mr-2 ${isProfileSection ? 'text-teal-600' : 'text-gray-500'}`} />
            Profile
          </Link>
          <button
            onClick={logout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? <X size={28} className="text-gray-800" /> : <Menu size={28} className="text-gray-800" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white shadow-lg border-t flex flex-col justify-center items-center py-4"
          >
            <Link
              to="/getcustomers"
              className={`px-6 py-3 font-medium w-full text-center flex items-center justify-center ${
                isCustomerSection ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              } transition`}
              onClick={() => setMenuOpen(false)}
            >
              <Wallet size={18} className="mr-2" />
              Customers
            </Link>
            <Link
              to="/splitrooms"
              className={`px-6 py-3 font-medium w-full text-center flex items-center justify-center ${
                isSplitSection ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
              } transition`}
              onClick={() => setMenuOpen(false)}
            >
              <Users size={18} className="mr-2" />
              Split Rooms
            </Link>
            <Link
              to="/profile"
              className={`px-6 py-3 font-medium w-full text-center flex items-center justify-center ${
                isProfileSection ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-gray-100'
              } transition`}
              onClick={() => setMenuOpen(false)}
            >
              <PieChart size={18} className="mr-2" />
              Profile
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="px-6 py-3 text-red-600 font-medium hover:bg-red-100 transition w-full flex items-center justify-center"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
