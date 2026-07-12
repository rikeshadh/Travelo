import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // Tabs: analytics, properties, bookings, users

  // Analytics Data
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalProperties: 0, totalBookings: 0, totalRevenue: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [propertyTypeData, setPropertyTypeData] = useState([]);

  // Data lists
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Form states for Property Add/Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('hotel');
  const [pricePerNight, setPricePerNight] = useState(100);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Nepal');
  const [imageGallery, setImageGallery] = useState('');
  const [amenities, setAmenities] = useState('');

  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/api/admin/analytics');
      setMetrics(res.data.metrics);
      setRevenueData(res.data.bookingsByMonth);
      setPropertyTypeData(res.data.propertyTypes);
    } catch (err) {
      console.error('Error fetching admin stats', err);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get('/api/properties?limit=50');
      setProperties(res.data.properties);
    } catch (err) {
      console.error('Error fetching admin properties', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching admin bookings', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching admin users', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      await fetchAnalytics();
      if (activeTab === 'properties') await fetchProperties();
      if (activeTab === 'bookings') await fetchBookings();
      if (activeTab === 'users') await fetchUsers();
      setLoading(false);
    };
    loadData();
  }, [activeTab]);

  // CRUD Properties
  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      propertyType,
      pricePerNight: Number(pricePerNight),
      location: { address, city, country, lat: 27.7, lng: 85.3 }, // Simulated coordinates
      imageGallery: imageGallery.split(',').map((img) => img.trim()).filter((img) => img),
      amenities: amenities.split(',').map((a) => a.trim()).filter((a) => a),
      host: { name: 'Travelo Admin', avatar: '', bio: 'Verified Administrator', email: 'admin@travelo.com' }
    };

    try {
      if (isEditing) {
        await axios.put(`/api/admin/properties/${editId}`, payload);
        alert('Property updated successfully.');
      } else {
        await axios.post('/api/admin/properties', payload);
        alert('Property added successfully.');
      }
      setShowPropertyForm(false);
      resetPropertyForm();
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || 'Property action failed.');
    }
  };

  const startEditProperty = (p) => {
    setIsEditing(true);
    setEditId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setPropertyType(p.propertyType);
    setPricePerNight(p.pricePerNight);
    setAddress(p.location.address);
    setCity(p.location.city);
    setCountry(p.location.country);
    setImageGallery(p.imageGallery.join(', '));
    setAmenities(p.amenities.join(', '));
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Delete this property listing?')) return;
    try {
      await axios.delete(`/api/admin/properties/${id}`);
      fetchProperties();
      alert('Listing deleted successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const resetPropertyForm = () => {
    setIsEditing(false);
    setEditId('');
    setTitle('');
    setDescription('');
    setPropertyType('hotel');
    setPricePerNight(100);
    setAddress('');
    setCity('');
    setCountry('Nepal');
    setImageGallery('');
    setAmenities('');
  };

  // User Actions
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert('Error updating role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this customer booking reservation?')) return;
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      fetchBookings();
      alert('Reservation cancelled.');
    } catch (err) {
      alert('Failed to cancel reservation.');
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="dashboard-layout">
      {/* Side Navigation */}
      <div className="dashboard-nav">
        <h4 style={{ color: 'var(--text-color)', padding: '0 10px', marginBottom: '25px', fontWeight: 'bold' }}>Admin Center</h4>
        
        <button className={`dashboard-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <i className="fas fa-chart-pie"></i> Analytics
        </button>

        <button className={`dashboard-nav-item ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
          <i className="fas fa-hotel"></i> Properties
        </button>

        <button className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
          <i className="fas fa-receipt"></i> Bookings
        </button>

        <button className={`dashboard-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <i className="fas fa-users"></i> Users
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="dashboard-main">
        {activeTab === 'analytics' && (
          <div>
            <h2>Console Overview</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Global site analytics and sales metrics.</p>

            {/* Metrics cards grid */}
            <div className="stats-grid">
              <div className="stats-card">
                <div className="stats-icon blue"><i className="fas fa-users"></i></div>
                <div className="stats-info">
                  <h4>Total Users</h4>
                  <p>{metrics.totalUsers}</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon green"><i className="fas fa-hotel"></i></div>
                <div className="stats-info">
                  <h4>Properties</h4>
                  <p>{metrics.totalProperties}</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon yellow"><i className="fas fa-receipt"></i></div>
                <div className="stats-info">
                  <h4>Bookings</h4>
                  <p>{metrics.totalBookings}</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon purple"><i className="fas fa-dollar-sign"></i></div>
                <div className="stats-info">
                  <h4>Revenue</h4>
                  <p>${metrics.totalRevenue}</p>
                </div>
              </div>
            </div>

            {/* Charts block */}
            <div className="charts-grid">
              <div className="chart-card">
                <h4 style={{ marginBottom: '15px' }}>Monthly Sales (USD)</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="var(--accent-color)" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h4 style={{ marginBottom: '15px' }}>Listing Types</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={propertyTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Manage Accommodations</h2>
                <p style={{ color: 'var(--text-muted)' }}>Add, edit, or remove travel property listings.</p>
              </div>
              <button
                className="book-btn"
                style={{ width: 'auto', padding: '10px 20px' }}
                onClick={() => { resetPropertyForm(); setShowPropertyForm(!showPropertyForm); }}
              >
                {showPropertyForm ? 'Cancel Form' : 'Add Property'}
              </button>
            </div>

            {showPropertyForm && (
              <div className="booking-card" style={{ marginBottom: '30px' }}>
                <h3>{isEditing ? 'Edit Accommodation Details' : 'Register New Accommodation'}</h3>
                <form onSubmit={handlePropertySubmit} style={{ marginTop: '15px' }}>
                  <div className="form-group">
                    <label htmlFor="prop-title">Title</label>
                    <input id="prop-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prop-desc">Description</label>
                    <textarea id="prop-desc" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                  </div>
                  <div className="checkout-grid">
                    <div className="form-group">
                      <label htmlFor="prop-type">Property Type</label>
                      <select id="prop-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-color)', width: '100%' }}>
                        <option value="hotel">Hotel</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="cabin">Cabin</option>
                        <option value="resort">Resort</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="prop-price">Price per Night ($)</label>
                      <input id="prop-price" type="number" value={pricePerNight} onChange={(e) => setPricePerNight(Number(e.target.value))} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label htmlFor="prop-address">Street Address</label>
                      <input id="prop-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prop-city">City</label>
                      <input id="prop-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prop-country">Country</label>
                      <input id="prop-country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="prop-images">Image Gallery Links (comma separated web URLs)</label>
                    <input id="prop-images" type="text" value={imageGallery} onChange={(e) => setImageGallery(e.target.value)} placeholder="https://unsplash.com/photo1.jpg, https://unsplash.com/photo2.jpg" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prop-amenities">Amenities (comma separated)</label>
                    <input id="prop-amenities" type="text" value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="Wifi, Pool, Air Conditioning, Breakfast" required />
                  </div>

                  <button type="submit" className="book-btn">
                    {isEditing ? 'Save Changes' : 'Publish Listing'}
                  </button>
                </form>
              </div>
            )}

            {/* Properties Table */}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p._id}>
                      <td><strong>{p.title}</strong></td>
                      <td style={{ textTransform: 'capitalize' }}>{p.propertyType}</td>
                      <td>${p.pricePerNight}</td>
                      <td>{p.location.city}, {p.location.country}</td>
                      <td>
                        <button onClick={() => startEditProperty(p)} style={{ border: 'none', background: 'transparent', color: '#3b82f6', marginRight: '10px' }}><i className="fas fa-edit"></i> Edit</button>
                        <button onClick={() => handleDeleteProperty(p._id)} style={{ border: 'none', background: 'transparent', color: 'var(--accent-color)' }}><i className="fas fa-trash"></i> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2>Manage Reservations</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Review and manage customer reservations.</p>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Guest</th>
                    <th>Dates</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td><strong>{b.propertyId?.title || 'Accommodation'}</strong></td>
                      <td>{b.guestDetails?.name || 'Guest'}<br /><span style={{ fontSize: '11px', color: '#888' }}>{b.guestDetails?.email}</span></td>
                      <td>{b.checkInDate} to {b.checkOutDate}</td>
                      <td>${b.totalPrice}</td>
                      <td>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', color: b.bookingStatus === 'confirmed' ? '#10b981' : '#ef4444', background: b.bookingStatus === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td>
                        {b.bookingStatus === 'confirmed' && (
                          <button onClick={() => handleCancelBooking(b._id)} style={{ border: 'none', background: 'transparent', color: 'var(--accent-color)', fontWeight: 'bold' }}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2>Manage Users</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>View system accounts, change user roles, or delete users.</p>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td style={{ textTransform: 'capitalize' }}><strong>{u.role}</strong></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleToggleRole(u._id, u.role)} style={{ border: 'none', background: 'transparent', color: '#3b82f6', marginRight: '10px' }}><i className="fas fa-user-shield"></i> Toggle Role</button>
                        <button onClick={() => handleDeleteUser(u._id)} style={{ border: 'none', background: 'transparent', color: 'var(--accent-color)' }}><i className="fas fa-trash"></i> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
