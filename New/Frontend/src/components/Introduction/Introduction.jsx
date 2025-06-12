import React from "react";
import { useNavigate } from "react-router-dom";


const Introduction = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/getcustomers");
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-500 text-white p-6 text-center">
      <h1 className="text-5xl font-extrabold mb-4">How to Use MoneyMate</h1>
      <p className="text-lg max-w-2xl mx-auto">
        A simple guide to managing your finances effortlessly.
      </p>

      <section className="mt-10 bg-white text-black p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Getting Started with MoneyMate
        </h2>
        <div className="space-y-8 text-left">
          {[
            {
              step: "1. Register Your Account",
              description:
                "Click on the Sign Up button and fill in your details to start tracking finances.",
            },
            {
              step: "2. Add Customers",
              description:
                "Go to the Customers section and add individuals or businesses.",
            },
            {
              step: "3. Record Transactions",
              description:
                "Specify the amount, reason, and date to track transactions in real-time.",
            },
            {
              step: "4. Track and View History",
              description:
                "View a complete history of transactions with an easy-to-use interface.",
            },
            {
              step: "5. Settle Up",
              description:
                "Check total amounts owed or received for transparent settlements.",
            },
          ].map((item, index) => (
            <div key={index} className="p-4 border-l-4 border-green-500">
              <h3 className="text-xl font-bold">{item.step}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <button onClick={handleClick} className="bg-green-500 hover:bg-green-600 px-6 py-3 text-lg font-semibold rounded-lg shadow-md cursor-pointer">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Introduction;
