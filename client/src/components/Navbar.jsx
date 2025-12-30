import { useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import GramsLogo from './GramsLogo';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const handleLogout = () => {
    logout();
    navigate('/');
    setActiveDropdown(false);
  };

  const handleNavClick = () => {
    setShowMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  const activeKey = useMemo(() => {
    if (isActive('/')) return 'home';
    if (isActive('/transparency')) return 'transparency';
    return null;
  }, [location.pathname]);

  const underlineTarget = hoveredLink || activeKey;

  const underlineTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 380, damping: 36, mass: 0.8 };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300 ease-in-out">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group shrink-0 hover:opacity-100 opacity-90 transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        >
          <div className="shadow-lg group-hover:shadow-green-600/50 group-hover:scale-110 transition-all duration-300 ease-out rounded-lg">
            <GramsLogo size={30} />
          </div>
          <div className="hidden sm:block transition-all duration-300">
            <h1 className="font-bold text-base text-slate-900 leading-none group-hover:text-green-600 transition-colors duration-300">GRAMS</h1>
            <p className="text-[8px] font-bold text-green-600 uppercase mt-0.5">Portal</p>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <div className={`nav-menu hidden lg:flex items-center gap-1 text-xs transition-all duration-300 ease-in-out ${showMenu ? 'active' : ''}`}>
          
          {/* Main Navigation */}
          <div className="flex items-center gap-0.5">
            <Link 
              to="/" 
              onMouseEnter={() => setHoveredLink('home')}
              onMouseLeave={() => setHoveredLink(null)}
              className={`top-nav-link px-3 py-1.5 rounded-full text-slate-700 font-medium flex items-center gap-1 transition-all duration-300 ease-out active:scale-95 relative group ${
                isActive('/') ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <svg className="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="hidden lg:inline text-xs">Home</span>
              {underlineTarget === 'home' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-3 right-3 h-px bg-green-600 rounded-full"
                  transition={underlineTransition}
                />
              )}
            </Link>
            <Link 
              to="/transparency"
              onMouseEnter={() => setHoveredLink('transparency')}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={handleNavClick}
              className={`top-nav-link px-3 py-1.5 rounded-full text-slate-700 font-medium flex items-center gap-1 transition-all duration-300 ease-out active:scale-95 relative group ${
                isActive('/transparency') ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600 hover:scale-105'
              }`}
            >
              <svg className="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="hidden lg:inline text-xs">Transparency</span>
              {underlineTarget === 'transparency' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-3 right-3 h-px bg-green-600 rounded-full"
                  transition={underlineTransition}
                />
              )}
            </Link>
            <button 
              onMouseEnter={() => setHoveredLink('community')}
              onMouseLeave={() => setHoveredLink(null)}
              className="top-nav-link px-3 py-1.5 rounded-full text-slate-700 font-medium flex items-center gap-1 transition-all duration-300 ease-out hover:bg-green-50 hover:text-green-600 hover:scale-105 active:scale-95 relative group"
            >
              <svg className="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-2a4 4 0 00-8 0v2h8z" />
              </svg>
              <span className="hidden lg:inline text-xs">Community</span>
              {underlineTarget === 'community' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-3 right-3 h-px bg-green-600 rounded-full"
                  transition={underlineTransition}
                />
              )}
            </button>
            <button 
              onMouseEnter={() => setHoveredLink('track')}
              onMouseLeave={() => setHoveredLink(null)}
              className="top-nav-link px-3 py-1.5 rounded-full text-slate-700 font-medium flex items-center gap-1 transition-all duration-300 ease-out hover:bg-green-50 hover:text-green-600 hover:scale-105 active:scale-95 relative group"
            >
              <svg className="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="hidden lg:inline text-xs">Track</span>
              {underlineTarget === 'track' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-3 right-3 h-px bg-green-600 rounded-full"
                  transition={underlineTransition}
                />
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-slate-300 mx-1 transition-all duration-300"></div>

          {/* Info & Resources */}
          <div className="flex items-center gap-0.5">
            <button 
              onMouseEnter={() => setHoveredLink('help')}
              onMouseLeave={() => setHoveredLink(null)}
              className="top-nav-link px-3 py-1.5 rounded-full text-slate-700 font-medium flex items-center gap-1 transition-all duration-300 ease-out hover:bg-green-50 hover:text-green-600 hover:scale-105 active:scale-95 relative group"
            >
              <svg className="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="hidden lg:inline text-xs">Help</span>
              {underlineTarget === 'help' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-3 right-3 h-px bg-green-600 rounded-full"
                  transition={underlineTransition}
                />
              )}
            </button>
            <button 
              onMouseEnter={() => setHoveredLink('performance')}
              onMouseLeave={() => setHoveredLink(null)}
              className="top-nav-link px-3 py-1.5 rounded-full text-slate-700 font-medium flex items-center gap-1 transition-all duration-300 ease-out hover:bg-green-50 hover:text-green-600 hover:scale-105 active:scale-95 relative group"
            >
              <svg className="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <span className="hidden lg:inline text-xs">Performance</span>
              {underlineTarget === 'performance' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-3 right-3 h-px bg-green-600 rounded-full"
                  transition={underlineTransition}
                />
              )}
            </button>
            <button 
              onMouseEnter={() => setHoveredLink('status')}
              onMouseLeave={() => setHoveredLink(null)}
              className="top-nav-link px-3 py-1.5 rounded-full text-slate-700 font-medium flex items-center gap-1 transition-all duration-300 ease-out hover:bg-green-50 hover:text-green-600 hover:scale-105 active:scale-95 relative group"
            >
              <svg className="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="hidden lg:inline text-xs">Status</span>
              {underlineTarget === 'status' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-3 right-3 h-px bg-green-600 rounded-full"
                  transition={underlineTransition}
                />
              )}
            </button>
          </div>
        </div>

        {/* Right: User Profile + Actions */}
        <div className="flex items-center gap-1 lg:gap-2 transition-all duration-300">
      
          {/* Notifications Icon (shown when logged in) */}
          {isAuthenticated && (
            <button 
              className="hidden p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all duration-300 text-slate-700 relative hover:scale-110 active:scale-95"
              title="Notifications"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 100 12A6 6 0 0010 2zM0 10a10 10 0 1120 0 10 10 0 01-20 0z" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          )}

          {/* Profile Dropdown (shown when logged in) */}
          {isAuthenticated ? (
            <div 
              className="flex items-center gap-1 bg-gradient-to-r from-green-50 to-emerald-50 px-1.5 py-1 rounded-lg border border-green-200 hover:border-green-400 transition-all duration-300 cursor-pointer group relative text-xs hover:shadow-md active:scale-95"
              onMouseEnter={() => setActiveDropdown(true)}
              onMouseLeave={() => setActiveDropdown(false)}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-300 to-emerald-300 flex items-center justify-center text-[10px] font-bold text-green-900 border-2 border-white shadow group-hover:scale-110 transition-transform duration-300">
                {user?.name?.substring(0, 2).toUpperCase() || 'PK'}
              </div>
              
              <div className="text-left leading-tight hidden sm:block transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-800 block group-hover:text-green-700 transition-colors duration-300">{user?.name || 'Pradeep'}</span>
                <span className="text-[7px] text-green-700 uppercase font-semibold">{user?.role || 'Admin'}</span>
              </div>

              {/* Dropdown Menu */}
              <motion.div
                className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 min-w-max origin-top"
                initial={false}
                animate={
                  shouldReduceMotion
                    ? { opacity: activeDropdown ? 1 : 0 }
                    : { opacity: activeDropdown ? 1 : 0, scaleY: activeDropdown ? 1 : 0.95, y: activeDropdown ? 0 : -4 }
                }
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{ pointerEvents: activeDropdown ? 'auto' : 'none' }}
              >
                <Link 
                  to="/profile" 
                  className="block w-full text-left px-3 py-2 hover:bg-green-50 rounded text-xs text-slate-700 font-semibold transition-all duration-200 hover:text-green-600 hover:translate-x-1 relative group"
                  onClick={() => setActiveDropdown(false)}
                >
                  👤 My Profile
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/settings" 
                  className="block w-full text-left px-3 py-2 hover:bg-green-50 rounded text-xs text-slate-700 font-semibold transition-all duration-200 hover:text-green-600 hover:translate-x-1 relative group"
                  onClick={() => setActiveDropdown(false)}
                >
                  ⚙️ Settings
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <hr className="my-1 transition-all duration-300" />
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-3 py-2 hover:bg-red-50 rounded text-xs text-red-600 font-semibold transition-all duration-200 hover:translate-x-1 relative group"
                >
                  🚪 Logout
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                </button>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Login Button (shown when logged out) */}
              <Link 
                to="/login" 
                className="px-2 py-1.5 text-xs font-bold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-green-50 hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                onClick={handleNavClick}
              >
                <span className="hidden sm:inline">Login</span>
              </Link>
            </>
          )}

          {/* New Complaint Button */}
          <Link 
            to="/file-grievance" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 relative group overflow-hidden"
            onClick={handleNavClick}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition-all duration-300"></span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 relative z-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline relative z-10">Complaint</span>
          </Link>

          {/* Dark Mode Toggle */}
          <button 
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all duration-300 text-slate-700 hover:scale-110 active:scale-95 hover:shadow-md relative group"
            title="Toggle Dark Mode"
          >
            <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>

          {/* Hamburger Menu Button */}
          <button 
            className="lg:hidden flex flex-col gap-1.5 p-1.5 rounded-lg hover:bg-slate-100 transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => setShowMenu(!showMenu)}
            title="Toggle Menu"
          >
            <span className={`w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${showMenu ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${showMenu ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${showMenu ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

      </div>
    </nav>
  );
}
