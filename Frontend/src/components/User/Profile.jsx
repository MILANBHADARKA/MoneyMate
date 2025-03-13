import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL



  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/user/getuser`, {
        withCredentials: true,
      });



      setUser(response.data.data);
    } catch (error) {
      setError("Failed to fetch profile.");
      alert("Failed to fetch profile.");
      navigate("/login");
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {}, // Empty body
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

  const handleEditProfilePic = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpg, image/jpeg, image/png, image/svg+xml";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("profilePicture", file);


      setUser({ ...user, profilePicture: URL.createObjectURL(file) });

      try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/user/updateuser`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log("Profile Picture Uploaded:", response.data);

        setUser({ ...user, profilePicture: response.data.data.profilePicture });
      } catch (error) {
        setError("Failed to upload profile picture.");
        alert("Failed to upload profile picture.");

        fetchProfile();
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // console.log(user.username);
  };

  const handleSaveChanges = async () => {

    // console.log(user.username);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/updateuser`,
        { username: user.username },
        {
          withCredentials: true,
        }
      );

      console.log("Profile Updated:", response.data);

      setIsEditing(false);
    } catch (error) {
      setIsEditing(false);
      alert("Failed to update profile.");


      fetchProfile();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex justify-center items-center p-6">


      <button
        onClick={() => navigate("/getcustomers")}
        className="absolute top-4 left-4 bg-white/10 p-2 rounded-full shadow-md hover:bg-white/20 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>


      <motion.div
        className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-md w-full text-white text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >

        <div className="relative w-32 h-32 mx-auto">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg object-cover"
          />
          <button
            onClick={handleEditProfilePic}
            className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full shadow-md hover:bg-green-600 transition"
          >
            <FaEdit size={16} />
          </button>
        </div>


        <div className="mt-6">
          <h2 className="text-2xl font-bold">User Profile</h2>

          <div className="mt-4 space-y-4">

            <div className="flex justify-between items-center border-b border-gray-500 pb-2">
              <span className="text-gray-400 mr-4">Username</span>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="bg-transparent text-white border-b border-white focus:outline-none text-right"
                />
              ) : (
                <span className="overflow-auto">{user.username}</span>
              )}
            </div>


            <div className="flex justify-between items-center border-b border-gray-500 pb-2">
              <span className="text-gray-400 mr-4">Email</span>
              <span className="overflow-auto">{user.email}</span>
            </div>
          </div>


          {isEditing ? (
            <motion.button
              className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </motion.button>
          ) : (
            <motion.button
              className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </motion.button>
          )}
        </div>


        <motion.button
          onClick={logout}
          className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold flex items-center justify-center w-full transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
