import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { NotificationContext } from '../context/NotificationContext';

const Navbar = () => {
  const { user, login, signup, loginWithGoogleMock, logout, showAuthModal, setShowAuthModal } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { notifications, unreadCount, markAsRead } = useContext(NotificationContext);

  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Auth Form State
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '800', fontSize: '1.5rem', letterSpacing: '0.5px' }}>
              <img 
                src="/images/NavLogo.webp" 
                alt="Travelo" 
                style={{ maxHeight: '42px', width: 'auto', display: 'block' }} 
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (!e.target.parentNode.querySelector('.logo-text-fallback')) {
                    e.target.insertAdjacentHTML('afterend', '<span class="logo-text-fallback" style="color: white; font-weight: 800; font-size: 1.5rem; display: flex; align-items: center; gap: 8px;"><i class="fas fa-paper-plane" style="margin-right: 4px;"></i>Travelo</span>');
                  }
                }} 
              />
            </Link>
          </div>

          {/* Mini Search Bar (Shows on Scroll - Only on Home Page) */}
          {scrolled && isHomePage && (
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
            {/* Theme toggle has been moved to the Hamburger dropdown */}

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
                    <li>
                      <button 
                        type="button" 
                        onClick={() => { toggleDarkMode(); setShowMenu(false); }}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 20px', background: 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-color)', fontSize: '14px' }}
                      >
                        <span>Dark Mode</span>
                        <i className={darkMode ? 'fas fa-toggle-on' : 'fas fa-toggle-off'} style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}></i>
                      </button>
                    </li>
                    
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
            
            {/* Tabs Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <button 
                type="button"
                onClick={() => { setIsLoginView(true); setAuthError(''); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isLoginView ? '2.5px solid var(--accent-color)' : '2.5px solid transparent',
                  fontWeight: 'bold',
                  color: isLoginView ? 'var(--accent-color)' : 'var(--text-muted)',
                  fontSize: '15px',
                  transition: 'all 0.3s'
                }}
              >
                Log In
              </button>
              <button 
                type="button"
                onClick={() => { setIsLoginView(false); setAuthError(''); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: !isLoginView ? '2.5px solid var(--accent-color)' : '2.5px solid transparent',
                  fontWeight: 'bold',
                  color: !isLoginView ? 'var(--accent-color)' : 'var(--text-muted)',
                  fontSize: '15px',
                  transition: 'all 0.3s'
                }}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <div style={{ color: 'white', background: 'var(--accent-color)', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!isLoginView && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block', color: 'var(--text-muted)' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '10px',
                      background: 'var(--bg-color)',
                      color: 'var(--text-color)',
                      outline: 'none',
                      fontSize: '14px',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block', color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '10px',
                    background: 'var(--bg-color)',
                    color: 'var(--text-color)',
                    outline: 'none',
                    fontSize: '14px',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block', color: 'var(--text-muted)' }}>PASSWORD</label>
                <input 
                  type="password" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '10px',
                    background: 'var(--bg-color)',
                    color: 'var(--text-color)',
                    outline: 'none',
                    fontSize: '14px',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <button type="submit" className="book-btn" style={{ marginTop: '8px', padding: '14px' }}>
                {isLoginView ? 'Sign In' : 'Create Account'}
              </button>

              <div className="signup-or-separator" style={{ margin: '8px 0' }}><span>or</span></div>

              <button 
                type="button" 
                className="signup-social-btn signup-google" 
                onClick={handleGoogleLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
              >
                <i className="fab fa-google" style={{ color: '#ea4335' }}></i> Continue with Google
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
