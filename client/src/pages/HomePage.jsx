import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center mt-20">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border border-green-300">
              ● OFFICIAL PORTAL
            </span>
            
            {/* Headline */}
            <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
              Smarter<br />Governance,<br />
              <span className="text-green-600">Faster Resolution.</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              A unified platform for Citizens, Engineers, and Administrators to report, track, and resolve civic issues efficiently.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
              <Link to="/register" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
                <span>→</span> Get Started
              </Link>
              <Link to="/login" className="bg-white text-slate-700 border-2 border-slate-300 px-8 py-3 rounded-lg font-bold hover:bg-slate-50 hover:border-green-500 transition flex items-center gap-2 shadow-md">
                🔍 Track Ticket
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t-2 border-slate-300">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-slate-900">12k+</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Issues Solved</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-slate-900">48h</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg Time</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-slate-900">500+</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Villages</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=500&fit=crop" 
                alt="GRAMS Dashboard" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* What is GRAMS Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">About GRAMS</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-4">Centralized Grievance Redressal System</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              GRAMS is a transparent, accountable platform that connects citizens with local authorities to resolve civic issues efficiently. Built on the principle of public pressure and timely action.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-8 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl mb-4">✓</div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">File Complaint</h3>
              <p className="text-slate-600 text-sm">
                Citizens can report civic issues like water supply, road damage, streetlights, waste management with photo evidence and description.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mb-4">⚡</div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">Assign & Track</h3>
              <p className="text-slate-600 text-sm">
                Administrators assign complaints to field engineers who work on-ground to resolve issues. Real-time status updates are visible.
              </p>
            </div>

            <div className="bg-orange-50 p-8 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl mb-4">👁️</div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">Public Transparency</h3>
              <p className="text-slate-600 text-sm">
                Unresolved issues escalate to public view after 7 days, creating accountability pressure on authorities for timely action.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Escalation */}
      <div className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase">Core Policy</span>
            <h2 className="text-4xl font-bold text-white mt-4">7-Day Accountability Rule</h2>
            <p className="text-lg text-slate-300 mt-4 max-w-3xl mx-auto">
              Every grievance must be resolved within 7 days. If authorities fail to act, the complaint automatically escalates to the public domain, putting pressure on responsible officials.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-3">1</div>
              <p className="text-xs font-bold text-green-400 uppercase">Day 0-2</p>
              <h4 className="font-bold text-white mt-1">Filing & Review</h4>
              <p className="text-sm text-slate-300 mt-2">Citizen files complaint. Admin assigns within 24 hours.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-3">2</div>
              <p className="text-xs font-bold text-blue-400 uppercase">Day 3-5</p>
              <h4 className="font-bold text-white mt-1">Active Work</h4>
              <p className="text-sm text-slate-300 mt-2">Engineer inspects and performs resolution work.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mb-3">3</div>
              <p className="text-xs font-bold text-yellow-400 uppercase">Day 6-7</p>
              <h4 className="font-bold text-white mt-1">Final Deadline</h4>
              <p className="text-sm text-slate-300 mt-2">Must be resolved by day 7 or escalates publicly.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-3">4</div>
              <p className="text-xs font-bold text-red-400 uppercase">Day 8+</p>
              <h4 className="font-bold text-white mt-1">Escalation</h4>
              <p className="text-sm text-slate-300 mt-2">Ticket becomes public, creating public pressure.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Process</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-4">How GRAMS Works</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Report Issue', desc: 'Citizens file complaints via mobile or web with photos and location.' },
              { num: 2, title: 'Auto-Assignment', desc: 'System assigns ticket to ward engineer based on location.' },
              { num: 3, title: 'Resolution Work', desc: 'Engineer visits site, performs work, uploads proof photos.' },
              { num: 4, title: 'Citizen Feedback', desc: 'Citizen verifies resolution and rates service.' }
            ].map((step) => (
              <div key={step.num} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">{step.num}</div>
                <div className="mt-4">
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Benefits</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-4 mb-6">Why GRAMS is Different</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Full Transparency</h4>
                    <p className="text-slate-600 text-sm">Every complaint status is visible to citizens. No hidden processes or lost tickets.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Time-Bound Action</h4>
                    <p className="text-slate-600 text-sm">7-day deadline ensures issues don't linger. Automatic escalation creates urgency.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Community Pressure</h4>
                    <p className="text-slate-600 text-sm">Delayed complaints become public. Citizens can upvote to prioritize critical issues.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Proof-Based Resolution</h4>
                    <p className="text-slate-600 text-sm">Engineers must upload photos of completed work. Citizens verify before closure.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 border-2 border-white shadow-2xl">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&auto=format" alt="Citizens using GRAMS" className="rounded-2xl shadow-lg mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-green-600">92%</p>
                    <p className="text-xs text-slate-600 font-semibold">Resolution Rate</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">3.2d</p>
                    <p className="text-xs text-slate-600 font-semibold">Avg Resolution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="text-lg text-green-100 mb-8">Join thousands of citizens using GRAMS to improve their communities. Report issues, track progress, and hold authorities accountable.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login" className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold hover:bg-green-50 transition shadow-lg">
              Sign Up Now
            </Link>
            <Link to="/login" className="bg-green-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-900 transition border-2 border-green-700">
              Track Existing Complaint
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">GRAMS</h3>
            <p>Grievance Redressal And Monitoring System</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Legal</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Use</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Support</h4>
            <ul className="space-y-1">
              <li>Email: info@grams.gov</li>
              <li>Phone: +91-7343-212345</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
