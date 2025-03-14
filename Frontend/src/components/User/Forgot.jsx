import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

function Forgot() {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/forgotpassword`,
        { email: data.email },
        {
          withCredentials: true,
        }
      );

      // console.log("Password Reset Email Sent:", response.data.data.otpResponse);

      if (response.data.data.otpResponse) {
        navigate("/resetpassword?email=" + data.email);
      }

    } catch (error) {
      alert("Failed to send password reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Forgot Password</h2>
        <p className="text-gray-600 text-center mt-1">Enter your email to receive otp.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
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
              Send OTP
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Remember your password?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Forgot;
