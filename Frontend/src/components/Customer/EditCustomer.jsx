import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

// Validation Schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
});

function EditCustomer() {
  const navigate = useNavigate();
  const { customerId } = useParams(); // Get customer ID from URL
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue, // Used to set default values in the form
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Fetch existing customer data
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:10000/api/v1/customer/getcustomer/${customerId}`, {
          withCredentials: true, // Required to send cookies
        });
        setValue("name", response.data.data.name); // Pre-fill name
      } catch (err) {
        setError("Failed to fetch customer data.");
      }
    };

    if (customerId) fetchCustomer();
  }, [customerId, setValue]);

  const onSubmit = async (data) => {
    setError("");

    try {
      await axios.post(
        `http://localhost:10000/api/v1/customer/updatecustomer/${customerId}`, // Use customerId in URL
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      reset();
      navigate("/getcustomers"); // Redirect to Customers page
    } catch (err) {
      setError("Failed to update customer. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Edit Customer</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <label htmlFor="name" className="absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              Edit Customer
            </button>
          </div>
        </form>

        {/* Cancel Button */}
        <button
          onClick={() => navigate("/getcustomers")}
          className="w-full mt-3 py-2 px-4 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditCustomer;
