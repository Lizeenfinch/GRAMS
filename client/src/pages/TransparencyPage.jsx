import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

export default function TransparencyPage() {
  return (
    <section id="impact" className="page-enter bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-20 relative overflow-hidden mt-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-white rounded-full blur-2xl" />
        </div>
        <Reveal className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10" delay={0.05}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-white rounded-full" />
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase backdrop-blur-sm border border-white/30">
              Public Dashboard
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Public Transparency Report
          </h1>
          <p className="text-lg text-green-50 max-w-3xl leading-relaxed">
            Real-time data on grievance resolution, budget utilization, and government accountability.
            Every citizen has the right to know how their complaints are being handled.
          </p>
        </Reveal>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Budget Used */}
          <Reveal delay={0.02}>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-green-300 transition duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase">Total Budget Used</p>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-lg">💰</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 mb-2">₹4.2L</p>
            <div className="flex items-center gap-1">
              <span className="text-green-600">📈</span>
              <p className="text-xs text-green-600 font-semibold">↑ 12% from last month</p>
            </div>
          </div>
          </Reveal>

          {/* Avg Resolution */}
          <Reveal delay={0.06}>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase">Avg Resolution</p>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-lg">⏱️</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-green-600 mb-2">3.5 Days</p>
            <div className="flex items-center gap-1">
              <span className="text-green-600">✅</span>
              <p className="text-xs text-green-600 font-semibold">↓ 0.8 days faster</p>
            </div>
          </div>
          </Reveal>

          {/* Active Officers */}
          <Reveal delay={0.1}>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-orange-300 transition duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase">Active Officers</p>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-lg">👨‍💼</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 mb-2">24</p>
            <div className="flex items-center gap-1">
              <span className="text-slate-600">📍</span>
              <p className="text-xs text-slate-600 font-semibold">Across 12 wards</p>
            </div>
          </div>
          </Reveal>

          {/* Satisfaction */}
          <Reveal delay={0.14}>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-purple-300 transition duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase">Satisfaction</p>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-lg">⭐</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-purple-600 mb-2">4.8/5</p>
            <div className="flex items-center gap-1">
              <span className="text-purple-600">📊</span>
              <p className="text-xs text-purple-600 font-semibold">+0.3 from last quarter</p>
            </div>
          </div>
          </Reveal>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Complaints by Category */}
          <Reveal delay={0.05}>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-2xl text-slate-900">📋 Complaints by Category</h3>
                <p className="text-xs text-slate-500 mt-1">Last 30 days breakdown</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>

            <div className="space-y-6">
              {/* Water */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span>💧</span>
                    </div>
                    <span className="text-slate-700 font-semibold">Water</span>
                  </div>
                  <span className="text-slate-900 font-bold">40%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                    style={{ width: '40%' }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">245 complaints</p>
              </div>

              {/* Roads */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <span>🛣️</span>
                    </div>
                    <span className="text-slate-700 font-semibold">Roads</span>
                  </div>
                  <span className="text-slate-900 font-bold">35%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-slate-600 to-slate-800 h-3 rounded-full"
                    style={{ width: '35%' }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">215 complaints</p>
              </div>

              {/* Electricity */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span>💡</span>
                    </div>
                    <span className="text-slate-700 font-semibold">Electricity</span>
                  </div>
                  <span className="text-slate-900 font-bold">15%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-3 rounded-full"
                    style={{ width: '15%' }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">92 complaints</p>
              </div>

              {/* Waste */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span>🗑️</span>
                    </div>
                    <span className="text-slate-700 font-semibold">Waste</span>
                  </div>
                  <span className="text-slate-900 font-bold">10%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full"
                    style={{ width: '10%' }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">61 complaints</p>
              </div>
            </div>
          </div>
          </Reveal>

          {/* Resolution Rate */}
          <Reveal delay={0.09}>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 flex flex-col justify-center items-center text-center">
            <div className="mb-6">
              <span className="text-5xl"></span>
            </div>
            <div className="relative w-48 h-48 mb-8">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="#22c55e"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray="527.79"
                  strokeDashoffset="63.34"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-extrabold text-green-600">88%</span>
              </div>
            </div>
            <h4 className="font-bold text-2xl text-slate-900 mb-2">Resolution Rate</h4>
            <p className="text-sm text-slate-600 mb-8">Highest in District</p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                <p className="text-3xl font-bold text-green-700">540</p>
                <p className="text-xs text-slate-700 font-semibold mt-1">✅ Resolved</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="text-3xl font-bold text-orange-600">74</p>
                <p className="text-xs text-slate-700 font-semibold mt-1">⏳ Pending</p>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </div>

      {/* Public Escalations Section */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal delay={0.05}>
            <div className="flex items-start justify-between mb-12 flex-col lg:flex-row lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-xs font-bold uppercase border border-red-300">
                    Public Pressure
                  </span>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-3">
                  Issues Beyond 7 Days
                </h2>
                <p className="text-slate-700 max-w-2xl">
                  Complaints that breached the deadline are now public. Citizens can upvote to
                  prioritize urgent issues.
                </p>
              </div>
              <Link to="/transparency/issues" className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition shadow-md whitespace-nowrap">
                <span className="text-lg">📢</span>
                View All
              </Link>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Escalated Issue 1 */}
            <Reveal delay={0.02}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-red-200 hover:shadow-xl hover:border-red-400 transition duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
                    🚨
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">
                      Pipeline Burst on Main Road
                    </h4>
                    <p className="text-sm text-slate-500 mt-2">📍 Ward 4 • 9 days ago</p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-xs font-bold">
                  🔴 OVERDUE
                </span>
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Major water pipeline burst causing waterlogging and traffic disruption on the main
                road near market area.
              </p>
              <div className="flex items-center justify-between border-t pt-6">
                <button className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-full transition font-bold text-sm border border-red-200">
                  <span className="text-lg">👍</span>
                  <span>127 Upvotes</span>
                </button>
                <p className="text-xs text-slate-500 font-semibold">👤 Rajesh Sharma</p>
              </div>
            </div>
            </Reveal>

            {/* Escalated Issue 2 */}
            <Reveal delay={0.06}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-200 hover:shadow-xl hover:border-orange-400 transition duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                    💡
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">Streetlight Not Working</h4>
                    <p className="text-sm text-slate-500 mt-2">📍 Ward 9 • 8 days ago</p>
                  </div>
                </div>
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-xs font-bold">
                  🟠 DELAYED
                </span>
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Multiple streetlights not working on the main lane. Residents concerned about safety
                during night hours.
              </p>
              <div className="flex items-center justify-between border-t pt-6">
                <button className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-2 rounded-full transition font-bold text-sm border border-orange-200">
                  <span className="text-lg">👍</span>
                  <span>89 Upvotes</span>
                </button>
                <p className="text-xs text-slate-500 font-semibold">👤 Meena Verma</p>
              </div>
            </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-8 bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-2xl flex items-start gap-4 shadow-lg">
              <span className="text-3xl">ℹ️</span>
              <p className="text-base font-semibold leading-relaxed">
                <strong>Why Public Escalation Matters:</strong> After 7 days without resolution,
                complaints become visible to all citizens. This transparency creates accountability
                pressure on authorities to take immediate action.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <Reveal delay={0.05}>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">💳</span>
              <span className="bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold uppercase border border-slate-300">
                Financial Transparency
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Budget Utilization</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              Detailed breakdown of how public funds are being spent on grievance resolution.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Water Infrastructure */}
          <Reveal delay={0.02}>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-bold text-lg text-slate-900">Water Infrastructure</h4>
              <span className="text-3xl">💧</span>
            </div>
            <p className="text-4xl font-extrabold text-blue-600 mb-2">₹1.8L</p>
            <p className="text-sm text-slate-700 font-semibold">42% of total budget</p>
            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-sm text-slate-700">
                <strong className="text-blue-600">127</strong> pipe repairs,{' '}
                <strong className="text-blue-600">18</strong> valve replacements
              </p>
            </div>
          </div>
          </Reveal>

          {/* Road Maintenance */}
          <Reveal delay={0.06}>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border-2 border-slate-300 hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-bold text-lg text-slate-900">Road Maintenance</h4>
              <span className="text-3xl">🛣️</span>
            </div>
            <p className="text-4xl font-extrabold text-slate-700 mb-2">₹1.5L</p>
            <p className="text-sm text-slate-700 font-semibold">36% of total budget</p>
            <div className="mt-6 pt-6 border-t border-slate-300">
              <p className="text-sm text-slate-700">
                <strong className="text-slate-700">89</strong> potholes filled,{' '}
                <strong className="text-slate-700">12</strong> road repairs
              </p>
            </div>
          </div>
          </Reveal>

          {/* Electricity & Others */}
          <Reveal delay={0.1}>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl border-2 border-yellow-200 hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-bold text-lg text-slate-900">Electricity & Others</h4>
              <span className="text-3xl">⚡</span>
            </div>
            <p className="text-4xl font-extrabold text-yellow-600 mb-2">₹0.9L</p>
            <p className="text-sm text-slate-700 font-semibold">22% of total budget</p>
            <div className="mt-6 pt-6 border-t border-yellow-200">
              <p className="text-sm text-slate-700">
                <strong className="text-yellow-600">54</strong> streetlights fixed,{' '}
                <strong className="text-yellow-600">23</strong> misc
              </p>
            </div>
          </div>
          </Reveal>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal delay={0.05}>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-3xl">📈</span>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase border border-green-300">
                  Performance
                </span>
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-3">
                Key Metrics & Accountability
              </h2>
              <p className="text-slate-700 max-w-2xl mx-auto">
                Real-time performance indicators showing our commitment to service excellence.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* SLA Compliance */}
            <Reveal delay={0.02}>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200 text-center hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📋
              </div>
              <p className="text-4xl font-extrabold text-green-600 mb-2">92%</p>
              <p className="font-bold text-slate-900 mb-1">SLA Compliance</p>
              <p className="text-sm text-slate-700">Resolved within 7 days</p>
            </div>
            </Reveal>

            {/* First Response */}
            <Reveal delay={0.06}>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200 text-center hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⏱️
              </div>
              <p className="text-4xl font-extrabold text-blue-600 mb-2">1.2h</p>
              <p className="font-bold text-slate-900 mb-1">First Response</p>
              <p className="text-sm text-slate-700">Avg time to assignment</p>
            </div>
            </Reveal>

            {/* Repeat Issues */}
            <Reveal delay={0.1}>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border-2 border-orange-200 text-center hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔄
              </div>
              <p className="text-4xl font-extrabold text-orange-600 mb-2">7</p>
              <p className="font-bold text-slate-900 mb-1">Repeat Issues</p>
              <p className="text-sm text-slate-700">Re-opened complaints</p>
            </div>
            </Reveal>

            {/* Citizen Rating */}
            <Reveal delay={0.14}>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-200 text-center hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⭐
              </div>
              <p className="text-4xl font-extrabold text-purple-600 mb-2">4.8/5</p>
              <p className="font-bold text-slate-900 mb-1">Citizen Rating</p>
              <p className="text-sm text-slate-700">Based on 342 feedbacks</p>
            </div>
            </Reveal>
          </div>
        </div>
      </div>

    </section>
  );
}
