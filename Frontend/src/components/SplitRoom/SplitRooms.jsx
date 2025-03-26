import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Wallet, Users, TrendingUp, Menu } from "lucide-react";
import axios from "axios";
import Navbar from "../ui/Navbar";

function SplitRooms() {
  const navigate = useNavigate();
  const [splitRooms, setSplitRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSplitRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/splitroom/getsplitrooms`, {
          withCredentials: true,
        });

        setSplitRooms(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch split rooms.");
        setLoading(false);
        navigate("/login");
      }
    };

    fetchSplitRooms();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (err) {
      // console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
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
            <h1 className="text-2xl font-bold text-gray-800">Split Rooms</h1>
            <div className="ml-3 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {splitRooms.length} {splitRooms.length === 1 ? "room" : "rooms"}
            </div>
          </div>
        </div>

        {splitRooms.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700">No split rooms found.</p>
            <p className="mt-2 text-gray-500">Create a new split room to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {splitRooms.map((room) => (
              <div
                key={room._id}
                className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all"
              >
                <h2 className="text-xl font-bold text-center mb-2">{room.name}</h2>
                <p className="text-gray-600 text-center mb-4">
                  {room.users.length} {room.users.length === 1 ? "member" : "members"}
                </p>
                <div className="flex justify-center mt-3">
                  <div 
                  className="group flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full transition-all hover:bg-blue-100"
                  onClick={() => navigate(`/splitroom/${room._id}`)}
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
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
        <div className="relative group">
          <div className="absolute bottom-full right-0 mb-2 w-48 transform scale-0 group-hover:scale-100 transition-transform origin-bottom">
            <div className="bg-white rounded-lg shadow-lg py-2 mb-1">
              <button 
                onClick={() => navigate("/getcustomers")} 
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center"
              >
                <Wallet className="h-4 w-4 mr-2 text-blue-600" />
                <span>Switch to Customers</span>
              </button>
            </div>
            <div className="absolute right-4 -bottom-1 h-2 w-2 bg-white transform rotate-45"></div>
          </div>
          <button
            className=" md:hidden bg-gray-700 text-white p-4 rounded-full shadow-lg hover:bg-gray-800"
          >
            <Menu size={24} />
          </button>
        </div>

        <button
          onClick={() => navigate("/joinsplitroom")}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6" />
            <path d="M16 11h6" />
          </svg>
        </button>
        
        <button
          onClick={() => navigate("/createsplitroom")}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}

export default SplitRooms;
