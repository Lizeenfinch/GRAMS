import React, { useState, useEffect } from 'react';
import { grievanceAPI } from '../api/axios';
import useAuthStore from '../store/authStore';
import Reveal from '../components/Reveal';

export default function DashboardPage() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'water',
    priority: 'medium',
  });
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await grievanceAPI.getUserGrievances();
      setGrievances(response.data.data);
      
      // Calculate stats
      const data = response.data.data;
      setStats({
        open: data.filter(g => g.status === 'open').length,
        inProgress: data.filter(g => g.status === 'in-progress').length,
        resolved: data.filter(g => g.status === 'resolved').length,
      });
    } catch (err) {
      setError('Failed to fetch grievances');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await grievanceAPI.createGrievance(formData);
      setFormData({ title: '', description: '', category: 'water', priority: 'medium' });
      setShowModal(false);
      fetchGrievances();
    } catch (err) {
      setError('Failed to create grievance');
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      water: '💧',
      road: '🛣️',
      streetlight: '💡',
      waste: '🗑️',
      default: '📋'
    };
    return emojis[category] || emojis.default;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Reveal delay={0.05}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900">My Complaints</h1>
                <p className="text-slate-600 mt-2">Welcome back, <span className="font-semibold text-slate-900">{user?.name}!</span></p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3.5 rounded-xl hover:from-green-700 hover:to-green-600 transition font-bold shadow-lg flex items-center gap-2"
              >
                <span>+</span> New Complaint
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Reveal delay={0.02}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Open</p>
                <p className="text-4xl font-extrabold text-slate-900">{stats.open}</p>
                <p className="text-xs text-slate-500 mt-2">Awaiting action</p>
              </div>
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center text-3xl">📋</div>
            </div>
          </div>
          </Reveal>

          <Reveal delay={0.06}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">In Progress</p>
                <p className="text-4xl font-extrabold text-slate-900">{stats.inProgress}</p>
                <p className="text-xs text-slate-500 mt-2">Being resolved</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">⏳</div>
            </div>
          </div>
          </Reveal>

          <Reveal delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Resolved</p>
                <p className="text-4xl font-extrabold text-slate-900">{stats.resolved}</p>
                <p className="text-xs text-slate-500 mt-2">Completed</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-3xl">✅</div>
            </div>
          </div>
          </Reveal>
        </div>

        {error && (
          <Reveal>
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </Reveal>
        )}

        {/* Grievances List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading your complaints...</p>
              </div>
            </div>
          ) : grievances.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-slate-700 text-lg font-semibold mb-2">No complaints yet</p>
              <p className="text-slate-600 mb-6">Create your first complaint to get started</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                <span>+</span> Create Complaint
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {grievances.map((grievance) => (
                <Reveal key={grievance._id}>
                  <div className="p-6 hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getCategoryEmoji(grievance.category)}</span>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 break-words">{grievance.title}</h3>
                            <p className="text-xs text-slate-500 font-mono mt-1">ID: {grievance._id?.slice(-8)}</p>
                          </div>
                        </div>
                        <p className="text-slate-600 mt-3">{grievance.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-4 py-2 rounded-lg font-bold text-sm border whitespace-nowrap ${getStatusColor(grievance.status)}`}>
                          {grievance.status === 'in-progress' ? '🔄 In Progress' : 
                           grievance.status === 'open' ? '🔵 Open' : 
                           grievance.status === 'resolved' ? '✅ Resolved' : 
                           grievance.status === 'closed' ? '⚪ Closed' : 
                           '🚫 Rejected'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getPriorityColor(grievance.priority)}`}>
                        {grievance.priority === 'low' ? '🔵' : 
                         grievance.priority === 'medium' ? '🟡' : 
                         grievance.priority === 'high' ? '🟠' : 
                         '🔴'} {grievance.priority.toUpperCase()} Priority
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                        📂 {grievance.category?.charAt(0).toUpperCase() + grievance.category?.slice(1)}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                        📅 {new Date(grievance.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {grievance.comments?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600 font-medium">
                          💬 {grievance.comments.length} update{grievance.comments.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}

                    {grievance.daysOpen && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                        <span>⏱️ {grievance.daysOpen} day{grievance.daysOpen !== 1 ? 's' : ''} open</span>
                        {grievance.daysOpen > 7 && (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                            ⚠️ Escalated
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Reveal>
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-screen overflow-y-auto">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-6 sticky top-0">
                <h2 className="text-2xl font-bold">New Complaint</h2>
                <p className="text-green-100 text-sm mt-1">Report a civic issue in your area</p>
              </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-slate-700 font-bold mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., Pothole on Main Street"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  rows="4"
                  placeholder="Describe the issue in detail, location, severity..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  >
                    <option value="water">💧 Water Supply</option>
                    <option value="road">🛣️ Road Damage</option>
                    <option value="streetlight">💡 Streetlight</option>
                    <option value="waste">🗑️ Waste Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2">Priority *</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  >
                    <option value="low">🔵 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-600 transition font-bold shadow-lg"
                >
                  Submit Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg hover:bg-slate-300 transition font-bold"
                >
                  Cancel
                </button>
              </div>
              </form>
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}
