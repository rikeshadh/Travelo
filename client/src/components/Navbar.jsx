import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { NotificationContext } from '../context/NotificationContext';

const Navbar = () => {
  const { user, login, signup, loginWithGoogleMock, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { notifications, unreadCount, markAsRead } = useContext(NotificationContext);

  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Auth Form State
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogleMock({
        name: 'Google Traveler',
        email: 'google.traveler@example.com',
        googleId: 'google_mock_123456789',
        avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&h=150&q=80'
      });
      setShowAuthModal(false);
    } catch (err) {
      setAuthError('Google login simulation failed.');
    }
  };

  const handleSearchRedirect = (focusField) => {
    navigate(`/search?focus=${focusField}`);
  };

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img src="/images/NavLogo.webp" alt="Travelo Logo" />
            </Link>
          </div>

          {/* Mini Search Bar (Shows on Scroll) */}
          {scrolled && (
            <div className="mini-search">
              <button className="mini-btn" onClick={() => handleSearchRedirect('destination')}>Where</button>
              <span className="divider"></span>
              <button className="mini-btn" onClick={() => handleSearchRedirect('dates')}>Date</button>
              <span className="divider"></span>
              <button className="mini-btn" onClick={() => handleSearchRedirect('guests')}>Add Guests</button>
              <button className="mini-search-icon" onClick={() => handleSearchRedirect('search')}>
                <i className="fas fa-search"></i>
              </button>
            </div>
          )}

          {/* Nav Icons & User Menu */}
          <div className="nav-icons">
            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle Dark/Light Mode">
              <i className={darkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>

            {/* Notifications (Only if Logged In) */}
            {user && (
              <div className="relative">
                <button className="notify-icon" onClick={() => { setShowNotifications(!showNotifications); setShowMenu(false); }}>
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notify-header">Notifications</div>
                    {notifications.length === 0 ? (
                      <div className="notify-empty">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`notify-item ${n.read ? '' : 'unread'}`}
                          onClick={() => {
                            markAsRead(n._id);
                            setShowNotifications(false);
                            if (n.link) navigate(n.link);
                          }}
                        >
                          {n.message}
                          <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Hamburger / Profile Menu */}
            <div className="relative">
              <button className="hamburger-btn" onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); }}>
                <i className="fas fa-bars"></i>
              </button>

              {showMenu && (
                <div className="menu-dropdown">
                  <ul>
                    <li><Link to="/about" onClick={() => setShowMenu(false)}>About Us</Link></li>
                    <li><Link to="/contact" onClick={() => setShowMenu(false)}>Contact</Link></li>
                    <li><Link to="/faq" onClick={() => setShowMenu(false)}>FAQ</Link></li>
                    <li><Link to="/blog" onClick={() => setShowMenu(false)}>Blog</Link></li>
                    
                    {user ? (
                      <>
                        <div className="dropdown-divider"></div>
                        <li><Link to="/dashboard" onClick={() => setShowMenu(false)}>My Dashboard</Link></li>
                        <li><Link to="/support" onClick={() => setShowMenu(false)}>Chat Support</Link></li>
                        {user.role === 'admin' && (
                          <li><Link to="/admin" onClick={() => setShowMenu(false)}>Admin Console</Link></li>
                        )}
                        <div className="dropdown-divider"></div>
                        <li>
                          <button onClick={() => { logout(); setShowMenu(false); navigate('/'); }} style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
                            Log Out
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <div className="dropdown-divider"></div>
                        <li>
                          <button 
                            className="login-btn"
                            onClick={() => { setShowAuthModal(true); setIsLoginView(true); setShowMenu(false); }}
                          >
                            Log in | Sign up
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== Auth Modal ===== */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowAuthModal(false)}>&times;</button>
            
            <div className="signup-header">
              <h3>{isLoginView ? 'Welcome Back' : 'Join Travelo'}</h3>
              <p>{isLoginView ? 'Sign in to access your bookings' : 'Create an account to unlock deals'}</p>
            </div>

            {authError && (
              <div style={{ color: 'white', background: 'var(--accent-color)', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="signup-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!isLoginView && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="signup-continue-btn" style={{ margin: '10px 0 0 0' }}>
                {isLoginView ? 'Log In' : 'Sign Up'}
              </button>

              <div className="signup-or-separator" style={{ margin: '10px 0' }}><span>or</span></div>

              <button type="button" className="signup-social-btn signup-google" onClick={handleGoogleLogin}>
                <i className="fab fa-google"></i> Continue with Google
              </button>
            </form>

            <p style={{ fontSize: '13px', textAlign: 'center', marginTop: '15px', color: 'var(--text-muted)' }}>
              {isLoginView ? "Don't have an account? " : 'Already have an account? '}
              <button 
                onClick={() => { setIsLoginView(!isLoginView); setAuthError(''); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                {isLoginView ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
