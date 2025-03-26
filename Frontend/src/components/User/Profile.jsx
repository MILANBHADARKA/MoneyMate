import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Edit, Camera, Mail, Key, LogOut, Save, X, Users } from 'lucide-react';
import Navbar from '../ui/Navbar';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [fileUpload, setFileUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/user/getuser`, {
          withCredentials: true,
        });
        setUser(response.data.data);
        setEditData({
          username: response.data.data.username,
          password: '',
          confirmPassword: '',
        });
        setLoading(false);
      } catch (err) {
        // console.error('Error fetching user data:', err);
        navigate('/login');
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate('/login');
    } catch (err) {
      // console.error('Logout failed:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setError('');
      setSuccess('');

      if (editData.username !== user.username && editData.username.trim() !== '') {
        const formData = new FormData();
        formData.append('username', editData.username);
        
        await axios.post(`${API_BASE_URL}/api/v1/user/updateuser`, formData, {
          withCredentials: true,
        });
        
        setSuccess((prev) => prev + 'Username updated successfully. ');
      }

      if (editData.password && editData.password.trim() !== '') {
        if (editData.password !== editData.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }

        const formData = new FormData();
        formData.append('password', editData.password);
        
        await axios.post(`${API_BASE_URL}/api/v1/user/updateuser`, formData, {
          withCredentials: true,
        });
        
        setSuccess((prev) => prev + 'Password updated successfully. ');
        setEditData({
          ...editData,
          password: '',
          confirmPassword: '',
        });
      }

      if (fileUpload) {
        const formData = new FormData();
        formData.append('profilePicture', fileUpload);
        
        await axios.post(`${API_BASE_URL}/api/v1/user/updateuser`, formData, {
          withCredentials: true,
        });
        
        setSuccess((prev) => prev + 'Profile picture updated successfully. ');
        setFileUpload(null);
        setPreviewUrl(null);
      }

      const response = await axios.get(`${API_BASE_URL}/api/v1/user/getuser`, {
        withCredentials: true,
      });
      setUser(response.data.data);
      
      setEditMode(false);
    } catch (err) {
      // console.error('Update failed:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar logout={logout} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                {previewUrl ? (
                  <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white">
                    <img 
                      src={previewUrl} 
                      alt="Profile Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  user.profilePicture ? (
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white">
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center border-4 border-white">
                      <User size={40} />
                    </div>
                  )
                )}
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-white text-purple-700 rounded-full p-1 cursor-pointer shadow-lg">
                    <Camera size={16} />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-white/80 flex items-center justify-center md:justify-start">
                  <Mail size={16} className="mr-1" />
                  {user.email}
                </p>
              </div>
              <div className="ml-auto mt-4 md:mt-0">
                {editMode ? (
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleUpdateProfile}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Save size={16} className="mr-1" />
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setEditMode(false);
                        setPreviewUrl(null);
                        setFileUpload(null);
                        setEditData({
                          username: user.username,
                          password: '',
                          confirmPassword: '',
                        });
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <X size={16} className="mr-1" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 relative">
              <span className="block sm:inline">{error}</span>
              <button 
                onClick={() => setError('')}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 relative">
              <span className="block sm:inline">{success}</span>
              <button 
                onClick={() => setSuccess('')}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md p-1 mt-6 flex">
            <button 
              className={`flex-1 py-3 rounded ${activeTab === 'profile' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="flex items-center justify-center">
                <User size={18} className="mr-2" />
                Profile Details
              </span>
            </button>
            <button 
              className={`flex-1 py-3 rounded ${activeTab === 'security' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="flex items-center justify-center">
                <Key size={18} className="mr-2" />
                Security
              </span>
            </button>
          </div>

          {/* all tabs */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={editData.username}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    
                    <div className=''>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                      </label>
                      <input
                        type="text"
                        value={user.email}
                        disabled
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-100 leading-tight"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-auto">
                    <div className="flex border-b pb-3">
                      <div className="w-1/3 font-medium text-gray-500">Username</div>
                      <div className="w-2/3 text-gray-800">{user.username}</div>
                    </div>
                    <div className="flex border-b pb-3">
                      <div className="w-1/3 font-medium text-gray-500">Email</div>
                      <div className="w-2/3 text-gray-800">{user.email}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium text-gray-500">Member Since</div>
                      <div className="w-2/3 text-gray-800">
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Security Settings</h2>
                
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={editData.password}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={editData.confirmPassword}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Leave passwords blank if you don't want to change it.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-500">
                          You can change your password here
                        </p>
                      </div>
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
