import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, ArrowUpRight, ArrowDownRight, DollarSign, Share2, Users, Clock, ChevronDown, ChevronUp, Edit, LogOut } from "lucide-react";

function SplitRoomDetail() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [balance, setBalance] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("expenses");
  const [expandedExpenses, setExpandedExpenses] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        
        // Get current user info
        const userResponse = await axios.get(
          `${API_BASE_URL}/api/v1/user/getuser`,
          { withCredentials: true }
        );
        
        setCurrentUser(userResponse.data.data);
        
        // Get room details with populated expenses data
        const roomResponse = await axios.get(
          `${API_BASE_URL}/api/v1/splitroom/getsplitroom/${roomId}?populate=true`,
          { withCredentials: true }
        );
        
        // Get balance details
        const balanceResponse = await axios.get(
          `${API_BASE_URL}/api/v1/splitroom/calculatebalance/${roomId}`,
          { withCredentials: true }
        );
        
        // Get summary details
        const summaryResponse = await axios.get(
          `${API_BASE_URL}/api/v1/splitroom/getroomsummary/${roomId}`,
          { withCredentials: true }
        );
        
        // console.log("Room data:", roomResponse.data.data);
        setRoom(roomResponse.data.data);
        setBalance(balanceResponse.data.data);
        setSummary(summaryResponse.data.data);
        setLoading(false);
      } catch (err) {
        // console.error("Error fetching room details:", err);
        alert("Failed to fetch room details.");
        navigate("/splitrooms");
      }
    };

    fetchRoomData();
  }, [roomId]);

  useEffect(() => {
    if (room) {
      setNewRoomName(room.name);
    }
  }, [room]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to clipboard");
  };

  const isCurrentUserPayer = (expense) => {
    return currentUser && expense.paidBy && expense.paidBy._id === currentUser._id;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleExpenseDetails = (expenseId) => {
    setExpandedExpenses(prev => ({
      ...prev,
      [expenseId]: !prev[expenseId]
    }));
  };

    const handleRoomNameEdit = async () => {
      if (!newRoomName || newRoomName.trim() === '') {
        alert("Room name cannot be empty.");
        setIsEditingName(false);
        return;
      }
  
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/splitroom/editsplitroom/${roomId}`,
          { name: newRoomName.trim() },
          { withCredentials: true }
        );
        
        if (response.data && response.data.data) {
          setRoom(response.data.data);
        } else {
          setRoom({
            ...room,
            name: newRoomName.trim()
          });
        }
        
        setIsEditingName(false);
      } catch (err) {
        // console.error("Error updating room name:", err.response.status);
        if (err.response.status == 390) {
          alert("You are Not Admin of this Room");
          setIsEditingName(false);
          return;
        }
        alert("Failed to update room name. Please try again.");
        setIsEditingName(false);
      }
    };

  const handleLeaveRoom = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/splitroom/leavesplitroom/${roomId}`,
        {},
        { withCredentials: true }
      );
      
      navigate("/splitrooms");
    } catch (err) {
      // console.error("Failed to leave the room:", err);
      alert("Failed to leave the room");
      setShowLeaveModal(false);
    }
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="min-h-screen bg-gray-100 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 text-white shadow-md">
        <div className="container mx-auto px-2 sm:px-0">
          <button 
            onClick={() => navigate("/splitrooms")}
            className="flex items-center mb-4 hover:opacity-80 transition cursor-pointer"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="text-sm sm:text-base">Back to Rooms</span>
          </button>
          
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="flex items-center">
              {isEditingName ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="text-gray-800 px-2 py-1 rounded mr-2 focus:outline-none w-full sm:w-auto"
                    autoFocus
                  />
                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button 
                      onClick={handleRoomNameEdit}
                      className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingName(false);
                        setNewRoomName(room?.name || "");
                      }}
                      className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold truncate max-w-[220px] sm:max-w-xs">{room?.name || "Unknown Room"}</h1>
                  <button 
                    onClick={() => {
                      setIsEditingName(true)
                      setNewRoomName(room?.name || "");
                    }}
                    className="ml-2 p-1 hover:bg-white/20 rounded transition"
                    title="Edit room name"
                  >
                    <Edit size={16} />
                  </button>
                </>
              )}
            </div>
            <div className="ml-0 md:ml-4">
              <p className="text-white/80 flex items-center text-sm sm:text-base">
                <Users size={16} className="mr-1" /> 
                {room?.users?.length || 0} {room?.users?.length === 1 ? "member" : "members"}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setShowLeaveModal(true)} 
                className="bg-red-500/80 hover:bg-red-600 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded flex items-center transition"
              >
                <LogOut size={windowWidth < 640 ? 14 : 16} className="mr-1 sm:mr-2" />
                Leave
              </button>
              
              <button 
                onClick={handleCopyRoomId} 
                className="bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded transition flex items-center"
              >
                <Share2 size={windowWidth < 640 ? 14 : 16} className="mr-1 sm:mr-2" />
                Share ID
              </button>
              
              <button 
                onClick={() => navigate(`/addsplitexpense/${roomId}`)} 
                className="bg-green-500 hover:bg-green-600 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded flex items-center transition"
              >
                <Plus size={windowWidth < 640 ? 14 : 16} className="mr-1 sm:mr-2" />
                Add Expense
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="container mx-auto px-4 mt-4 sm:mt-6">
        <div className="bg-white rounded-lg shadow-md p-1 flex">
          <button 
            className={`flex-1 py-2 sm:py-3 rounded text-sm sm:text-base ${activeTab === 'expenses' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('expenses')}
          >
            <span className="flex items-center justify-center">
              <DollarSign size={windowWidth < 640 ? 16 : 18} className="mr-1 sm:mr-2" />
              Expenses
            </span>
          </button>
          <button 
            className={`flex-1 py-2 sm:py-3 rounded text-sm sm:text-base ${activeTab === 'balances' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('balances')}
          >
            <span className="flex items-center justify-center">
              <ArrowUpRight size={windowWidth < 640 ? 16 : 18} className="mr-1 sm:mr-2" />
              Balances
            </span>
          </button>
          <button 
            className={`flex-1 py-2 sm:py-3 rounded text-sm sm:text-base ${activeTab === 'summary' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('summary')}
          >
            <span className="flex items-center justify-center">
              <Users size={windowWidth < 640 ? 16 : 18} className="mr-1 sm:mr-2" />
              Summary
            </span>
          </button>
        </div>
      </div>
      
      {/* all tabs */}
      <div className="container mx-auto px-4 mt-4 sm:mt-6">
        {activeTab === 'expenses' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
              <DollarSign size={windowWidth < 640 ? 18 : 20} className="mr-2 text-blue-600" />
              Expense History
            </h2>
            
            {room?.expenses && room.expenses.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {room.expenses.map((expense) => {
                  const isPaidByMe = isCurrentUserPayer(expense);
                  const isExpanded = expandedExpenses[expense._id] || false;
                  
                  return (
                    <div 
                      key={expense._id} 
                      className={`border-l-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${
                        isPaidByMe ? 'border-l-green-500 bg-green-50' : 'border-l-purple-500 bg-purple-50'
                      }`}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                          <div>
                            <h3 className="font-medium text-base sm:text-lg">{expense.reason || "Expense"}</h3>
                            <p className={`text-xs sm:text-sm flex items-center ${isPaidByMe ? 'text-green-700' : 'text-purple-700'}`}>
                              <span className="font-medium">
                                {isPaidByMe ? 'You paid' : `Paid by ${expense.paidBy?.username || "Unknown"}`}
                              </span>
                            </p>
                            <div 
                              className="flex items-center mt-1 cursor-pointer" 
                              onClick={() => toggleExpenseDetails(expense._id)}
                            >
                              <Users size={14} className="mr-1" />
                              <span className="text-gray-600 text-xs sm:text-sm">
                                Split among {expense.users?.length || 0} people
                              </span>
                              {isExpanded ? 
                                <ChevronUp size={14} className="ml-1 text-gray-600" /> : 
                                <ChevronDown size={14} className="ml-1 text-gray-600" />
                              }
                            </div>
                            <p className="text-gray-500 text-xs flex items-center mt-2">
                              <Clock size={12} className="mr-1" />
                              {formatDate(expense.createdAt)}
                            </p>
                          </div>
                          <div className={`text-right px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
                            isPaidByMe ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            <p className="font-bold text-base sm:text-lg">₹{expense.amount || 0}</p>
                            <p className="text-xs font-medium">
                              {isPaidByMe ? 'You paid' : 'You owe a share'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Participants list */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Participants:</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {expense.users && expense.users.map(user => (
                                <div 
                                  key={user._id} 
                                  className={`flex items-center px-2 py-1 rounded-full text-xs ${
                                    user._id === currentUser?._id 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px] mr-1">
                                    {user.username?.[0]?.toUpperCase() || '?'}
                                  </div>
                                  <span>{user._id === currentUser?._id ? 'You' : user.username}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Each person pays: ₹{((expense.amount || 0) / (expense.users?.length || 1)).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }).reverse()}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <DollarSign size={24} className="text-blue-500" />
                </div>
                <p className="text-gray-600 text-base sm:text-lg">No expenses yet.</p>
                <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Add your first expense to get started!</p>
                <button 
                  onClick={() => navigate(`/addsplitexpense/${roomId}`)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base"
                >
                  Add First Expense
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'balances' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
              <ArrowUpRight size={windowWidth < 640 ? 18 : 20} className="mr-2 text-blue-600" />
              Your Balances
            </h2>
            
            {balance ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Get Money Section */}
                {balance.toReceive?.length > 0 && (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <h3 className="text-green-700 font-medium mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <ArrowDownRight size={windowWidth < 640 ? 16 : 18} className="mr-2" />
                      Money to Receive
                    </h3>
                    <div className="space-y-2">
                      {balance.toReceive.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-white shadow-sm border border-green-100"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-200 flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm">
                              {item.user.username.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-medium text-sm sm:text-base">{item.user.username}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-sm sm:text-base">₹{item.amount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">owes you</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Pay Money Section */}
                {balance.toPay?.length > 0 && (
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                    <h3 className="text-red-600 font-medium mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <ArrowUpRight size={windowWidth < 640 ? 16 : 18} className="mr-2" />
                      Money to Pay
                    </h3>
                    <div className="space-y-2">
                      {balance.toPay.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-white shadow-sm border border-red-100"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-200 flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm">
                              {item.user.username.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-medium text-sm sm:text-base">{item.user.username}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600 text-sm sm:text-base">₹{item.amount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">you owe</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Settled Accounts */}
                {balance.settled?.length > 0 && (
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                    <h3 className="text-gray-600 font-medium mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 bg-gray-600 rounded-full text-white text-xs flex items-center justify-center mr-2">✓</span>
                      Settled Accounts
                    </h3>
                    <div className="space-y-2">
                      {balance.settled.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-white shadow-sm border border-gray-100"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm">
                              {item.user.username.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-medium text-sm sm:text-base">{item.user.username}</p>
                          </div>
                          <div className="flex items-center bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                            <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full text-white text-[10px] sm:text-xs flex items-center justify-center mr-1">✓</span>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">Settled</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No Balances */}
                {(!balance.toReceive?.length && !balance.toPay?.length && !balance.settled?.length) && (
                  <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                      <ArrowUpRight size={24} className="text-blue-500" />
                    </div>
                    <p className="text-gray-600 text-base sm:text-lg">No balances yet.</p>
                    <p className="text-gray-500 text-sm sm:text-base">Add expenses to see your balances with other members.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Balance data is not available.
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'summary' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
              <Users size={windowWidth < 640 ? 18 : 20} className="mr-2 text-blue-600" />
              Room Summary
            </h2>
            
            {summary ? (
              <div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 text-white">
                  <p className="font-medium text-white/80 text-sm sm:text-base">Total Room Expenses</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">₹{summary.room?.totalExpense || 0}</p>
                </div>
                
                <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <Users size={windowWidth < 640 ? 16 : 18} className="mr-2" />
                  Member Summary
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {summary.users && summary.users.length > 0 ? (
                    summary.users.map((userSummary, index) => {
                      const isCurrentMember = currentUser && userSummary.user._id === currentUser._id;
                      const balanceType = 
                        userSummary.netBalance > 0 ? 'positive' : 
                        userSummary.netBalance < 0 ? 'negative' : 'neutral';
                        
                      return (
                        <div 
                          key={index} 
                          className={`border rounded-lg overflow-hidden ${
                            isCurrentMember ? 'border-blue-200 bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="p-3 sm:p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 ${
                                  isCurrentMember ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                                }`}>
                                  {userSummary.user?.username.charAt(0).toUpperCase() || "?"}
                                </div>
                                <p className={`font-medium text-sm sm:text-base ${isCurrentMember ? 'text-blue-800' : ''}`}>
                                  {isCurrentMember ? 'You' : userSummary.user?.username || "Unknown User"}
                                </p>
                              </div>
                              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                                balanceType === 'positive' 
                                  ? 'bg-green-100 text-green-800' 
                                  : balanceType === 'negative' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {balanceType === 'positive' 
                                  ? 'Gets back' 
                                  : balanceType === 'negative' 
                                    ? 'Owes' 
                                    : 'Settled'
                                }
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-2 sm:mt-3">
                              <div className="bg-blue-50 p-1.5 sm:p-2 rounded">
                                <p className="text-gray-500 text-[10px] sm:text-xs">Paid</p>
                                <p className="font-medium text-blue-800 text-xs sm:text-sm">₹{userSummary.paid?.toFixed(2) || "0.00"}</p>
                              </div>
                              <div className="bg-purple-50 p-1.5 sm:p-2 rounded">
                                <p className="text-gray-500 text-[10px] sm:text-xs">Owes</p>
                                <p className="font-medium text-purple-800 text-xs sm:text-sm">₹{userSummary.owes?.toFixed(2) || "0.00"}</p>
                              </div>
                              <div className={`p-1.5 sm:p-2 rounded ${
                                balanceType === 'positive' 
                                  ? 'bg-green-50' 
                                  : balanceType === 'negative' 
                                    ? 'bg-red-50' 
                                    : 'bg-gray-50'
                              }`}>
                                <p className="text-gray-500 text-[10px] sm:text-xs">Balance</p>
                                <p className={`font-medium text-xs sm:text-sm ${
                                  balanceType === 'positive' 
                                    ? 'text-green-600' 
                                    : balanceType === 'negative' 
                                      ? 'text-red-600' 
                                      : 'text-gray-600'
                                }`}>
                                  ₹{Math.abs(userSummary.netBalance || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                      No member summaries available.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                Summary data is not available.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Leave Room Confirmation */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Leave Room?</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to leave this room? You'll need an invitation to rejoin.
              {room?.expenses?.length > 0 && (
                <span className="block mt-2 text-amber-600 font-medium text-sm sm:text-base">
                  Note: Your expense history will remain with the room.
                </span>
              )}
            </p>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveRoom}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white hover:bg-red-700 rounded transition text-sm sm:text-base"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SplitRoomDetail;
