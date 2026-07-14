import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, setUser, token, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('bookings'); // Tab options: bookings, wishlist, settings

  // State lists
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Profile Settings form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'bookings') {
      const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
          const res = await axios.get('/api/bookings/user');
          setBookings(res.data);
        } catch (err) {
          console.error('Error fetching bookings', err);
        }
        setLoadingBookings(false);
      };
      fetchBookings();
    }
  }, [activeTab]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action is permanent.')) return;
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      
      // Update local state list
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b))
      );
      alert('Booking cancelled successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);

    try {
      const payload = { name, email, avatar };
      if (password) payload.password = password;

      const res = await axios.put('/api/auth/profile', payload);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Could not update profile.' });
    }
    setProfileLoading(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Side Navigation */}
      <div className="dashboard-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', padding: '0 10px' }}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile Avatar"
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>{user?.name}</h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.role}</span>
          </div>
        </div>

        <button
          className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <i className="fas fa-suitcase"></i> My Bookings
        </button>

        <button
          className={`dashboard-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          <i className="fas fa-heart"></i> Wishlist
        </button>

        <button
          className={`dashboard-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="fas fa-cog"></i> Settings
        </button>

        <div className="dropdown-divider" style={{ margin: '20px 0' }}></div>
        <button
          className="dashboard-nav-item"
          onClick={() => { logout(); navigate('/'); }}
          style={{ color: 'var(--accent-color)' }}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="dashboard-main">
        {activeTab === 'bookings' && (
          <div>
            <h2>My Bookings</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Manage your upcoming and past reservations.</p>

            {loadingBookings ? (
              <div>Loading reservations...</div>
            ) : bookings.length === 0 ? (
              <div style={{ padding: '40px', background: 'var(--card-bg)', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <h3>No bookings found</h3>
                <p style={{ color: 'var(--text-muted)' }}>You haven't booked any accommodations yet. Explore our destinations!</p>
                <button className="book-btn" style={{ width: 'auto', marginTop: '15px', padding: '10px 24px' }} onClick={() => navigate('/')}>
                  Find Stays
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      gap: '20px',
                      boxShadow: '0 4px 15px var(--shadow-color)'
                    }}
                  >
                    <img
                      src={b.propertyId?.imageGallery[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'}
                      alt={b.propertyId?.title}
                      style={{ width: '150px', height: '110px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{b.propertyId?.title || 'Accommodation'}</h3>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              color: b.bookingStatus === 'confirmed' ? '#10b981' : '#ef4444',
                              background: b.bookingStatus === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                            }}
                          >
                            {b.bookingStatus}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {b.propertyId?.location?.city}, {b.propertyId?.location?.country}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px', fontSize: '13px' }}>
                          <div><strong>Check-In:</strong> {b.checkInDate}</div>
                          <div><strong>Check-Out:</strong> {b.checkOutDate}</div>
                          <div><strong>Guests:</strong> {b.guests?.adults} Adults, {b.guests?.children} Children</div>
                          <div><strong>Price Charged:</strong> ${b.totalPrice}</div>
                        </div>
                      </div>
                      
                      {b.bookingStatus === 'confirmed' && (
                        <button
                          className="clear-all-btn"
                          onClick={() => handleCancelBooking(b._id)}
                          style={{ alignSelf: 'flex-end', padding: '6px 14px' }}
                        >
                          Cancel Stay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div>
            <h2>My Wishlist</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Your favorite properties saved for future travel plans.</p>

            {!user?.wishlist || user.wishlist.length === 0 ? (
              <div style={{ padding: '40px', background: 'var(--card-bg)', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <h3>Wishlist is empty</h3>
                <p style={{ color: 'var(--text-muted)' }}>Click the heart icon on accommodation listings to save them here.</p>
              </div>
            ) : (
              <div className="property-grid">
                {user.wishlist.map((p) => (
                  <div
                    key={p._id}
                    className="property-card"
                    onClick={() => navigate(`/property/${p._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="property-image">
                      <img src={p.imageGallery?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'} alt={p.title} />
                      <button
                        className="fav-btn active"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const updatedWish = user.wishlist.filter((w) => w._id !== p._id);
                          setUser({ ...user, wishlist: updatedWish });
                          await axios.post('/api/auth/wishlist', { propertyId: p._id });
                        }}
                      >
                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                    <div className="property-info">
                      <div className="property-header">
                        <h3 className="property-title">{p.title}</h3>
                        <span className="property-rating"><i className="fas fa-star"></i> {p.ratings?.average}</span>
                      </div>
                      <p className="property-loc">{p.location?.city}, {p.location?.country}</p>
                      <p className="property-price">${p.pricePerNight} <span>/ night</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ maxWidth: '600px' }}>
            <h2>Profile Settings</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Update your personal profile details and security.</p>

            {profileMsg.text && (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '15px',
                  color: 'white',
                  background: profileMsg.type === 'success' ? '#10b981' : 'var(--accent-color)'
                }}
              >
                {profileMsg.text}
              </div>
            )}

            <div className="booking-card">
              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label htmlFor="user-profile-name">Full Name</label>
                  <input
                    id="user-profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-profile-email">Email Address</label>
                  <input
                    id="user-profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-avatar-url">Avatar Photo URL</label>
                  <input
                    id="user-avatar-url"
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-new-password">New Password (leave blank to keep current)</label>
                  <input
                    id="user-new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Change password"
                  />
                </div>
                <button type="submit" className="book-btn" disabled={profileLoading}>
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
