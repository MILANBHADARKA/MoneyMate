import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const schema = yup.object({
  amount: yup.number().positive("Amount must be positive").required("Amount is required"),
  reason: yup.string().required("Reason is required"),
});

function AddSplitExpense() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomUsers, setRoomUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/splitroom/getroomusers/${roomId}`,
          { withCredentials: true }
        );
        
        const roomData = response.data.data.room;
        const users = response.data.data.users;
        
        setRoom(roomData);
        setRoomUsers(users);
        
        setSelectedUsers(users.map(user => user._id));
        
        setLoading(false);
      } catch (err) {
        // console.error("Error fetching room details:", err);
        alert("Failed to fetch room details.");
        navigate(`/splitroom/${roomId}`);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      if (selectedUsers.length === 0) {
        setError("users", { 
          type: "manual", 
          message: "Select at least one user to split with" 
        });
        return;
      }
      
      const expenseData = {
        ...data,
        users: selectedUsers
      };
      
      await axios.post(
        `${API_BASE_URL}/api/v1/splitexpenses/createsplitexpenses/${roomId}`,
        expenseData,
        { withCredentials: true }
      );
      
      navigate(`/splitroom/${roomId}`);
    } catch (err) {
      setError("root", {
        type: "manual",
        message: err.response?.data?.message || "Failed to add expense. Please try again.",
      });
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
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => navigate(`/splitroom/${roomId}`)}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Room
        </button>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
            Add Expense to {room?.name ? (
              <span className="text-blue-600">{room.name}</span>
            ) : "Room"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium text-sm sm:text-base">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                {...register("amount")}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="0.00"
              />
              {errors.amount && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 font-medium text-sm sm:text-base">
                Reason
              </label>
              <input
                type="text"
                {...register("reason")}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="e.g. Dinner, Groceries, Rent"
              />
              {errors.reason && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.reason.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 font-medium text-sm sm:text-base">
                  Split with
                </label>
                <button 
                  type="button"
                  onClick={() => setSelectedUsers(selectedUsers.length === roomUsers.length ? [] : roomUsers.map(u => u._id))}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedUsers.length === roomUsers.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              
              <div className="max-h-40 sm:max-h-48 overflow-y-auto border border-gray-300 rounded-md p-1 sm:p-2 space-y-0.5 sm:space-y-1">
                {roomUsers.map(user => (
                  <div key={user._id} className="flex items-center p-1.5 sm:p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      id={`user-${user._id}`}
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`user-${user._id}`} className="ml-2 block text-xs sm:text-sm text-gray-900">
                      {user.username}
                    </label>
                  </div>
                ))}
              </div>
              {errors.users && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.users.message}</p>}
              
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedUsers.length} of {roomUsers.length} people
              </p>
            </div>

            <div>
            <button
              type="submit"
              disabled={isSubmitting || selectedUsers.length === 0}
              className={`w-full py-2.5 sm:py-3 px-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base
                ${selectedUsers.length === 0 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">

                </span>
              )}
              Add Expenses
            </button>
          </div>
            
            {errors.root && <p className="text-red-500 text-xs sm:text-sm text-center mt-2">{errors.root.message}</p>}
          </form>

          <button
            onClick={() => navigate(`/splitroom/${roomId}`)}
            className="w-full mt-4 py-2 text-blue-600 hover:text-blue-800 text-center text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSplitExpense;
