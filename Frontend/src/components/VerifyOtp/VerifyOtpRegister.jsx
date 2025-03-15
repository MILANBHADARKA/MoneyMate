import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup.object().shape({
  otp: yup.string().matches(/^\d{6}$/, "OTP must be 6 digits").required("OTP is required"),
});

function VerifyOtpRegister() {
  const navigate = useNavigate();
  const { handleSubmit, control, setValue, setError, formState: { isSubmitting,errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [isotpSending, setIsOtpSending] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    setValue("otp", newOtpValues.join(""));

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/verifyotp`,
        { email: new URLSearchParams(location.search).get("email"), otp: data.otp },
        { withCredentials: true }
      );

      navigate("/login");

    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || "Invalid OTP. Please try again.",
      });
    }
  };

  const handleReseneOtp = async () => {
    try {
      setIsOtpSending(true);
      await axios.post(
        `${API_BASE_URL}/api/v1/user/resendotp`,
        { email: new URLSearchParams(location.search).get("email") },
        { withCredentials: true }
      );

      alert("OTP has been resent.");
      setIsOtpSending(false);
    } catch (error) {
      setIsOtpSending(false);
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || "Failed to resend OTP. Please try again.",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Verify OTP</h2>
        <p className="text-gray-600 text-center mt-1">Enter the 6-digit OTP sent to your email.</p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="otp"
            control={control}
            render={() => (
              <div className="flex justify-center space-x-2">
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-12 h-12 border text-center text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  />
                ))}
              </div>
            )}
          />
          {errors.otp && <p className="text-red-500 text-sm text-center">{errors.otp.message}</p>}

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
              Verify OTP
            </button>
          </div>

          {errors.root && <p className="text-red-500 text-sm text-center mt-2">{errors.root.message}</p>}
        </form>

        <p className="text-center text-gray-600 mt-4">
          Didn’t receive the OTP?{" "}
          <button disabled={isotpSending} onClick={handleReseneOtp} className="text-blue-500 hover:underline cursor-pointer">Resend OTP</button>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtpRegister;
