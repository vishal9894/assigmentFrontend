import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { HandleUpdateUser } from "../api/api.js";
import { 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiKey,
  FiCamera
} from "react-icons/fi";

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    setLoading(true);
    try {
      await HandleUpdateUser({
        id: user._id,
        data: formData,
      });
      setIsEditing(false);
      // Refresh to get updated user data
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'manager':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'user':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const roleColors = getRoleColor(user.role);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative mr-4">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  {formData.image || user.image ? (
                    <img 
                      src={formData.image || user.image} 
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {getInitials(user.name)}
                    </span>
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                    >
                      <FiCamera size={16} />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-transparent border-b-2 border-white/50 text-white placeholder-white/70 focus:outline-none focus:border-white"
                      placeholder="Enter your name"
                    />
                  ) : (
                    user.name
                  )}
                </h1>
                <p className="text-indigo-100 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors.bg} ${roleColors.text} ${roleColors.border}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={handleEditToggle}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                isEditing
                  ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  : "bg-white text-indigo-600 hover:bg-gray-100"
              }`}
            >
              {isEditing ? (
                <>
                  <FiX size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <FiEdit2 size={18} />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FiUser className="text-indigo-500" />
                Personal Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiMail className="text-gray-400" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  )}
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiKey className="text-gray-400" />
                    Account Role
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="capitalize text-gray-900 font-medium">{user.role}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors.bg} ${roleColors.text}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Created */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiCalendar className="text-gray-400" />
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "N/A"}
                      </p>
                      {user.createdAt && (
                        <span className="text-xs text-gray-500">
                          {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FiSave size={18} />
                      {loading ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Completion
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Profile Info</span>
                    <span className="font-medium text-indigo-600">80%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: '80%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Account Security</span>
                    <span className="font-medium text-green-600">100%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Account Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-sm text-gray-900">
                    {user._id?.substring(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-900">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;