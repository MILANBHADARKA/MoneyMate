import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerDetailNavbar from "../ui/CustomerDetailNavbar";

function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL


  const [moneyYouGave, setMoneyYouGave] = useState(0);
  const [moneyYouGot, setMoneyYouGot] = useState(0);
  const [balance, setBalance] = useState(0);

  const fetchCustomerDetails = async () => {
    try {
      const customerResponse = await axios.get(
        `${API_BASE_URL}/api/v1/customer/getcustomer/${customerId}`,
        { withCredentials: true }
      );

      const entryresponse = await axios.get(
        `${API_BASE_URL}/api/v1/entry/getentries/${customerId}`,
        { withCredentials: true }
      );

      setCustomer(customerResponse.data.data);
      setEntries(entryresponse.data.data);

      const fetchedEntries = entryresponse.data.data;
      const totalGave = fetchedEntries
        .filter(entry => entry.entryType === "You Gave")
        .reduce((sum, entry) => sum + entry.amount, 0);

      const totalGot = fetchedEntries
        .filter(entry => entry.entryType === "You Get")
        .reduce((sum, entry) => sum + entry.amount, 0);

      setMoneyYouGave(totalGave);
      setMoneyYouGot(totalGot);
      setBalance(totalGave - totalGot);

    } catch (err) {
      setError("Failed to fetch customer details.");
      navigate("/getcustomers");
      alert("Something went wrong while fetching customer details.");
    }
  };

  useEffect(() => {

    fetchCustomerDetails();
  }, [customerId]);

  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/v1/entry/deleteentry/${customerId}/${entryId}`,
        { withCredentials: true }
      );

      const entryresponse = await axios.get(
        `${API_BASE_URL}/api/v1/entry/getentries/${customerId}`,
        { withCredentials: true }
      );

      setEntries(entryresponse.data.data);
      fetchCustomerDetails();

    } catch (err) {
      setError("Failed to delete entry.");
      navigate(`/getcustomer/${customerId}`);
      alert("Something went wrong while deleting entry.");
    }
  };

  if (!customer) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className=" mt-16 p-6 bg-gray-100 min-h-screen">

      <CustomerDetailNavbar />


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


      <div className="mt-6 bg-gradient-to-r from-blue-400 to-pink-500 text-white p-6 rounded-lg shadow-md">
        <p className="text-lg"><strong>Money You Gave:</strong> ₹{moneyYouGave}</p>
        <p className="text-lg"><strong>Money You Got:</strong> ₹{moneyYouGot}</p>
        <p className="text-lg">
          <strong>{balance >= 0 ? "You Will Get:" : "You Will Give:"}</strong>
          <strong> ₹{Math.abs(balance)}</strong>
        </p>
      </div>


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
        {/* <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => navigate("/getcustomers")}
        >
          Back
        </button> */}
      </div>
    </div>
  );
}

export default CustomerDetail;
