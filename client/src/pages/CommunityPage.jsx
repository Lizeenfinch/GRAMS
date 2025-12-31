import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getAllGrievances } from '../Services/operations/grievanceAPI';

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [grievances, setGrievances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllGrievances();
      setGrievances(data || []);
    } catch (err) {
      setError('Failed to load community issues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filters = React.useMemo(
    () => [
      { key: 'all', label: 'All Issues' },
      { key: 'high', label: 'High Priority' },
      { key: 'infrastructure', label: 'Infrastructure' },
      { key: 'health', label: 'Health' },
      { key: 'academic', label: 'Academic' },
      { key: 'administrative', label: 'Administrative' },
    ],
    []
  );

  const getCategoryIcon = (category) => {
    const icons = {
      infrastructure: 'construction',
      health: 'local_hospital',
      academic: 'school',
      administrative: 'description',
      other: 'report_problem',
    };
    return icons[category] || 'help';
  };

  const getCategoryColor = (category) => {
    const colors = {
      infrastructure: { iconBg: 'bg-orange-100', iconText: 'text-orange-600', vote: { bg: 'bg-orange-50 hover:bg-orange-100', text: 'text-orange-700' } },
      health: { iconBg: 'bg-red-100', iconText: 'text-red-600', vote: { bg: 'bg-red-50 hover:bg-red-100', text: 'text-red-700' } },
      academic: { iconBg: 'bg-blue-100', iconText: 'text-blue-600', vote: { bg: 'bg-blue-50 hover:bg-blue-100', text: 'text-blue-700' } },
      administrative: { iconBg: 'bg-purple-100', iconText: 'text-purple-600', vote: { bg: 'bg-purple-50 hover:bg-purple-100', text: 'text-purple-700' } },
      other: { iconBg: 'bg-gray-100', iconText: 'text-gray-600', vote: { bg: 'bg-gray-50 hover:bg-gray-100', text: 'text-gray-700' } },
    };
    return colors[category] || colors.other;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor((now - created) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const issues = React.useMemo(() => {
    return grievances.map((g) => {
      const colors = getCategoryColor(g.category);
      const isHighPriority = g.priority === 'high' || g.priority === 'critical';
      return {
        id: g._id,
        title: g.title,
        location: g.userId?.name || 'Community Member',
        description: g.description,
        upvotes: g.comments?.length || 0,
        filed: formatTimeAgo(g.createdAt),
        category: g.category,
        priority: g.priority,
        status: g.status,
        icon: getCategoryIcon(g.category),
        iconBg: colors.iconBg,
        iconText: colors.iconText,
        border: isHighPriority ? 'border-2 border-red-200' : 'border border-slate-200',
        chip: isHighPriority ? { text: g.priority === 'critical' ? 'Critical' : 'High Priority', className: 'bg-red-100 text-red-700' } : null,
        vote: colors.vote,
      };
    });
  }, [grievances]);

  const visibleIssues = React.useMemo(() => {
    if (activeFilter === 'all') return issues;
    if (activeFilter === 'high') return issues.filter((i) => i.priority === 'high' || i.priority === 'critical');
    return issues.filter((i) => i.category === activeFilter);
  }, [activeFilter, issues]);

  const stats = React.useMemo(() => {
    const activeNearby = grievances.filter((g) => g.status === 'open' || g.status === 'in-progress').length;
    const resolvedToday = grievances.filter((g) => {
      if (g.status !== 'resolved') return false;
      const resolved = new Date(g.resolutionDate || g.updatedAt);
      const today = new Date();
      return resolved.toDateString() === today.toDateString();
    }).length;
    return { activeNearby, resolvedToday };
  }, [grievances]);

  const ease = [0.22, 1, 0.36, 1];
  const fade = shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease };
  const fadeFast = shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease };

  return (
    <section id="community" className="page-enter bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 py-12 mt-16">
        <motion.div
          className="max-w-5xl mx-auto px-6 text-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={fade}
        >
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Neighborhood Watch
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4">Nearby Issues</h1>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Don&apos;t file duplicate complaints. Upvote existing ones to prioritize them. Community support makes issues
            get resolved faster.
          </p>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 mb-8">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease, delay: 0.08 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-extrabold text-orange-600">{stats.activeNearby}</p>
                <p className="text-xs font-bold text-slate-500 uppercase mt-1">Active Nearby</p>
              </div>
              <div className="border-l border-r border-slate-200">
                <p className="text-2xl font-extrabold text-green-600">{stats.resolvedToday}</p>
                <p className="text-xs font-bold text-slate-500 uppercase mt-1">Resolved Today</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{grievances.length}</p>
                <p className="text-xs font-bold text-slate-500 uppercase mt-1">Total Issues</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-5xl mx-auto px-6 mb-6">
        <motion.div
          className="flex gap-2 overflow-x-auto pb-2"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease, delay: 0.14 }}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <motion.button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                whileTap={shouldReduceMotion ? undefined : { opacity: 0.9 }}
                className="relative px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border border-slate-200 overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-slate-900"
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={fadeFast}
                />
                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-600'}`}>{filter.label}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Issue Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-slate-600 font-semibold">Loading community issues...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-semibold">{error}</p>
            <button
              onClick={fetchGrievances}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && visibleIssues.length === 0 && (
          <div className="bg-slate-100 rounded-xl p-12 text-center">
            <span className="text-6xl mb-4 block">📋</span>
            <p className="text-slate-600 font-semibold text-lg">No issues found in this category</p>
            <p className="text-slate-500 text-sm mt-2">Try selecting a different filter</p>
          </div>
        )}
        
        {!loading && !error && visibleIssues.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="wait" initial={false}>
            {visibleIssues.map((issue) => (
              <motion.div
                key={issue.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fade}
                className={`bg-white p-6 rounded-2xl shadow-sm ${issue.border} hover:shadow-lg transition`}
              >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${issue.iconBg} rounded-xl flex items-center justify-center`}>
                    <span className={`material-symbols-rounded ${issue.iconText}`} aria-hidden="true">
                      {issue.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{issue.title}</h4>
                    <p className="text-xs text-slate-500">{issue.location}</p>
                  </div>
                </div>
                {issue.chip && (
                  <span className={`${issue.chip.className} px-3 py-1 rounded-full text-xs font-bold`}>{issue.chip.text}</span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-4">{issue.description}</p>
              <div className="flex items-center justify-between border-t pt-4">
                <motion.button
                  type="button"
                  whileTap={shouldReduceMotion ? undefined : { opacity: 0.9 }}
                  className={`flex items-center gap-2 ${issue.vote.bg} ${issue.vote.text} px-4 py-2 rounded-full transition font-bold text-sm`}
                >
                  <span className="material-symbols-rounded text-base" aria-hidden="true">
                    thumb_up
                  </span>
                  <span>{issue.upvotes} Upvotes</span>
                </motion.button>
                <p className="text-xs text-slate-400 font-semibold">{issue.filed}</p>
              </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        )}
      </div>

      {/* Community Guidelines */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-8"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={fade}
          >
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
              Guidelines
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-3">How to Use Neighborhood Watch</h3>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease, delay: 0.06 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center"
            >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-rounded text-white text-2xl" aria-hidden="true">
                    search
                  </span>
                </div>
                <h4 className="font-bold text-white mb-2">Search First</h4>
                <p className="text-sm text-slate-300">
                  Before filing a new complaint, check if someone already reported the same issue nearby.
                </p>
            </motion.div>
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center"
            >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-rounded text-white text-2xl" aria-hidden="true">
                    thumb_up
                  </span>
                </div>
                <h4 className="font-bold text-white mb-2">Upvote Instead</h4>
                <p className="text-sm text-slate-300">
                  If you find a matching issue, upvote it. More upvotes = higher priority for authorities.
                </p>
            </motion.div>
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease, delay: 0.14 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center"
            >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-rounded text-white text-2xl" aria-hidden="true">
                    groups
                  </span>
                </div>
                <h4 className="font-bold text-white mb-2">Build Pressure</h4>
                <p className="text-sm text-slate-300">
                  Community support speeds up resolution. Share with neighbors to gather more upvotes.
                </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
