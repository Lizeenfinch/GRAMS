import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { grievanceAPI } from '../api/axios';
import Reveal from '../components/Reveal';
import MotionImage from '../components/MotionImage';

export default function GrievanceFormPage() {
  const navigate = useNavigate();
  const isDev = import.meta?.env?.DEV;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    category: '',
    description: '',
    location: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const keepListeningRef = useRef(false);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      keepListeningRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      try {
        recognitionRef.current?.abort?.();
      } catch {
        // ignore
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'userName' ? 'name' : id === 'userPhone' ? 'phone' : id === 'userEmail' ? 'email' : id === 'userAddress' ? 'address' : id === 'descArea' ? 'description' : id]: value
    }));
  };

  const selectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setFormData(prev => ({
      ...prev,
      category: categoryName.toLowerCase()
    }));
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setFormData(prev => ({
          ...prev,
          location: { lat, lon }
        }));
        setError('');
      },
      (err) => {
        setError(`Unable to fetch location: ${err.message}`);
      }
    );
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      // If an instance exists (e.g., rapid taps), stop it first.
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.abort?.();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // Web Speech doesn't reliably auto-detect across languages; use browser locale.
      recognition.lang = navigator.language || 'en-IN';

      const armSilenceAutoStop = () => {
        // Auto-stop after user stops speaking for a bit (keeps UX from feeling stuck).
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (!keepListeningRef.current) return;
          keepListeningRef.current = false;
          setIsListening(false);
          setInterimText('');
          try {
            recognitionRef.current?.stop?.();
          } catch {
            // ignore
          }
        }, 2200);
      };

      recognition.onstart = () => {
        if (isDev) console.debug('Voice recognition started');
        keepListeningRef.current = true;
        setIsListening(true);
        setError('');
        setInterimText('');
        armSilenceAutoStop();
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result?.[0]?.transcript || '';
          if (isDev) console.debug(`Speech result ${i}: isFinal=${result.isFinal}`, transcript);

          if (result.isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        // Update interim text in real-time
        setInterimText(interim.trim());

        // Every result means the user is still speaking.
        armSilenceAutoStop();

        // Add final transcript to description when available
        if (finalTranscript.trim()) {
          if (isDev) console.debug('Adding final transcript:', finalTranscript.trim());
          setFormData(prev => {
            const updatedDesc = (prev.description ? prev.description + ' ' : '') + finalTranscript.trim();
            if (isDev) console.debug('Updated description:', updatedDesc);
            return {
              ...prev,
              description: updatedDesc
            };
          });
          setInterimText(''); // Clear interim after adding final
          // Keep the auto-stop armed after final text as well.
          armSilenceAutoStop();
        }
      };

      recognition.onerror = (event) => {
        console.error('🔴 Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          setError('No speech detected. Please speak clearly into your microphone.');
        } else if (event.error === 'network') {
          setError('Network error. Please check your internet connection.');
        } else if (event.error === 'audio-capture') {
          setError('No microphone found. Please check your microphone.');
        } else {
          setError(`Voice error: ${event.error}. Please try again.`);
        }
        keepListeningRef.current = false;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isDev) console.debug('Voice recognition ended');
        // Restart automatically while user is in listening mode.
        if (keepListeningRef.current) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch {
              // ignore repeated-start errors
            }
          }, 200);
          return;
        }
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
      recognition.start();
      if (isDev) console.debug('Starting voice recognition...');
    } catch (err) {
      console.error('Error starting voice input:', err);
      setError(`Failed to start voice input: ${err.message}`);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      if (isDev) console.debug('Stopping voice recognition...');
      keepListeningRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      setInterimText('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.category || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await grievanceAPI.createGrievance({
        title: formData.description.substring(0, 50),
        description: formData.description,
        category: formData.category,
        priority: 'medium',
        location: formData.location?.lat ? `${formData.location.lat}, ${formData.location.lon}` : formData.address,
      });
      
      setSuccess(`Complaint submitted successfully! Your Ticket ID: ${response.data?.data?._id?.slice(-6) || 'PENDING'}`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { name: 'Water', icon: '💧', color: 'blue' },
    { name: 'Waste', icon: '🗑️', color: 'green' },
    { name: 'Roads', icon: '🛣️', color: 'slate' },
    { name: 'Electric', icon: '⚡', color: 'yellow' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 py-16 overflow-hidden mt-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-20 w-72 h-72 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <Reveal delay={0.05}>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase inline-block">Report an Issue</span>
            <h1 className="text-5xl font-extrabold text-slate-900 mt-4">File New Grievance</h1>
            <p className="text-slate-600 mt-3 max-w-xl mx-auto text-lg">Help us serve you better. Report civic issues with photos and location for faster resolution.</p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 -mt-8 pb-20">
        <Reveal>
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-100 overflow-hidden">
            
            {/* Form Header */}
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 border-b-2 border-green-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">📝</span>
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-800">New Complaint Form</h2>
                  <p className="text-xs text-slate-500">Fields marked with * are required</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-500">Ready</span>
              </div>
            </div>
            
            <div className="p-8">
              {error && (
                <Reveal>
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                    {error}
                  </div>
                </Reveal>
              )}

              {success && (
                <Reveal>
                  <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6">
                    ✅ {success}
                  </div>
                </Reveal>
              )}

              <form onSubmit={handleSubmit}>

                {/* SECTION 1: PERSONAL DETAILS */}
                <Reveal delay={0.05}>
                  <div className="mb-8 pb-8 border-b-2 border-dashed border-green-100">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">1. Your Information</h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name *</label>
                        <input 
                          type="text" 
                          id="userName"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-green-500 transition font-medium" 
                          placeholder="Enter your full name" 
                          required 
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number *</label>
                        <input 
                          type="tel" 
                          id="userPhone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-green-500 transition font-medium" 
                          placeholder="+91 98765 43210" 
                          required 
                        />
                      </div>
                    </div>

                    {/* Email (Optional) */}
                    <div className="mt-4">
                      <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        id="userEmail"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-green-500 transition font-medium" 
                        placeholder="your.email@example.com" 
                      />
                      <p className="text-xs text-slate-400 mt-1 ml-1">We'll send updates to your email if provided</p>
                    </div>
                  </div>
                </Reveal>

                {/* SECTION 2: LOCATION */}
                <Reveal delay={0.1}>
                  <div className="mb-8 pb-8 border-b-2 border-dashed border-yellow-100">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📍</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">2. Location Details</h3>
                    </div>

                    {/* Live Location Button */}
                    <div className="mb-4">
                      <button 
                        type="button" 
                        onClick={shareLocation}
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:from-orange-600 hover:to-yellow-600 transition flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">📍</span>
                        Share Live Location
                      </button>
                      <p className="text-xs text-slate-500 mt-2 ml-1">Click to auto-detect your current location</p>
                    </div>

                    {/* Location Display */}
                    {formData.location && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-2xl">✅</span>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-green-700 uppercase">Location Captured</p>
                            <p className="text-sm text-green-900 mt-1 font-medium">Your location has been captured successfully!</p>
                            <p className="text-xs text-green-600 mt-1 font-mono">Lat: {formData.location.lat}, Lon: {formData.location.lon}</p>
                          </div>
                        </div>
                        
                        {/* Map Display */}
                        <div className="mt-4 rounded-lg overflow-hidden border-2 border-green-300 h-64 shadow-md">
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(formData.location.lon)-0.01},${parseFloat(formData.location.lat)-0.01},${parseFloat(formData.location.lon)+0.01},${parseFloat(formData.location.lat)+0.01}&layer=mapnik&marker=${formData.location.lat},${formData.location.lon}`}
                            allowFullScreen=""
                            loading="lazy"
                          ></iframe>
                        </div>
                        
                        <p className="text-xs text-green-600 mt-3">📍 Click on the map to open in full view. Verify the location before submitting.</p>
                      </div>
                    )}

                    {/* Manual Address */}
                    <div>
                      <label htmlFor="address" className="block text-xs font-bold text-slate-500 uppercase mb-2">Address / Landmark *</label>
                      <input 
                        type="text" 
                        id="userAddress"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-green-500 transition font-medium" 
                        placeholder="Near Govt School, Sector 4, Main Road" 
                        required 
                      />
                    </div>
                  </div>
                </Reveal>

                {/* SECTION 3: CATEGORY */}
                <Reveal delay={0.15}>
                  <div className="mb-8 pb-8 border-b-2 border-dashed border-orange-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🏷️</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">3. Select Category *</h3>
                      </div>
                      {selectedCategory && (
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{selectedCategory}</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {categoryOptions.map((cat) => (
                        <div 
                          key={cat.name}
                          onClick={() => selectCategory(cat.name)}
                          className={`border-2 rounded-2xl p-5 text-center cursor-pointer transition group ${
                            selectedCategory === cat.name
                              ? 'border-green-500 bg-green-50'
                              : 'border-slate-200 hover:border-green-400 hover:bg-green-50'
                          }`}
                        >
                          <div className="text-3xl mb-2">{cat.icon}</div>
                          <p className="text-sm font-bold text-slate-700">{cat.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* SECTION 4: DESCRIPTION */}
                <Reveal delay={0.2}>
                  <div className="mb-8 pb-8 border-b-2 border-dashed border-green-100">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📝</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">4. Describe Issue *</h3>
                      </div>
                    </div>
                    
                    <div className="relative">
                      {/* Text area with right-side mic (no overlay/popup) */}
                      <div className="relative">
                        <textarea 
                          id="descArea"
                          value={isListening && interimText ? ((formData.description ? formData.description + ' ' : '') + interimText) : formData.description}
                          onChange={handleInputChange}
                          className="w-full h-40 p-5 pr-16 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none transition" 
                          placeholder="Describe the problem, location, and details (minimum 20 characters)..." 
                          minLength={20}
                          required
                        ></textarea>

                        {/* Mic button on right */}
                        <div className="absolute right-4 bottom-4">
                          <motion.button
                            type="button"
                            onClick={isListening ? stopVoiceInput : startVoiceInput}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-12 h-12 rounded-full border flex items-center justify-center transition shadow-md ${
                              isListening
                                ? 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-600 text-white shadow-lg'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-green-300'
                            }`}
                            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                            title={isListening ? 'Stop voice input' : 'Start voice input'}
                          >
                            {/* Smooth rings while listening */}
                            {isListening && (
                              <>
                                <motion.span
                                  className="absolute inset-0 rounded-full border border-green-400"
                                  animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
                                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                                />
                                <motion.span
                                  className="absolute inset-0 rounded-full border border-emerald-300"
                                  animate={{ scale: [1, 1.85], opacity: [0.35, 0] }}
                                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.18 }}
                                />
                                <motion.span
                                  className="absolute inset-0 rounded-full"
                                  animate={{ boxShadow: ['0 0 0 rgba(16,185,129,0.0)', '0 0 18px rgba(16,185,129,0.35)', '0 0 0 rgba(16,185,129,0.0)'] }}
                                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                                />
                              </>
                            )}

                            <motion.span
                              className="relative"
                              animate={
                                isListening
                                  ? { rotate: [0, -8, 8, 0], scale: [1, 1.06, 1] }
                                  : { rotate: 0, scale: 1 }
                              }
                              transition={
                                isListening
                                  ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
                                  : { duration: 0.2 }
                              }
                            >
                              {isListening ? (
                                <svg
                                  width="22"
                                  height="22"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-white"
                                >
                                  <path
                                    d="M7 7.5C7 6.11929 8.11929 5 9.5 5H14.5C15.8807 5 17 6.11929 17 7.5V16.5C17 17.8807 15.8807 19 14.5 19H9.5C8.11929 19 7 17.8807 7 16.5V7.5Z"
                                    fill="currentColor"
                                    opacity="0.95"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  width="22"
                                  height="22"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-slate-700"
                                >
                                  <path
                                    d="M12 14C13.6569 14 15 12.6569 15 11V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V11C9 12.6569 10.3431 14 12 14Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M19 11C19 14.3137 16.3137 17 13 17H11C7.68629 17 5 14.3137 5 11"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M12 17V21"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M9 21H15"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              )}
                            </motion.span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Character Counter with Progress */}
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-medium">{(isListening && interimText ? ((formData.description ? formData.description + ' ' : '') + interimText) : formData.description).length} / 500 characters</p>
                        <motion.div
                          className="h-1.5 bg-gray-200 rounded-full flex-1 ml-3 overflow-hidden"
                        >
                          <motion.div
                            animate={{ width: `${(((isListening && interimText ? ((formData.description ? formData.description + ' ' : '') + interimText) : formData.description).length) / 500) * 100}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-green-600 to-emerald-500 rounded-full"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* SECTION 5: HELP INFO */}
                <Reveal delay={0.25}>
                  <div className="bg-gradient-to-r from-slate-50 to-green-50 rounded-2xl p-6 border-2 border-green-100 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">ℹ️</div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Need Help?</h4>
                        <p className="text-sm text-slate-600">After submission, you'll receive a unique Ticket ID via SMS. Use it to track your complaint status in real-time.</p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Submit Buttons */}
                <Reveal delay={0.3}>
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => navigate(-1)}
                      className="flex-1 py-4 rounded-xl font-bold text-slate-500 border-2 border-slate-200 hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : '📤 Submit Complaint'}
                    </button>
                  </div>
                </Reveal>

              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
