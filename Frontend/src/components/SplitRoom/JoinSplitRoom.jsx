import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object({
  roomId: yup.string().required("Room ID is required"),
});

function JoinSplitRoom() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/api/v1/splitroom/joinsplitroom`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      reset();
      navigate("/splitrooms");
    } catch (err) {
      setError("root", {
        type: "manual",
        message: err.response?.data?.message || "Failed to join split room. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Join Split Room</h2>
        <p className="text-gray-600 text-center mb-6">Enter the Room ID to join an existing split room</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className='relative'>
            <label htmlFor='roomId' className='absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700'>Room ID</label>
            <input
              {...register("roomId")}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="e.g. 64a1b2c3d4e5f6g7h8i9j0"
            />
            {errors.roomId && <p className="text-red-500 text-sm">{errors.roomId.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
              Join Room
            </button>
          </div>

          {errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}
        </form>

        <button
          onClick={() => navigate("/splitrooms")}
          className="w-full mt-3 py-2 px-4 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default JoinSplitRoom;
