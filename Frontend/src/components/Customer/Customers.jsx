import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import axios from "axios";
import Navbar from "../ui/Navbar";

function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL



  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/customer/getcustomers`, {
          withCredentials: true,
        });

        console.log("Customers:", response.data.data);

        setCustomers(response.data.data);

      } catch (err) {
        setError("Failed to fetch customers.");
        navigate("/login");
        alert("Failed to fetch customers.");
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/customer/deletecustomer/${customerId}`, {
        withCredentials: true,
      });

      const response = await axios.get(`${API_BASE_URL}/api/v1/customer/getcustomers`, {
        withCredentials: true,
      });

      setCustomers(response.data.data);
    } catch (err) {
      setError("Failed to delete customer.");
      navigate("/getcustomers");
      alert("Failed to delete customer.");
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
      navigate("/getcustomers");
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen">

      <Navbar logout={logout} />


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 container mx-auto px-4 py-8 max-w-5xl">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all"
            onClick={() => navigate(`/getcustomer/${customer._id}`)}
          >
            <h2 className="text-xl font-bold text-center">
              {customer.name} 👆
            </h2>
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/updatecustomer/${customer._id}`);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering parent click event
                  handleDelete(customer._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>


      <button
        onClick={() => navigate("/createcustomer")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition cursor-pointer"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}

export default Customers;