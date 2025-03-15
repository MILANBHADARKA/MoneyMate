import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function CustomerDetailNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">

        <button
          onClick={() => navigate("/getcustomers")}
          className="flex items-center text-gray-800 hover:text-blue-600 transition-all duration-300 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md"
        >
          <ArrowLeft size={22} />
          <span className="ml-2 font-medium hidden sm:inline">Back</span>
        </button>


        <div
          className="text-2xl font-extrabold text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer"
        >
          MoneyMate
        </div>
      </div>
    </nav>
  );
}

export default CustomerDetailNavbar;
