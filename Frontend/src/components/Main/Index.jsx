import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/customer/getcustomers`, {
          withCredentials: true,
        });

        navigate("/getcustomers");
      } catch (err) {
        // setError("Failed to fetch customers.");
        navigate("/");
        // alert("Failed to fetch customers.");
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white text-center p-6">

      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl font-extrabold mb-4">Welcome to MoneyMate</h1>
        <p className="text-lg">
          Your simple way to track and manage transactions. Stay on top of your
          personal finances with ease.
        </p>
        <button onClick={() => navigate('/login')} className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 text-lg font-semibold rounded-lg shadow-md cursor-pointer">
          Get Started
        </button>
      </div>


      <section className="mt-16">
        <h2 className="text-3xl font-bold">Why Use MoneyMate?</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {[
            {
              title: "Simple Interface",
              description:
                "Easily navigate and track your transactions with a user-friendly design.",
            },
            {
              title: "Transparency",
              description:
                "Always know how much you owe or are owed with complete transparency.",
            },
            {
              title: "Track History",
              description:
                "View all your past transactions with detailed reasons and timestamps.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white text-black p-6 rounded-xl shadow-lg max-w-sm"
            >
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="mt-16 bg-white p-8 rounded-xl text-black">
        <h2 className="text-3xl font-bold">Join the MoneyMate Family Today!</h2>
        <p className="mt-2">
          Take control of your finances and start tracking your transactions
          now.
        </p>
        <button onClick={() => navigate('/register')} className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 text-lg font-semibold rounded-lg shadow-md cursor-pointer">
          Sign Up Now
        </button>
      </section>


      <footer className="mt-12 text-sm">&copy; 2024 MoneyMate. All rights reserved.</footer>
    </div>
  );
};

export default Index;
