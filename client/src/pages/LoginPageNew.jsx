import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuthStore from '../store/authStore';
import { signInWithGoogle } from '../config/firebaseConfig';

export default function LoginPageNew() {
  const [activeTab, setActiveTab] = useState('citizen');
  const [formData, setFormData] = useState({
    citizenPhone: '',
    adminEmail: '',
    adminPassword: '',
    engId: '',
    engPasscode: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({
      ...prev,
      citizenPhone: digitsOnly
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const phoneDigits = formData.citizenPhone.replace(/[^0-9]/g, '');
      
      if (phoneDigits.length !== 10) {
        setError('Please enter a valid 10-digit mobile number');
        setLoading(false);
        return;
      }

      const fullPhone = '+91' + phoneDigits;

      const response = await axios.post('/auth/send-otp', {
        phone: fullPhone
      });
      
      if (response.data.success) {
        setGeneratedOtp(response.data.demoOTP);
        setOtpSent(true);
        console.log(`✅ OTP sent to ${fullPhone}`);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!otp) {
        setError('Please enter the OTP');
        setLoading(false);
        return;
      }

      if (otp.length !== 6) {
        setError('OTP must be 6 digits');
        setLoading(false);
        return;
      }

      const phoneDigits = formData.citizenPhone.replace(/[^0-9]/g, '');
      const fullPhone = '+91' + phoneDigits;

      const response = await axios.post('/auth/verify-otp', {
        phone: fullPhone,
        otp: otp
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        console.log('✅ OTP verified successfully');
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, role) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call - replace with actual API endpoint
      const endpoint = role === 'citizen' ? '/api/auth/citizen-login' : 
                      role === 'admin' ? '/api/auth/admin-login' : 
                      '/api/auth/engineer-login';
      
      // For demo purposes, set dummy auth
      setTimeout(() => {
        setUser({
          name: role === 'citizen' ? 'Pradeep Kumar' : role === 'admin' ? 'Admin User' : 'Engineer',
          email: formData.adminEmail || 'user@grams.gov.in',
          role: role.charAt(0).toUpperCase() + role.slice(1)
        });
        navigate('/dashboard');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      if (provider === 'Google') {
        // Get Google sign in result with ID token
        const googleResult = await signInWithGoogle();
        
        // Send ID token to backend for verification and JWT generation
        const response = await axios.post('/auth/google-login', {
          idToken: googleResult.idToken,
        });

        if (response.data.success) {
          // Store token and user data
          setToken(response.data.token);
          setUser(response.data.user);
          
          // Redirect to dashboard
          setTimeout(() => navigate('/dashboard'), 500);
        }
      } else if (provider === 'Microsoft') {
        setError('Microsoft login coming soon');
      }
    } catch (error) {
      console.error('Social login error:', error);
      
      // Show detailed error message
      let errorMessage = `${provider} login failed. Please try again.`;
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-64px) mt-[60px] relative overflow-hidden flex items-center justify-center py-12 px-4">
      
      {/* Background with Nature Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-green-50 to-yellow-50">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-100">
          <div className="flex flex-col lg:flex-row min-h-[480px] lg:min-h-[520px]">
            
            {/* Left Side - Welcome Section */}
            <div className="lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
              
              {/* Decorative Blurs */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-lime-400 rounded-full blur-3xl opacity-20"></div>
              
              <div className="relative z-10">
                {/* Logo */}
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

                {/* Welcome Text */}
                <div className="mb-6">
                  <h2 className="text-4xl font-extrabold mb-3 leading-tight">Welcome back</h2>
                  <p className="text-green-100 text-sm leading-relaxed max-w-md">
                    Secure access for Citizens, Engineers, and Administrators to manage grievances and track real-time progress.
                  </p>
                </div>

                {/* Image with better alignment */}
                <div className="relative h-52 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 to-transparent rounded-2xl z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&h=250&fit=crop&auto=format" 
                    alt="Digital Governance" 
                    className="rounded-2xl w-full h-full object-cover shadow-lg border-4 border-white/20"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className="text-sm font-bold">Trusted by 12,000+ Citizens</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                        Fast Resolution
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                        100% Transparent
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 mt-auto pt-8 border-t border-white/20">
                <div className="flex items-center gap-3 text-xs text-green-200 flex-wrap">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-green-300"></div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm6 10c0 .55-.45 1-1 1s-1-.45-1-1-.45-1-1-1-1 .45-1 1-.45 1-1 1-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
                    </svg>
                    <span>Encrypted</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-green-300"></div>
                  <span>© 2025 Nexus TechSol</span>
                </div>
              </div>
            </div>

            {/* Right Side - Login Forms */}
            <div className="lg:w-1/2 bg-gradient-to-br from-white to-green-50/30 p-7 flex flex-col justify-start overflow-y-auto max-h-[520px]">
              
              {/* Tabs */}
              <div className="flex gap-6 border-b-2 border-green-100 mb-8 pb-4">
                <button
                  onClick={() => {
                    setActiveTab('citizen');
                    setOtpSent(false);
                    setError('');
                    setOtp('');
                    setFormData(prev => ({ ...prev, citizenPhone: '' }));
                  }}
                  className={`cursor-pointer transition-all font-bold flex items-center gap-2 text-sm ${
                    activeTab === 'citizen'
                      ? 'text-green-600 border-b-2 border-green-600 -mb-4'
                      : 'text-slate-600 hover:text-green-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="hidden sm:inline">Citizen</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setError('');
                  }}
                  className={`cursor-pointer transition-all font-bold flex items-center gap-2 text-sm ${
                    activeTab === 'admin'
                      ? 'text-green-600 border-b-2 border-green-600 -mb-4'
                      : 'text-slate-600 hover:text-green-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                  <span className="hidden sm:inline">Official</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('engineer');
                    setError('');
                  }}
                  className={`cursor-pointer transition-all font-bold flex items-center gap-2 text-sm ${
                    activeTab === 'engineer'
                      ? 'text-orange-600 border-b-2 border-orange-600 -mb-4'
                      : 'text-slate-600 hover:text-orange-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 2.6c-.77-1.22-2.05-2.1-3.5-2.1-2.3 0-4 1.7-4 4s1.7 4 4 4c1.45 0 2.73-.88 3.5-2.1.14.2.26.4.42.6.72 1.12 1.88 1.86 3.2 1.86 2.3 0 4-1.7 4-4s-1.7-4-4-4c-1.32 0-2.48.74-3.2 1.86-.16.2-.28.4-.42.6zM5.5 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Engineer</span>
                </button>
              </div>

              {/* CITIZEN LOGIN FORM */}
              {activeTab === 'citizen' && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Citizen Login</h3>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-xs flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {!otpSent ? (
                    <>
                      {/* Social Login */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <button
                          onClick={() => handleSocialLogin('Google')}
                          className="flex items-center justify-center gap-2 py-2.5 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-sm font-semibold text-slate-700 hover:border-green-400"
                        >
                          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                          Google
                        </button>
                        <button
                          onClick={() => handleSocialLogin('Microsoft')}
                          className="flex items-center justify-center gap-2 py-2.5 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-sm font-semibold text-slate-700 hover:border-green-400"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="9" height="9" fill="#F25022" /><rect x="13" y="1" width="9" height="9" fill="#7FBA00" /><rect x="1" y="13" width="9" height="9" fill="#00A4EF" /><rect x="13" y="13" width="9" height="9" fill="#FFB900" /></svg>
                          Microsoft
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="relative flex py-2 items-center mb-4">
                        <div className="flex-grow border-t border-green-200"></div>
                        <span className="flex-shrink mx-3 text-slate-400 text-xs font-semibold">OR LOGIN WITH PHONE</span>
                        <div className="flex-grow border-t border-green-200"></div>
                      </div>

                      {/* Phone Form */}
                      <form onSubmit={handleSendOTP}>
                        <div className="mb-4">
                          <label htmlFor="citizenPhone" className="block text-xs font-bold text-slate-600 uppercase mb-1">Mobile Number (10 digits)</label>
                          <div className="relative">
                            <svg className="w-5 h-5 absolute left-4 top-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zm-5-14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                            </svg>
                            <span className="absolute left-11 top-3 text-slate-700 text-sm font-semibold select-none">+91</span>
                            <input 
                              id="citizenPhone"
                              name="citizenPhone"
                              type="text" 
                              inputMode="numeric"
                              autoComplete="off"
                              className="w-full pl-24 pr-4 py-2.5 bg-white border-2 border-green-200 rounded-lg outline-none focus:border-green-500 transition font-medium text-slate-800 text-sm tracking-wider" 
                              placeholder="10 digits"
                              value={formData.citizenPhone}
                              onChange={handlePhoneChange}
                              maxLength="10"
                              required 
                            />
                            <span className="absolute right-4 top-3 text-xs text-green-600 font-semibold pointer-events-none">
                              {formData.citizenPhone.length}/10
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                          </svg>
                          {loading ? 'Sending OTP...' : 'Get OTP'}
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      {/* OTP Verification Form */}
                      <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg mb-4 text-sm text-green-700">
                        <p className="font-semibold">OTP sent to {formData.citizenPhone}</p>
                        <p className="text-xs mt-1">Demo OTP: {generatedOtp}</p>
                      </div>
                      
                      <form onSubmit={handleVerifyOTP}>
                        <div className="mb-4">
                          <label htmlFor="otp" className="block text-xs font-bold text-slate-600 uppercase mb-1">Enter OTP</label>
                          <div className="relative">
                            <svg className="w-5 h-5 absolute left-4 top-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                            </svg>
                            <input 
                              id="otp"
                              name="otp"
                              type="text" 
                              className="w-full pl-12 pr-4 py-2.5 bg-white border-2 border-green-200 rounded-lg outline-none focus:border-green-500 transition font-medium text-slate-800 text-sm text-center tracking-widest" 
                              placeholder="Enter 6-digit OTP"
                              maxLength="6"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                              required 
                            />
                          </div>
                        </div>
                        
                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <button 
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                            setError('');
                          }}
                          className="w-full mt-2 bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-200 transition text-sm"
                        >
                          Back
                        </button>
                      </form>
                    </>
                  )}

                  <p className="mt-4 text-xs text-slate-400 text-center">
                    By continuing you agree to our <a href="#" className="text-green-600 hover:underline">Terms & Privacy Policy</a>
                  </p>

                  <p className="mt-3 text-xs text-slate-500 text-center">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-green-600 hover:text-green-700 font-bold hover:underline">
                      Sign Up Here
                    </Link>
                  </p>
                </div>
              )}

              {/* ADMIN LOGIN FORM */}
              {activeTab === 'admin' && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Administrative Login</h3>
                  <form onSubmit={(e) => handleSubmit(e, 'admin')}>
                    <div className="mb-5">
                      <label htmlFor="adminEmail" className="block text-xs font-bold text-slate-600 uppercase mb-2">Official Email</label>
                      <div className="relative">
                        <svg className="w-5 h-5 absolute left-4 top-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        <input 
                          id="adminEmail"
                          name="adminEmail"
                          type="email" 
                          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-green-200 rounded-xl outline-none focus:border-green-500 transition font-medium" 
                          placeholder="admin@grams.gov.in"
                          value={formData.adminEmail}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="adminPassword" className="block text-xs font-bold text-slate-600 uppercase mb-2">Password</label>
                      <div className="relative">
                        <svg className="w-5 h-5 absolute left-4 top-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm6 10c0 .55-.45 1-1 1s-1-.45-1-1-.45-1-1-1-1 .45-1 1-.45 1-1 1-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
                        </svg>
                        <input 
                          id="adminPassword"
                          name="adminPassword"
                          type="password" 
                          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-green-200 rounded-xl outline-none focus:border-green-500 transition font-medium" 
                          value={formData.adminPassword}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-4 rounded-xl font-bold hover:from-green-800 hover:to-green-700 transition shadow-lg shadow-green-700/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                      </svg>
                      {loading ? 'Logging in...' : 'Secure Login'}
                    </button>
                  </form>
                </div>
              )}

              {/* ENGINEER LOGIN FORM */}
              {activeTab === 'engineer' && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Field Engineer Login</h3>
                  <form onSubmit={(e) => handleSubmit(e, 'engineer')}>
                    <div className="mb-5">
                      <label htmlFor="engId" className="block text-xs font-bold text-slate-600 uppercase mb-2">Engineer ID</label>
                      <div className="relative">
                        <svg className="w-5 h-5 absolute left-4 top-3.5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                        <input 
                          id="engId"
                          name="engId"
                          type="text" 
                          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-orange-200 rounded-xl outline-none focus:border-orange-500 transition font-medium" 
                          placeholder="ENG-1022"
                          value={formData.engId}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="engPasscode" className="block text-xs font-bold text-slate-600 uppercase mb-2">Passcode</label>
                      <div className="relative">
                        <svg className="w-5 h-5 absolute left-4 top-3.5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm6 10c0 .55-.45 1-1 1s-1-.45-1-1-.45-1-1-1-1 .45-1 1-.45 1-1 1-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
                        </svg>
                        <input 
                          id="engPasscode"
                          name="engPasscode"
                          type="password" 
                          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-orange-200 rounded-xl outline-none focus:border-orange-500 transition font-medium" 
                          value={formData.engPasscode}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-orange-700 hover:to-orange-600 transition shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 1.29 2.71 2.71 4.14 1.29 5.57 2.71 7 1.29 8.43 2.71 9.86 1.29 11.29 2.71 12.71 1.29 14.14 4.14 11.29 5.57 12.71 7 11.29 8.43 12.71 12 9.14 15.57 7 17 8.43 18.43 7 20 8.43 21.43 7 22.86 8.43 24.29 7 25.71z" />
                      </svg>
                      {loading ? 'Accessing...' : 'Access Dashboard'}
                    </button>
                  </form>
                </div>
              )}

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
