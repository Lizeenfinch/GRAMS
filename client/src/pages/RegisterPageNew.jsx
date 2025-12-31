import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Reveal from '../components/Reveal';
import { register } from '../Services/operations/authAPI';

export default function RegisterPageNew() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'user'
      }, navigate);

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-64px)] mt-[60px] relative overflow-hidden flex items-center justify-center py-12 px-4">
      
      {/* Background with Nature Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-green-50 to-yellow-50">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-100">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Left Side - Welcome Section */}
            <div className="lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
              
              {/* Decorative Blurs */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-lime-400 rounded-full blur-3xl opacity-20"></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <Reveal delay={0.05}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 flex-shrink-0">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="font-bold text-3xl tracking-tight">GRAMS</h1>
                      <p className="text-xs text-green-100 uppercase tracking-wider font-semibold">Nexus TechSol</p>
                    </div>
                  </div>
                </Reveal>

                {/* Welcome Text */}
                <Reveal delay={0.1}>
                  <div className="mb-12">
                    <h2 className="text-4xl font-extrabold mb-3 leading-tight">Join Us Today</h2>
                    <p className="text-green-100 text-sm leading-relaxed max-w-md">
                      Create your account to report, track, and resolve civic grievances efficiently.
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Bottom Badges */}
              <Reveal delay={0.12}>
                <div className="relative z-10 space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs text-green-100">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>✓ Fast & Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-100">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>✓ Privacy Protected</span>
                  </div>
                </div>
              </Reveal>

              {/* Decorative Image Section - Centered */}
              <Reveal delay={0.15}>
              <div className="relative z-10 flex flex-col items-center justify-center mt-auto">
                <div className="w-full max-w-xs rounded-2xl overflow-hidden border-4 border-white/20 backdrop-blur-sm shadow-xl p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center min-h-[220px]">
                  {/* Clean SVG Icon */}
                  <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Document */}
                    <rect x="25" y="15" width="50" height="65" rx="3" fill="white" stroke="white" strokeWidth="1.5" />
                    
                    {/* Lines on document */}
                    <line x1="32" y1="25" x2="68" y2="25" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                    <line x1="32" y1="35" x2="68" y2="35" stroke="#10b981" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
                    <line x1="32" y1="43" x2="55" y2="43" stroke="#10b981" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
                    <line x1="32" y1="51" x2="68" y2="51" stroke="#10b981" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
                    <line x1="32" y1="59" x2="55" y2="59" stroke="#10b981" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
                    
                    {/* Left hand */}
                    <path d="M 22 45 Q 18 40 18 32 Q 18 26 22 22" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="22" cy="20" r="3.5" fill="white" />
                    
                    {/* Right hand */}
                    <path d="M 78 45 Q 82 40 82 32 Q 82 26 78 22" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="78" cy="20" r="3.5" fill="white" />
                    
                    {/* Checkmark badge */}
                    <circle cx="50" cy="82" r="12" fill="#34d399" stroke="white" strokeWidth="2" />
                    <path d="M 46 82 L 49 85 L 55 79" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Text below image */}
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-bold text-white mb-2">Easy Grievance Filing</h3>
                  <p className="text-sm text-green-100 max-w-xs">Report and track your civic issues with ease and transparency</p>
                </div>
              </div>
              </Reveal>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                <Reveal delay={0.05}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h3>
                  <p className="text-slate-600 text-sm mb-6">Fill in your details to get started</p>
                </Reveal>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-600 uppercase mb-2">Full Name</label>
                    <div className="relative">
                      <svg className="w-5 h-5 absolute left-4 top-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <input 
                        id="name"
                        name="name"
                        type="text" 
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-green-200 rounded-xl outline-none focus:border-green-500 transition font-medium text-slate-800" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <svg className="w-5 h-5 absolute left-4 top-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      <input 
                        id="email"
                        name="email"
                        type="email" 
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-green-200 rounded-xl outline-none focus:border-green-500 transition font-medium text-slate-800" 
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-600 uppercase mb-2">Phone Number (Optional)</label>
                    <div className="relative">
                      <svg className="w-5 h-5 absolute left-4 top-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zm-5-14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                      </svg>
                      <input 
                        id="phone"
                        name="phone"
                        type="tel" 
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-green-200 rounded-xl outline-none focus:border-green-500 transition font-medium text-slate-800" 
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase mb-2">Password</label>
                    <div className="relative">
                      <svg className="w-5 h-5 absolute left-4 top-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
                      </svg>
                      <input 
                        id="password"
                        name="password"
                        type="password" 
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-green-200 rounded-xl outline-none focus:border-green-500 transition font-medium text-slate-800" 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-600 uppercase mb-2">Confirm Password</label>
                    <div className="relative">
                      <svg className="w-5 h-5 absolute left-4 top-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
                      </svg>
                      <input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password" 
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-green-200 rounded-xl outline-none focus:border-green-500 transition font-medium text-slate-800" 
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-center text-slate-600 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline">
                    Sign In
                  </Link>
                </p>

                <p className="mt-4 text-xs text-slate-400 text-center">
                  By signing up you agree to our{' '}
                  <a href="#" className="text-green-600 hover:underline">
                    Terms & Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
}
