import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PerformancePage() {
  const [stats, setStats] = useState({
    totalGrievances: 1247,
    resolved: 982,
    inProgress: 189,
    pending: 76,
    avgResolutionTime: 4.2,
    satisfactionRate: 87.5
  });

  const [categoryData] = useState([
    { name: 'Infrastructure', total: 420, resolved: 350, percentage: 83 },
    { name: 'Water Supply', total: 312, resolved: 280, percentage: 90 },
    { name: 'Sanitation', total: 245, resolved: 198, percentage: 81 },
    { name: 'Electricity', total: 180, resolved: 154, percentage: 86 },
    { name: 'Others', total: 90, resolved: 72, percentage: 80 }
  ]);

  const [wardPerformance] = useState([
    { ward: 'Ward 1', total: 145, resolved: 130, rate: 90 },
    { ward: 'Ward 2', total: 132, resolved: 115, rate: 87 },
    { ward: 'Ward 3', total: 156, resolved: 128, rate: 82 },
    { ward: 'Ward 4', total: 128, resolved: 112, rate: 88 },
    { ward: 'Ward 5', total: 141, resolved: 120, rate: 85 }
  ]);

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        <div className="text-right">
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-black mt-1">{value}</p>
        </div>
      </div>
      <p className="text-sm opacity-80">{subtitle}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar />
    
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-black text-slate-800 mb-3">
              Performance Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Real-time analytics and performance metrics
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard
              title="Total Grievances"
              value={stats.totalGrievances}
              subtitle="All time submissions"
              icon="📊"
              color="from-blue-500 to-blue-600 text-white"
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              subtitle={`${Math.round((stats.resolved / stats.totalGrievances) * 100)}% resolution rate`}
              icon="✅"
              color="from-green-500 to-green-600 text-white"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              subtitle="Being worked on"
              icon="⚡"
              color="from-purple-500 to-purple-600 text-white"
            />
            <StatCard
              title="Pending Review"
              value={stats.pending}
              subtitle="Awaiting assignment"
              icon="⏳"
              color="from-yellow-500 to-yellow-600 text-white"
            />
            <StatCard
              title="Avg Resolution"
              value={`${stats.avgResolutionTime} days`}
              subtitle="Average time to resolve"
              icon="⏱️"
              color="from-indigo-500 to-indigo-600 text-white"
            />
            <StatCard
              title="Satisfaction"
              value={`${stats.satisfactionRate}%`}
              subtitle="User satisfaction rate"
              icon="⭐"
              color="from-pink-500 to-pink-600 text-white"
            />
          </div>

          {/* Category Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Performance by Category
            </h2>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 p-4 rounded-xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">{category.name}</span>
                    <span className="text-sm text-slate-600">
                      {category.resolved}/{category.total} resolved
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500">Resolution Rate</span>
                    <span className="text-sm font-bold text-green-600">{category.percentage}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ward Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Ward-wise Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wardPerformance.map((ward, index) => (
                <motion.div
                  key={ward.ward}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border-2 border-slate-200 hover:border-green-500 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{ward.ward}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total:</span>
                      <span className="font-semibold">{ward.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Resolved:</span>
                      <span className="font-semibold text-green-600">{ward.resolved}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rate:</span>
                      <span className="font-bold text-green-600">{ward.rate}%</span>
                    </div>
                  </div>
                  <div className="mt-4 relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ward.rate}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      
    </div>
  );
}
