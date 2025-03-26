import React from 'react';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const schema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required("Confirm Password is required"),
  // profilePic: yup.mixed(),
  // profilePic: yup.mixed().test("fileType", "Unsupported File Format", (value) => {
  //   return value && ["image/jpg", "image/jpeg", "image/png", "image/svg+xml"].includes(value[0].type);
  // })
});

function Register() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur"
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/user/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("Register Successful:", response.data);

      reset();
      navigate("/verifyotpregister?email=" + data.email);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || "Register failed. Please try again.",
      });
      navigate("/register");
    }
  };

  const resetForm = () => {
    reset();
    clearErrors();
  };

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [reset]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-8">Register to <span className="text-blue-600">MoneyMate</span></h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className='relative'>
            <label htmlFor='username' className='absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700'>Username</label>
            <input  {...register("username")} className='w-full p-3 border border-gray-300 rounded-md' />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div className='relative'>
            <label htmlFor='email' className='absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700'>Email</label>
            <input  {...register("email")} className='w-full p-3 border border-gray-300 rounded-md' />
            {!errors.username && errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className='relative'>
            <label htmlFor='password' className='absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700'>Password</label>
            <input type='password'  {...register("password")} className='w-full p-3 border border-gray-300 rounded-md' />
            {!errors.username && !errors.email && errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className='relative'>
            <label htmlFor='confirmPassword' className='absolute -top-3 left-2 bg-white px-1 text-md font-medium text-gray-700'>Confirm Password</label>
            <input type='password'  {...register("confirmPassword")} className='w-full p-3 border border-gray-300 rounded-md' />
            {!errors.username && !errors.email && !errors.password && errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          {/* <div className='relative'>
            <label htmlFor='profilePic' className='absolute -top-2 left-2 bg-white px-1 text-sm font-medium text-gray-700'>Profile Picture</label>
            <input type='file' {...register("profilePic")} className='w-full p-3 border border-gray-300 rounded-md' />
            {!errors.username && !errors.email && !errors.password && !errors.confirmPassword && errors.profilePic && <p className="text-red-500 text-sm">{errors.profilePic.message}</p>}
          </div> */}

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
              Register
            </button>
          </div>
        </form>

        {
          errors.root && <p className="text-red-500 text-center mt-4">{errors.root.message}</p>
        }

        <p className="text-center text-sm mt-4">Already have an account?
          <Link to='/login' className="text-indigo-600 hover:underline"> Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;