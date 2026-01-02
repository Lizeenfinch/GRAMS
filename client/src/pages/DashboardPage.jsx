import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getUserGrievances } from '../Services/operations/grievanceAPI';
import { getUserProfile, updateUserProfile, requestGrievanceCancellation } from '../Services/operations/authAPI';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DashboardPage = () => {
  const { user, setUser, token } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0
  });
  
  // Cancel Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update profile data when user data loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      if (user.profileImage?.url) {
        setProfileImagePreview(user.profileImage.url);
      }
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage or authStore
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      // Fetch user profile if not loaded
      if (!user || !user.name) {
        try {
          const userData = await getUserProfile(authToken);
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }

      // Fetch grievances with token
      const grievancesData = await getUserGrievances(authToken);
      
      if (grievancesData && Array.isArray(grievancesData)) {
        setGrievances(grievancesData);
        
        // Calculate statistics
        const total = grievancesData.length;
        const open = grievancesData.filter(g => g.status === 'Open').length;
        const inProgress = grievancesData.filter(g => g.status === 'In Progress').length;
        const resolved = grievancesData.filter(g => g.status === 'Resolved').length;
        const rejected = grievancesData.filter(g => g.status === 'Rejected').length;
        
        setStats({ total, open, inProgress, resolved, rejected });
      } else {
        setGrievances([]);
        setStats({ total: 0, open: 0, inProgress: 0, resolved: 0, rejected: 0 });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: null },
    { id: 'account', label: 'Account Details', icon: '👤', badge: null },
    { id: 'password', label: 'Change Password', icon: '🔒', badge: null },
    { id: 'complaints', label: 'My Complaints', icon: '📝', badge: stats.total },
    { id: 'settings', label: 'Settings', icon: '⚙️', badge: null },
    { id: 'help', label: 'Help', icon: '❓', badge: null },
  ];

  const statCards = [
    {
      title: 'Total Complaints',
      value: `${stats.total}+`,
      subtitle: 'ALL SUBMISSIONS',
      gradient: 'from-purple-400 to-pink-500',
      icon: '📋'
    },
    {
      title: 'In Progress',
      value: `${stats.inProgress}`,
      subtitle: 'BEING PROCESSED',
      gradient: 'from-indigo-400 to-purple-500',
      icon: '⏳'
    },
    {
      title: 'Resolved',
      value: `${stats.resolved}+`,
      subtitle: 'SUCCESSFULLY CLOSED',
      gradient: 'from-pink-400 to-rose-500',
      icon: '✅'
    },
    {
      title: 'Success Rate',
      value: stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}%` : '0%',
      subtitle: 'RESOLUTION RATE',
      gradient: 'from-fuchsia-400 to-purple-500',
      icon: '📈'
    }
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.clear();
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    
    if (menuId === 'help') {
      navigate('/help');
    }
  };

  const openCancelModal = (grievance) => {
    if (['Resolved', 'Rejected', 'Cancelled'].includes(grievance.status)) {
      toast.error(`Cannot cancel a ${grievance.status} grievance`);
      return;
    }
    setSelectedGrievance(grievance);
    setCancellationReason('');
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedGrievance(null);
    setCancellationReason('');
  };

  const handleSubmitCancellation = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    if (cancellationReason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters long');
      return;
    }

    setSubmitting(true);
    try {
      const cancelData = {
        grievanceId: selectedGrievance._id,
        reason: cancellationReason
      };

      const response = await requestGrievanceCancellation(cancelData, token);
      
      if (response?.success) {
        toast.success('Cancellation request submitted successfully');
        closeCancelModal();
        await fetchDashboardData(); // Refresh the grievances list
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error(error?.message || 'Failed to submit cancellation request');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      // Implement password change API call here
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSettingsUpdate = () => {
    toast.success('Settings updated successfully');
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setProfileImage(null);
    if (user.profileImage?.url) {
      setProfileImagePreview(user.profileImage.url);
    } else {
      setProfileImagePreview(null);
    }
  };

  const handleUpdateProfile = async () => {
    setSubmitting(true);
    try {
      const authToken = token || localStorage.getItem('token');
      const updateData = {};

      // Only include fields that have been changed
      if (profileData.name !== user.name) updateData.name = profileData.name;
      if (profileData.email !== user.email) updateData.email = profileData.email;
      if (profileData.phone !== user.phone) updateData.phone = profileData.phone;

      if (profileImage) {
        updateData.profileImage = profileImage;
      }

      // Check if there are any changes
      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to update');
        setIsEditingProfile(false);
        return;
      }

      const response = await updateUserProfile(updateData, authToken);
      
      if (response?.success && response?.user) {
        setUser(response.user);
        setIsEditingProfile(false);
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-[65px] from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="w-64 min-h-screen bg-white shadow-xl border-r border-gray-200"
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xl font-bold">G</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Grams</h2>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge !== null && item.badge > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    activeMenu === item.id ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                    Welcome Back {user?.name || 'User'}!
                  </span>
                </h1>
                <p className="text-gray-500 mt-1">Home &gt; Dashboard</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{card.icon}</span>
                  <div className="text-right">
                    <h3 className="text-3xl font-bold">{card.value}</h3>
                  </div>
                </div>
                <p className="text-white/90 text-sm font-semibold tracking-wide">{card.subtitle}</p>
              </motion.div>
            ))}
          </div>

          {/* Content Area Based on Active Menu */}
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg p-8 backdrop-blur-sm"
          >
            {activeMenu === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Complaints</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                ) : grievances.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No complaints filed yet</p>
                    <button
                      onClick={() => navigate('/file-grievance')}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                    >
                      File Your First Complaint
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {grievances.slice(0, 5).map((grievance, index) => (
                      <motion.div
                        key={grievance._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center justify-between p-4 border border-purple-100 rounded-lg bg-gradient-to-r from-white to-purple-50/30 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{grievance.subject}</h3>
                          <p className="text-sm text-gray-500">ID: {grievance.grievanceId}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            grievance.status === 'Resolved' ? 'bg-purple-100 text-purple-700' :
                            grievance.status === 'In Progress' ? 'bg-pink-100 text-pink-700' :
                            grievance.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {grievance.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeMenu === 'account' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Account Details</h2>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                    >
                      <span>✏️</span>
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelEdit}
                        disabled={submitting}
                        className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={submitting}
                        className="px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 flex items-center space-x-2"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            <span>Update Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-inner">
                  {/* Profile Image Section */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        {profileImagePreview ? (
                          <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl text-white font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      {isEditingProfile && (
                        <label className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 cursor-pointer hover:shadow-lg transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="hidden"
                          />
                          <span className="text-xl">📷</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">👤</span>
                        <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                      </div>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ml-11"
                          placeholder="Enter your name"
                        />
                      ) : (
                        <p className="text-lg font-medium text-gray-900 ml-11">{user?.name || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">📧</span>
                        <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                      </div>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ml-11"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <p className="text-lg font-medium text-gray-900 ml-11 truncate">{user?.email || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">📱</span>
                        <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                      </div>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ml-11"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-lg font-medium text-gray-900 ml-11">{user?.phone || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Role */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">🎯</span>
                        <label className="block text-sm font-semibold text-gray-700">Account Role</label>
                      </div>
                      <p className="text-lg font-medium text-gray-900 ml-11 capitalize">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm">
                          {user?.role || 'User'}
                        </span>
                      </p>
                    </div>

                    {/* Account Created */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">📅</span>
                        <label className="block text-sm font-semibold text-gray-700">Member Since</label>
                      </div>
                      <p className="text-lg font-medium text-gray-900 ml-11">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>

                    {/* Total Complaints */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">📊</span>
                        <label className="block text-sm font-semibold text-gray-700">Total Complaints</label>
                      </div>
                      <p className="text-lg font-medium text-gray-900 ml-11">
                        <span className="text-2xl font-bold text-purple-600">{stats.total}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'password' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-inner">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      {/* Current Password */}
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                          <span className="text-xl">🔐</span>
                          <span>Current Password</span>
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your current password"
                        />
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                          <span className="text-xl">🆕</span>
                          <span>New Password</span>
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your new password (min. 6 characters)"
                        />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                          <span className="text-xl">✅</span>
                          <span>Confirm New Password</span>
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Confirm your new password"
                        />
                      </div>

                      {/* Password Requirements */}
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-purple-800 mb-2">Password Requirements:</p>
                        <ul className="text-sm text-purple-700 space-y-1 ml-5 list-disc">
                          <li>At least 6 characters long</li>
                          <li>Mix of letters and numbers recommended</li>
                          <li>Should be different from your current password</li>
                        </ul>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                          className="flex-1 px-6 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all font-medium"
                        >
                          Reset Form
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
                        >
                          {submitting ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'complaints' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage My Complaints</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                ) : grievances.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No complaints filed yet</p>
                    <button
                      onClick={() => navigate('/file-grievance')}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                    >
                      File Your First Complaint
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {grievances.map((grievance) => (
                      <motion.div
                        key={grievance._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">{grievance.subject}</h3>
                            <p className="text-sm text-gray-500 mt-1">ID: {grievance.grievanceId}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${
                            grievance.status === 'Resolved' ? 'bg-purple-100 text-purple-700' :
                            grievance.status === 'In Progress' ? 'bg-pink-100 text-pink-700' :
                            grievance.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            grievance.status === 'Cancelled' ? 'bg-gray-100 text-gray-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {grievance.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{grievance.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-500">
                          <div>
                            <span className="font-semibold">Category:</span>
                            <p>{grievance.category}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Priority:</span>
                            <p className="capitalize">{grievance.priority}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Location:</span>
                            <p>{grievance.location}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Filed:</span>
                            <p>{new Date(grievance.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {grievance.cancellationRequest && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm font-semibold text-yellow-800">Cancellation Request Pending</p>
                            <p className="text-sm text-yellow-700 mt-1">Reason: {grievance.cancellationRequest.reason}</p>
                            <p className="text-xs text-yellow-600 mt-1">Submitted on {new Date(grievance.cancellationRequest.requestedAt).toLocaleDateString()}</p>
                          </div>
                        )}

                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => navigate(`/track/${grievance._id}`)}
                            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            View Details
                          </button>
                          {!['Resolved', 'Rejected', 'Cancelled'].includes(grievance.status) && !grievance.cancellationRequest && (
                            <button
                              onClick={() => openCancelModal(grievance)}
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Cancel Complaint
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeMenu === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-inner">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                      <span className="text-2xl">🔔</span>
                      <span>Notification Preferences</span>
                    </h3>
                    <div className="space-y-4">
                      {/* Email Notifications */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">📧</span>
                          <div>
                            <p className="font-semibold text-gray-800">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                      </div>

                      {/* SMS Notifications */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">💬</span>
                          <div>
                            <p className="font-semibold text-gray-800">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via text message</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                      </div>

                      {/* Push Notifications */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">🔔</span>
                          <div>
                            <p className="font-semibold text-gray-800">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive browser push notifications</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushNotifications}
                            onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleSettingsUpdate}
                      className="mt-6 w-full px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      Save Notification Settings
                    </button>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-inner">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                      <span className="text-2xl">🔒</span>
                      <span>Privacy & Security</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                        <div className="flex items-start space-x-4">
                          <span className="text-2xl">🛡️</span>
                          <div>
                            <p className="font-semibold text-gray-800 mb-2">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                            <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                              Enable 2FA
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                        <div className="flex items-start space-x-4">
                          <span className="text-2xl">📊</span>
                          <div>
                            <p className="font-semibold text-gray-800 mb-2">Data Privacy</p>
                            <p className="text-sm text-gray-600 mb-4">Review and download your personal data</p>
                            <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                              Download My Data
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeCancelModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-white via-red-50/30 to-pink-50 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">Cancel Complaint</h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCancelModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl">×</span>
              </motion.button>
            </div>

            {selectedGrievance && (
              <>
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-purple-700 mb-2">Complaint Details:</p>
                  <p className="text-sm text-gray-700">{selectedGrievance.subject}</p>
                  <p className="text-xs text-gray-500 mt-2">ID: {selectedGrievance.grievanceId}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Reason for Cancellation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Please explain why you want to cancel this complaint (minimum 10 characters)..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">{cancellationReason.length}/500</p>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    <span className="font-semibold">Note:</span> This action will submit a cancellation request. It will be reviewed by an administrator.
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeCancelModal}
                    disabled={submitting}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all font-medium disabled:opacity-50"
                  >
                    Keep Complaint
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitCancellation}
                    disabled={submitting || !cancellationReason.trim()}
                    className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Cancellation'
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-purple-200"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              className="text-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <motion.span 
                  className="text-4xl"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  🚪
                </motion.span>
              </div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-2">Confirm Logout</h3>
              <p className="text-gray-600">Are you sure you want to logout from your account?</p>
            </motion.div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Yes, Logout
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default DashboardPage;
