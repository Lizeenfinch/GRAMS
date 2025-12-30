import { useEffect, useMemo, useState } from 'react';
import { grievanceAPI } from '../api/axios';
import Reveal from '../components/Reveal';

function daysBetween(dateA, dateB) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((dateB.getTime() - dateA.getTime()) / msPerDay);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function OverdueIssuesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await grievanceAPI.getAllGrievances();
        if (!isMounted) return;
        setGrievances(res.data?.data || []);
      } catch (e) {
        if (!isMounted) return;
        setError('Failed to load complaints. Please try again.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const overdue = useMemo(() => {
    const now = new Date();
    return grievances
      .filter((g) => {
        const createdAt = new Date(g.createdAt);
        if (Number.isNaN(createdAt.getTime())) return false;
        const ageDays = daysBetween(createdAt, now);
        const isPending = g.status === 'open' || g.status === 'in-progress';
        return isPending && ageDays > 7;
      })
      .map((g) => {
        const createdAt = new Date(g.createdAt);
        const ageDays = Number.isNaN(createdAt.getTime()) ? null : daysBetween(createdAt, now);
        return { ...g, ageDays };
      });
  }, [grievances]);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <Reveal className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-xs font-bold uppercase border border-red-300">
                Public Pressure
              </span>
              <span className="bg-white/70 text-slate-700 px-4 py-2 rounded-full text-xs font-bold uppercase border border-slate-200 backdrop-blur-sm">
                {loading ? 'Loading…' : `${overdue.length} overdue`}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Issues Beyond 7 Days
            </h1>
            <p className="text-slate-700 max-w-3xl text-lg">
              Registered complaints pending for more than 7 days are listed here. Expand any item to view more details.
            </p>

            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-5 rounded-2xl shadow-lg border border-red-700/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">ℹ️</div>
                <div>
                  <div className="font-extrabold text-base">Why public escalation matters</div>
                  <div className="text-white/90 text-sm mt-1">
                    After 7 days without resolution, complaints become visible to all citizens to create accountability pressure.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="mt-2">
            {loading && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-slate-700 font-semibold">Loading complaints…</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-sm">
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            )}

            {!loading && !error && overdue.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
                <p className="text-slate-900 font-extrabold text-2xl mb-2">No overdue complaints</p>
                <p className="text-slate-600">There are currently no pending complaints beyond 7 days.</p>
              </div>
            )}

            {!loading && !error && overdue.length > 0 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase">
                  Showing {overdue.length} overdue complaint{overdue.length === 1 ? '' : 's'}
                </div>

                {overdue.map((g) => (
                  <Reveal key={g._id}>
                    <details
                      className="bg-white border-2 border-red-100 rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition"
                    >
                    <summary className="cursor-pointer list-none">
                      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 to-orange-500" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-xl font-extrabold text-slate-900 truncate">{g.title}</h2>
                            <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                              OVERDUE
                            </span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                              {String(g.status || 'open').toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            <span>📅 {formatDate(g.createdAt)}</span>
                            {typeof g.ageDays === 'number' && <span>⏳ {g.ageDays} days</span>}
                            <span>🏷️ {String(g.category || 'other')}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <div className="text-xs text-slate-500 font-semibold">
                            {g.userId?.name ? `👤 ${g.userId.name}` : '👤 Citizen'}
                          </div>
                          <div className="text-slate-700 font-extrabold text-lg select-none">
                            <span className="group-open:hidden">▾</span>
                            <span className="hidden group-open:inline">▴</span>
                          </div>
                        </div>
                      </div>
                    </summary>

                    <div className="px-6 pb-6">
                      <div className="h-px bg-slate-100 mb-5" />

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Description</div>
                          <p className="text-slate-700 leading-relaxed">{g.description}</p>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Details</div>
                          <div className="space-y-2 text-sm text-slate-700">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-500 font-semibold">Priority</span>
                              <span className="font-bold">{String(g.priority || 'medium').toUpperCase()}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-500 font-semibold">Assigned To</span>
                              <span className="font-bold">
                                {g.assignedTo?.name ? g.assignedTo.name : 'Not assigned'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-500 font-semibold">Comments</span>
                              <span className="font-bold">{Array.isArray(g.comments) ? g.comments.length : 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </details>
                  </Reveal>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
