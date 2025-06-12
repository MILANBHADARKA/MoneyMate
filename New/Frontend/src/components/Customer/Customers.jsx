import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Wallet, Users, TrendingUp, Menu } from "lucide-react";
import axios from "axios";
import Navbar from "../ui/Navbar";

function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL



  useEffect(() => {
    const fetchCustomers = async () => {
      try {

        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/customer/getcustomers`, {
          withCredentials: true,
        });

        // console.log("Customers:", response.data.data);

        setCustomers(response.data.data);
        setLoading(false);

      } catch (err) {
        // setError("Failed to fetch customers.");
        setLoading(false);
        navigate("/login");
        alert("Failed to fetch customers.");
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this customer?")) {
        return;
      }

      setLoading(true);
      setError("");

      await axios.delete(`${API_BASE_URL}/api/v1/customer/deletecustomer/${customerId}`, {
        withCredentials: true,
      });

      const response = await axios.get(`${API_BASE_URL}/api/v1/customer/getcustomers`, {
        withCredentials: true,
      });

      setCustomers(response.data.data);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setError("Failed to delete customer.");
      navigate("/getcustomers");
      alert("Failed to delete customer.");
    }
  };

  const logout = async () => {
    try {
      if (!window.confirm("Are you sure you want to logout?")) {
        return;
      }

      setLoading(true);
      setError("");
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      // console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
      navigate("/getcustomers");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar logout={logout} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <div className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {customers.length} {customers.length === 1 ? "customer" : "customers"}
            </div>
          </div>
        </div>

        {customers.length === 0 && (
          <div className="text-center p-10">No customers found.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 container mx-auto px-4 py-8 max-w-5xl">
          {customers.map((customer) => (
            <div
              key={customer._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all"
            >
              <h2 className="text-xl font-bold text-center mb-4">
                {customer.name}
              </h2>
              
              <div className="flex justify-center mb-5">
                <div 
                  className="group flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full transition-all hover:bg-blue-100 cursor-pointer"
                  onClick={() => navigate(`/getcustomer/${customer._id}`)}
                >
                  <span className="text-sm font-medium">View Details</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <button
                  className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/updatecustomer/${customer._id}`);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  className="flex items-center gap-1 bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(customer._id);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating button with options */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
        <div className="relative">
          <div className={`absolute bottom-full right-0 mb-2 w-48 transform transition-transform origin-bottom ${menuOpen ? 'scale-100' : 'scale-0'} md:group-hover:scale-100`}>
            <div className="bg-white rounded-lg shadow-lg py-2 mb-1">
              <button 
                onClick={() => navigate("/splitrooms")} 
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center"
              >
                <Users className="h-4 w-4 mr-2 text-purple-600" />
                <span>Switch to Split Rooms</span>
              </button>
            </div>
            <div className="absolute right-4 -bottom-1 h-2 w-2 bg-white transform rotate-45"></div>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-gray-700 text-white p-4 rounded-full shadow-lg hover:bg-gray-800"
          >
            <Menu size={24} />
          </button>
        </div>

        <button
          onClick={() => navigate("/createcustomer")}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}

export default Customers;