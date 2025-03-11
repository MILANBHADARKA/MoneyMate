import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import axios from "axios";

function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:10000/api/v1/customer/getcustomers", {
          withCredentials: true,  //  Required to send cookies
        });

        // console.log("Customers:", response.data.data);

        setCustomers(response.data.data);

      } catch (err) {
        setError("Failed to fetch customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`http://localhost:10000/api/v1/customer/deletecustomer/${customerId}`, {
        withCredentials: true, // Required to send cookies
      });

      const response = await axios.get("http://localhost:10000/api/v1/customer/getcustomers", {
        withCredentials: true,  //  Required to send cookies
      });

      setCustomers(response.data.data);
    } catch (err) {
      setError("Failed to delete customer.");
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:10000/api/v1/user/logout",
        {}, // Empty body
        {
          withCredentials: true,  // Required to send and delete cookies
        }
      );
  
      // console.log("Logout Successful:", response.data);
  
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  return (
    <div className=" bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-6 py-3">
          <div class="flex justify-between items-center">
            <Link to="/" class="text-2xl font-bold text-gray-800 cursor-pointer">MoneyMate</Link>
            <div class="flex justify-between items-center gap-5">
              <Link to="/profile" class="text-blue-500 hover:text-blue-600 cursor-pointer">Profile</Link>
              <Link onClick={logout} class="text-blue-500 hover:text-blue-600 cursor-pointer">Logout</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Customer List */}
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

      {/* Floating Add Button */}
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