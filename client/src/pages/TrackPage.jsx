import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchMethod, setSearchMethod] = useState('id'); // 'id' or 'phone'
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGrievance(null);

    try {
      // TODO: Replace with actual API call
      setTimeout(() => {
        // Mock data for demonstration
        setGrievance({
          id: trackingId || 'GR2024001',
          title: 'Broken Street Light',
          category: 'Infrastructure',
          status: 'in-progress',
          priority: 'medium',
          createdAt: '2024-12-15',
          assignedTo: 'Municipal Engineer',
          location: 'MG Road, Ward 12',
          timeline: [
            { status: 'submitted', date: '2024-12-15', time: '10:30 AM', note: 'Grievance submitted successfully' },
            { status: 'reviewed', date: '2024-12-15', time: '02:45 PM', note: 'Assigned to Municipal Engineer' },
            { status: 'in-progress', date: '2024-12-16', time: '09:15 AM', note: 'Engineer visited the site' },
          ]
        });
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to track grievance. Please try again.');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-700',
      reviewed: 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-purple-100 text-purple-700',
      resolved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-black text-slate-800 mb-3">
              Track Your Grievance
            </h1>
            <p className="text-lg text-slate-600">
              Enter your Tracking ID or Phone Number to check status
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            {/* Toggle Search Method */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSearchMethod('id')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  searchMethod === 'id'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🎫 Track by ID
              </button>
              <button
                onClick={() => setSearchMethod('phone')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  searchMethod === 'phone'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📱 Track by Phone
              </button>
            </div>

            <form onSubmit={handleTrack} className="space-y-4">
              {searchMethod === 'id' ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tracking ID
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g., GR2024001"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter registered phone number"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    required
                  />
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Tracking...
                  </span>
                ) : (
                  '🔍 Track Grievance'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Grievance Details */}
          {grievance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {grievance.title}
                  </h2>
                  <p className="text-slate-600">ID: {grievance.id}</p>
                </div>
                <span className={`px-4 py-2 rounded-xl font-semibold ${getStatusColor(grievance.status)}`}>
                  {grievance.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Category</p>
                  <p className="font-semibold text-slate-800">{grievance.category}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Priority</p>
                  <p className="font-semibold text-slate-800 capitalize">{grievance.priority}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Assigned To</p>
                  <p className="font-semibold text-slate-800">{grievance.assignedTo}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Location</p>
                  <p className="font-semibold text-slate-800">{grievance.location}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Timeline</h3>
                <div className="space-y-4">
                  {grievance.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${index === grievance.timeline.length - 1 ? 'bg-green-500' : 'bg-slate-300'}`} />
                        {index < grievance.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-300 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <p className="font-semibold text-slate-800 capitalize mb-1">
                            {item.status.replace('-', ' ')}
                          </p>
                          <p className="text-sm text-slate-600 mb-2">
                            {item.date} at {item.time}
                          </p>
                          <p className="text-slate-700">{item.note}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
