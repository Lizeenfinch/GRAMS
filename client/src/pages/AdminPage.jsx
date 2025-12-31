import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import GramsLogo from '../components/GramsLogo';
import Reveal from '../components/Reveal';
import { getDashboardStats, getAllGrievancesAdmin } from '../Services/operations/adminAPI';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchDashboard();
  }, [filters]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [statsData, grievancesData] = await Promise.all([
        getDashboardStats(token),
        getAllGrievancesAdmin(token, filters),
      ]);
      setStats(statsData);
      setGrievances(grievancesData);
    } catch (err) {
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'grievances', label: 'Grievances', icon: '📋' },
    { id: 'escalations', label: 'Escalations', icon: '⚠️' },
    { id: 'engineers', label: 'Engineers', icon: '👷' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 fixed h-screen mt-16`}>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 flex items-center justify-center">
              <GramsLogo size={40} />
            </div>
            {sidebarOpen && <span className="text-white font-bold text-lg">GRAMS</span>}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-green-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition"
            >
              <span className="text-lg">🚪</span>
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-16 z-40">
          <Reveal className="w-full flex items-center justify-between" delay={0.03}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                {sidebarOpen ? '◀' : '▶'}
              </button>
              <h1 className="text-2xl font-bold text-slate-900">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Admin</span>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
            </div>
          </Reveal>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {error && (
            <Reveal>
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                {error}
              </div>
            </Reveal>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <Reveal delay={0.03}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-slate-600 text-sm font-medium">Total Users</p>
                          <span className="text-2xl">👥</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
                        <p className="text-xs text-slate-500 mt-2">Active platform users</p>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-slate-600 text-sm font-medium">Total Grievances</p>
                          <span className="text-2xl">📋</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stats?.totalGrievances || 0}</p>
                        <p className="text-xs text-slate-500 mt-2">All submissions</p>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-slate-600 text-sm font-medium">Resolved</p>
                          <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stats?.resolvedGrievances || 0}</p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{
                              width: `${stats?.totalGrievances ? (stats.resolvedGrievances / stats.totalGrievances * 100) : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-slate-600 text-sm font-medium">Open</p>
                          <span className="text-2xl">⏳</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stats?.openGrievances || 0}</p>
                        <p className="text-xs text-slate-500 mt-2">Pending action</p>
                      </div>
                    </div>
                  </Reveal>

                  {/* Quick Stats */}
                  <Reveal delay={0.06}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <p className="text-green-700 font-semibold mb-2">Resolution Rate</p>
                        <p className="text-4xl font-bold text-green-600">
                          {stats?.totalGrievances ? Math.round((stats.resolvedGrievances / stats.totalGrievances) * 100) : 0}%
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                        <p className="text-blue-700 font-semibold mb-2">Avg Resolution Time</p>
                        <p className="text-4xl font-bold text-blue-600">3.2 days</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                        <p className="text-orange-700 font-semibold mb-2">Pending Escalation</p>
                        <p className="text-4xl font-bold text-orange-600">
                          {stats?.escalatedGrievances || 0}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              )}

              {activeTab === 'grievances' && (
                <div className="space-y-6">
                  {/* Filters */}
                  <Reveal delay={0.03}>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          <option value="">All Status</option>
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                        <select
                          value={filters.category}
                          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          <option value="">All Categories</option>
                          <option value="water">Water Supply</option>
                          <option value="road">Road Damage</option>
                          <option value="streetlight">Streetlight</option>
                          <option value="waste">Waste Management</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  </Reveal>

                  {/* Grievances Table */}
                  <Reveal delay={0.06}>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Assigned To</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grievances.length > 0 ? (
                            grievances.map((g) => (
                              <tr key={g._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                                <td className="px-6 py-4 text-sm text-slate-700 font-mono">{g._id?.slice(-6)}</td>
                                <td className="px-6 py-4 text-sm text-slate-900 font-medium">{g.title}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{g.category || 'N/A'}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(g.status)}`}>
                                    {g.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{g.assignedTo || '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-900 font-bold">{g.daysOpen || 0}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                No grievances found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  </Reveal>
                </div>
              )}

              {activeTab === 'escalations' && (
                <Reveal>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <p className="text-3xl mb-2">⚠️</p>
                    <p className="text-slate-600">Escalations management coming soon</p>
                  </div>
                </Reveal>
              )}

              {activeTab === 'engineers' && (
                <Reveal>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <p className="text-3xl mb-2">👷</p>
                    <p className="text-slate-600">Engineers management coming soon</p>
                  </div>
                </Reveal>
              )}

              {activeTab === 'analytics' && (
                <Reveal>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <p className="text-3xl mb-2">📈</p>
                    <p className="text-slate-600">Analytics dashboard coming soon</p>
                  </div>
                </Reveal>
              )}

              {activeTab === 'reports' && (
                <Reveal>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <p className="text-3xl mb-2">📄</p>
                    <p className="text-slate-600">Reports generation coming soon</p>
                  </div>
                </Reveal>
              )}

              {activeTab === 'settings' && (
                <Reveal>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <p className="text-3xl mb-2">⚙️</p>
                    <p className="text-slate-600">Settings management coming soon</p>
                  </div>
                </Reveal>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
