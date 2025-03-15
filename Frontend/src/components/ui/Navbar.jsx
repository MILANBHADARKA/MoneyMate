import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar({ logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        <div
          className="text-2xl font-extrabold text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer"
        >
          MoneyMate
        </div>


        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/profile"
            className="text-gray-700 font-medium hover:text-blue-600 transition duration-300"
          >
            Profile
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>


        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? <X size={28} className="text-gray-800 " /> : <Menu size={28} className="text-gray-800" />}
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
              to="/profile"
              className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="px-6 py-3 text-red-600 font-medium hover:bg-red-100 transition"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
