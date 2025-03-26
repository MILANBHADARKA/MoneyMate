import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function CustomerDetailNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md backdrop-blur-md ">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">

        <button
          onClick={() => navigate("/getcustomers")}
          className="flex items-center hover:opacity-80 transition cursor-pointer"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Customers
        </button>


        <div
          className="text-2xl font-extrabold hover:opacity-80 transition duration-300 cursor-pointer"
        >
          MoneyMate
        </div>
      </div>
    </nav>
  );
}

export default CustomerDetailNavbar;
