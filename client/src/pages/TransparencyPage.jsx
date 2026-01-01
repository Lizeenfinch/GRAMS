import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Reveal from '../components/Reveal';
import { getTransparencyReport, upvoteIssue } from '../Services/operations/transparencyAPI';
import useAuthStore from '../store/authStore';

export default function TransparencyPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState(true);
  const [report, setReport] = React.useState(null);
  const [upvoting, setUpvoting] = React.useState({});

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTransparencyReport();
      setReport(data || null);
    } catch (err) {
      console.error('Failed to fetch transparency data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (issueId) => {
    if (upvoting[issueId]) return;
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to upvote issues', {
        position: 'bottom-right',
        style: { background: '#1e293b', color: '#fff', borderRadius: '12px' },
      });
      return;
    }

    // Check if user already upvoted this issue
    const issue = report?.overdueIssues?.find(i => i._id === issueId);
    if (issue?.upvotedBy?.some(id => id === user._id || id === user.id)) {
      toast.error('You have already upvoted this issue', {
        position: 'bottom-right',
        style: { background: '#1e293b', color: '#fff', borderRadius: '12px' },
      });
      return;
    }
    
    setUpvoting((prev) => ({ ...prev, [issueId]: true }));
    try {
      const token = localStorage.getItem('token');
      const data = await upvoteIssue(issueId, token);
      if (data) {
        setReport((prev) => ({
          ...prev,
          overdueIssues: prev.overdueIssues.map((issue) =>
            issue._id === issueId
              ? { ...issue, upvotes: data.upvotes, priority: data.priority, upvotedBy: [...(issue.upvotedBy || []), user._id || user.id] }
              : issue
          ),
        }));
        toast.success('Upvote recorded! 🎉', {
          position: 'bottom-right',
          style: { background: '#059669', color: '#fff', borderRadius: '12px' },
        });
      }
    } catch (e) {
      console.error('Failed to upvote:', e);
    } finally {
      setUpvoting((prev) => ({ ...prev, [issueId]: false }));
    }
  };

  const totals = report?.totals || {};
  const satisfaction = report?.satisfaction || { avg: 0, count: 0 };
  const performance = report?.performance || {};
  const overdueIssues = report?.overdueIssues || [];
  const budget = report?.budget || { totalBudgetUsed: 0, breakdown: [] };

  const resolutionRate = Number.isFinite(totals.resolutionRate) ? totals.resolutionRate : 0;
  const resolvedCount = Number.isFinite(totals.resolvedCount) ? totals.resolvedCount : 0;
  const pendingCount = Number.isFinite(totals.pendingCount) ? totals.pendingCount : 0;

  const circleRadius = 84;
  const circumference = 2 * Math.PI * circleRadius;
  const clampedRate = Math.max(0, Math.min(100, resolutionRate));
  const dashOffset = circumference * (1 - clampedRate / 100);

  const categoryStats = React.useMemo(() => {
    const ui = {
      infrastructure: {
        name: 'Infrastructure',
        emoji: '🏗️',
        iconBgClass: 'bg-orange-100',
        barFromClass: 'from-orange-400',
        barToClass: 'to-orange-600',
      },
      health: {
        name: 'Health',
        emoji: '🏥',
        iconBgClass: 'bg-red-100',
        barFromClass: 'from-red-400',
        barToClass: 'to-red-600',
      },
      academic: {
        name: 'Academic',
        emoji: '📚',
        iconBgClass: 'bg-blue-100',
        barFromClass: 'from-blue-400',
        barToClass: 'to-blue-600',
      },
      administrative: {
        name: 'Administrative',
        emoji: '📋',
        iconBgClass: 'bg-purple-100',
        barFromClass: 'from-purple-400',
        barToClass: 'to-purple-600',
      },
      other: {
        name: 'Other',
        emoji: '🔧',
        iconBgClass: 'bg-slate-200',
        barFromClass: 'from-slate-400',
        barToClass: 'to-slate-600',
      },
    };

    const items = report?.charts?.categoryBreakdown || [];
    return items
      .map((c) => {
        const meta = ui[c.key] || ui.other;
        return {
          key: c.key,
          name: meta.name,
          count: c.count || 0,
          percentage: c.percentage || 0,
          emoji: meta.emoji,
          iconBgClass: meta.iconBgClass,
          barFromClass: meta.barFromClass,
          barToClass: meta.barToClass,
        };
      })
      .slice(0, 5);
  }, [report]);

  const budgetCards = React.useMemo(() => {
    const ui = {
      water: {
        title: 'Water Infrastructure',
        emoji: '💧',
        cardClass: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
        amountClass: 'text-blue-600',
        borderClass: 'border-blue-200',
      },
      roads: {
        title: 'Road Maintenance',
        emoji: '🛣️',
        cardClass: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300',
        amountClass: 'text-slate-700',
        borderClass: 'border-slate-300',
      },
      electricity: {
        title: 'Electricity & Others',
        emoji: '⚡',
        cardClass: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200',
        amountClass: 'text-yellow-600',
        borderClass: 'border-yellow-200',
      },
      other: {
        title: 'Other',
        emoji: '🧾',
        cardClass: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
        amountClass: 'text-green-700',
        borderClass: 'border-green-200',
      },
    };

    const breakdown = budget?.breakdown || [];
    return breakdown
      .map((b) => {
        const meta = ui[b.key] || ui.other;
        return {
          key: b.key,
          title: meta.title,
          emoji: meta.emoji,
          amount: b.amount || 0,
          percentage: b.percentage || 0,
          items: b.items || 0,
          cardClass: meta.cardClass,
          amountClass: meta.amountClass,
          borderClass: meta.borderClass,
        };
      })
      .slice(0, 3);
  }, [budget]);

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
            <p className="text-4xl font-extrabold text-slate-900 mb-2">₹{(Number(totals.totalBudgetUsed || 0) / 100000).toFixed(1)}L</p>
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
            <p className="text-4xl font-extrabold text-green-600 mb-2">{Number(totals.avgResolutionDays || 0).toFixed(1)} Days</p>
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
            <p className="text-4xl font-extrabold text-slate-900 mb-2">{totals.activeOfficersCount || 0}</p>
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
            <p className="text-4xl font-extrabold text-purple-600 mb-2">{(satisfaction.avg || 0) > 0 ? `${satisfaction.avg}/5` : '0/5'}</p>
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
              {categoryStats.map((cat) => (
                <div key={cat.key}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${cat.iconBgClass} rounded-full flex items-center justify-center`}>
                        <span>{cat.emoji}</span>
                      </div>
                      <span className="text-slate-700 font-semibold">{cat.name}</span>
                    </div>
                    <span className="text-slate-900 font-bold">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${cat.barFromClass} ${cat.barToClass} h-3 rounded-full`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{cat.count} complaints</p>
                </div>
              ))}
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
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-extrabold text-green-600">{clampedRate}%</span>
              </div>
            </div>
            <h4 className="font-bold text-2xl text-slate-900 mb-2">Resolution Rate</h4>
            <p className="text-sm text-slate-600 mb-8">Highest in District</p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                <p className="text-3xl font-bold text-green-700">{resolvedCount}</p>
                <p className="text-xs text-slate-700 font-semibold mt-1">✅ Resolved</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
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
            {overdueIssues.map((issue, idx) => {
              const isCritical = issue.priority === 'critical' || issue.daysOpen >= 14;
              const badgeClass = isCritical
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-orange-100 text-orange-700 border-orange-300';
              const borderClass = isCritical
                ? 'border-red-200 hover:border-red-400'
                : 'border-orange-200 hover:border-orange-400';
              const iconBg = isCritical ? 'bg-red-100' : 'bg-orange-100';
              const icon = isCritical ? '🚨' : '⏳';
              const badgeText = isCritical ? '🔴 OVERDUE' : '🟠 DELAYED';

              return (
                <Reveal key={issue._id} delay={0.02 + idx * 0.04}>
                  <div className={`bg-white p-8 rounded-2xl shadow-lg border-2 ${borderClass} hover:shadow-xl transition duration-300`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                          {icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">{issue.title}</h4>
                          <p className="text-sm text-slate-500 mt-2">📍 {issue.daysOpen} days ago</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold border ${badgeClass}`}>{badgeText}</span>
                    </div>
                    <p className="text-slate-700 mb-6 leading-relaxed">{issue.description}</p>
                    <div className="flex items-center justify-between border-t pt-6">
                      {(() => {
                        const hasUpvoted = user && issue.upvotedBy?.some(id => id === user._id || id === user.id);
                        return (
                          <motion.button 
                            onClick={() => handleUpvote(issue._id)}
                            disabled={upvoting[issue._id] || hasUpvoted}
                            title={hasUpvoted ? 'You already upvoted this issue' : 'Upvote this issue'}
                            whileHover={!hasUpvoted && !upvoting[issue._id] ? { scale: 1.05 } : {}}
                            whileTap={!hasUpvoted && !upvoting[issue._id] ? { scale: 0.95 } : {}}
                            animate={{
                              backgroundColor: hasUpvoted ? '#dcfce7' : '#fef2f2',
                              borderColor: hasUpvoted ? '#86efac' : '#fecaca',
                              color: hasUpvoted ? '#15803d' : '#b91c1c',
                            }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border-2 ${upvoting[issue._id] ? 'cursor-not-allowed opacity-70' : hasUpvoted ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <motion.span
                              className="text-lg"
                              animate={{ rotate: hasUpvoted ? [0, -10, 10, 0] : 0, scale: hasUpvoted ? [1, 1.2, 1] : 1 }}
                              transition={{ duration: 0.4 }}
                            >
                              {upvoting[issue._id] ? '⏳' : hasUpvoted ? '✓' : '👍'}
                            </motion.span>
                            <motion.span
                              key={issue.upvotes}
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {issue.upvotes || 0} Upvotes
                            </motion.span>
                          </motion.button>
                        );
                      })()}
                      <p className="text-xs text-slate-500 font-semibold">👤 {issue.user?.name || 'Anonymous'}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
            {!loading && overdueIssues.length === 0 && (
              <div className="lg:col-span-2 bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-700">
                No issues are currently beyond 7 days.
              </div>
            )}
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
          {budgetCards.map((b, idx) => (
            <Reveal key={b.key} delay={0.02 + idx * 0.04}>
              <div className={`p-8 rounded-2xl border-2 hover:shadow-lg transition duration-300 ${b.cardClass}`}>
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-lg text-slate-900">{b.title}</h4>
                  <span className="text-3xl">{b.emoji}</span>
                </div>
                <p className={`text-4xl font-extrabold mb-2 ${b.amountClass}`}>₹{(Number(b.amount) / 100000).toFixed(1)}L</p>
                <p className="text-sm text-slate-700 font-semibold">{b.percentage}% of total budget</p>
                <div className={`mt-6 pt-6 border-t ${b.borderClass}`}>
                  <p className="text-sm text-slate-700">
                    <strong className={b.amountClass}>{b.items}</strong> tracked expenses
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
          {!loading && budgetCards.length === 0 && (
            <div className="md:col-span-3 bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-700">
              No budget entries have been recorded yet.
            </div>
          )}
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
              <p className="text-4xl font-extrabold text-green-600 mb-2">{performance.slaComplianceRate ?? 0}%</p>
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
              <p className="text-4xl font-extrabold text-blue-600 mb-2">{performance.firstResponseHoursAvg ?? 0}h</p>
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
              <p className="text-4xl font-extrabold text-orange-600 mb-2">{performance.repeatIssuesCount ?? 0}</p>
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
              <p className="text-4xl font-extrabold text-purple-600 mb-2">
                {(satisfaction.avg || 0) > 0 ? `${satisfaction.avg}/5` : '0/5'}
              </p>
              <p className="font-bold text-slate-900 mb-1">Citizen Rating</p>
              <p className="text-sm text-slate-700">Based on {satisfaction.count || 0} feedbacks</p>
            </div>
            </Reveal>
          </div>
        </div>
      </div>

    </section>
  );
}
