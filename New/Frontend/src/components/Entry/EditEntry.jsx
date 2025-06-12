import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";


const schema = yup.object({
  amount: yup.number().positive("Amount must be positive").required("Amount is required"),
  reason: yup.string().required("Reason is required"),
});

function EditEntry() {
  const location = useLocation();
  const { entryId } = useParams();
  const customerId = new URLSearchParams(location.search).get("customerId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });


  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/entry/getentry/${entryId}`);
        reset(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("root", {
          type: "manual",
          message: error.response?.data?.message || "Failed to fetch entry.",
        });
        alert("Failed to fetch entry. Please try again.");
        setLoading(false);
        navigate(`/getcustomer/${customerId}`);
      }
    };
    fetchEntry();
  }, [customerId, entryId, reset]);


  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/entry/editentry/${entryId}`,
        data,
        { withCredentials: true }
      );

      navigate(`/getcustomer/${customerId}`);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || "Failed to update entry.",
      });
      alert("Failed to update entry. Please try again.");
      navigate(`/getcustomer/${customerId
        }`);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Entry</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="relative">
            <label className="absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              {...register("amount")}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>


          <div className="relative">
            <label className="absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700">
              Reason
            </label>
            <textarea
              {...register("reason")}
              className="w-full p-3 border border-gray-300 rounded-md"
            ></textarea>
            {!errors.amount && errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
          </div>


          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              Update Entry
            </button>
          </div>
        </form>


        <button
          className="mt-4 text-blue-500 w-full"
          onClick={() => navigate(`/getcustomer/${customerId}`)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditEntry;
