import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerResponse = await axios.get(
          `http://localhost:10000/api/v1/customer/getcustomer/${customerId}`,
          { withCredentials: true }
        );

        const entryresponse = await axios.get(
          `http://localhost:10000/api/v1/entry/getentries/${customerId}`,
          { withCredentials: true }
        );

        setCustomer(customerResponse.data.data);
        setEntries(entryresponse.data.data);

      } catch (err) {
        setError("Failed to fetch customer details.");
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete(
        `http://localhost:10000/api/v1/entry/deleteentry/${customerId}/${entryId}`,
        { withCredentials: true }
      );

      const entryresponse = await axios.get(
        `http://localhost:10000/api/v1/entry/getentries/${customerId}`,
        { withCredentials: true }
      );

      setEntries(entryresponse.data.data);

    } catch (err) {
      setError("Failed to delete entry.");
    }
  };

  if (!customer) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MoneyMate</h1>
        <div className="space-x-4">
          <span className="cursor-pointer text-blue-500" onClick={() => navigate("/getcustomers")}>
            Customers
          </span>
          {/* <span className="cursor-pointer text-blue-500">Logout</span> */}
        </div>
      </div>

      {/* Customer Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <p className="text-gray-600">Created on: {new Date(customer.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Money Stats */}
      <div className="mt-6 bg-gradient-to-r from-blue-400 to-pink-500 text-white p-6 rounded-lg shadow-md">
        <p className="text-lg"><strong>Money You Gave:</strong>Work in progress</p>
        <p className="text-lg"><strong>Money You Got:</strong>Work in progress</p>
        <p className="text-lg"><strong>You will give:</strong>Work in progress</p>
      </div>

      {/* Entries Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Entries</h2>

        {entries.map((entry) => (
          <div
            key={entry._id}
            className={`p-4 rounded-lg shadow-md mb-4 ${entry.entryType === "You Gave" ? "bg-red-400" : "bg-green-400"}`}
          >
            <p className="text-lg font-bold">
              <strong>Entry:</strong> {entry.amount}
            </p>
            <p><strong>Reason:</strong> {entry.reason}</p>
            <p><strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer" onClick={() => navigate(`/editentry/${entry._id}?customerId=${customerId}`)}>
                Edit
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer" onClick={() => handleDeleteEntry(entry._id)}>
                Delete
              </button>
            </div>
          </div>
        )).reverse()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => navigate(`/createentry/${customerId}?entryType=You Gave`)}
        >
          You Gave
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => navigate(`/createentry/${customerId}?entryType=You Get`)}
        >
          You Get
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => navigate("/getcustomers")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default CustomerDetail;
