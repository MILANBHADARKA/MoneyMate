import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOff } from "lucide-react";

const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be a 6-digit number")
    .required("OTP is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New Password is required"),
});

function ResetPassword() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
  const email = new URLSearchParams(location.search).get("email");
  const [passwordVisible, setPasswordVisible] = useState(false);
  

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const logout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {}, 
        {
          withCredentials: true,
        }
      );

      // console.log("Logout Successful:", response.data);

      navigate("/login");
    } catch (err) {
      setError("Failed to logout.");
      alert("Failed to logout.");
      navigate("/profile");
    }
  };

  const onSubmit = async (data) => {

    data.email = email;

    try{
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/resetpassword`,
        {data},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );
      
      logout();
      navigate("/login");
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || "Error!",
      });
      // alert("Password reset failed. Please try again.");
      // navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Reset Password</h2>
        <p className="text-gray-600 text-center mt-1">Enter the OTP sent to your email and set a new password.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* <div>
            <label className="block text-gray-700 font-medium">OTP</label>
            <input
              type="text"
              maxLength="6"
              {...register("otp")}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
          </div> */}
          <div className='relative'>
            <label className='absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700'>Otp</label>
            <input 
            type="text" 
            maxLength="6"
            {...register("otp")} 
            className='w-full p-3 border border-gray-300 rounded-md' />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
          </div>

          {/* <div>
            <label className="block text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter new password"
              className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
            {!errors.otp && errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div> */}
          <div className='relative'>
            <label className='absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700'>New Password</label>
            <input 
            type={passwordVisible ? 'text' : 'password'}
            {...register("password")} 
            className='w-full p-3 border border-gray-300 rounded-md' 
            />
            <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <EyeIcon size={20} className="opacity-60" /> : <EyeOff size={20} className="opacity-60" />}
            </span>
            {!errors.otp && errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
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
              Reset Password
            </button>
          </div>
          {errors.root && <p className="text-red-500 text-sm text-center mt-2">{errors.root.message}</p>}

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

export default ResetPassword;
