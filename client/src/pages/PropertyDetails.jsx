import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Widget Form State
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // New Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/properties/${id}`);
      setProperty(res.data.property);
      setReviews(res.data.reviews);
      setSimilarProperties(res.data.similar);
    } catch (err) {
      console.error('Error fetching property details', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPropertyData();
  }, [id]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in or create an account to book this property.');
      return;
    }
    if (!checkin || !checkout) {
      alert('Please select check-in and check-out dates.');
      return;
    }

    // Verify dates availability
    const requestedRange = [];
    const start = new Date(checkin);
    const end = new Date(checkout);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      requestedRange.push(d.toISOString().split('T')[0]);
    }

    const isOverlap = requestedRange.some((date) => property.availability.includes(date));
    if (isOverlap) {
      alert('One or more of the selected dates are already booked. Please choose other dates.');
      return;
    }

    // Redirect to booking flow
    navigate(`/book/${property._id}?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    if (!comment.trim()) {
      setReviewError('Please write a review comment.');
      return;
    }

    try {
      const res = await axios.post(`/api/properties/${id}/reviews`, { rating, comment });
      setReviews([res.data.review, ...reviews]);
      setProperty((prev) => ({ ...prev, ratings: res.data.ratings }));
      setComment('');
      setRating(5);
      setReviewSuccess('Your review has been posted successfully!');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not post review. Try again.');
    }
  };

  if (loading) return <div style={{ padding: '120px', textAlign: 'center' }}>Loading property details...</div>;
  if (!property) return <div style={{ padding: '120px', textAlign: 'center' }}>Property not found.</div>;

  return (
    <div className="details-page">
      {/* Title & Ratings Header */}
      <div className="details-header">
        <h1>{property.title}</h1>
        <div className="details-meta">
          <span>
            <i className="fas fa-star" style={{ color: '#f59e0b', marginRight: '4px' }}></i>
            {property.ratings.average} ({property.ratings.count} reviews)
          </span>
          <span>&bull;</span>
          <span><i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i>{property.location.address}, {property.location.city}, {property.location.country}</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="details-gallery">
        <div className="gallery-main">
          <img src={property.imageGallery[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'} alt="Main Accommodation" />
        </div>
        <div className="gallery-sub">
          <img src={property.imageGallery[1] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'} alt="Secondary Room" />
          <img src={property.imageGallery[2] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'} alt="Scenic Surroundings" />
        </div>
      </div>

      {/* Details Grid (Content vs Booking Widget) */}
      <div className="details-grid">
        <div className="details-info">
          
          {/* Host Info */}
          <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>Hosted by {property.host.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{property.host.bio || 'Local travel accommodation partner.'}</p>
            </div>
            <img
              src={property.host.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
              alt={property.host.name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
            />
          </section>

          {/* Description */}
          <section>
            <h3>About this stay</h3>
            <p style={{ color: 'var(--text-color)', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </section>

          {/* Amenities */}
          <section>
            <h3>What this place offers</h3>
            <div className="amenities-list">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="amenity-item">
                  <i className="fas fa-check-circle" style={{ color: 'var(--accent-color)' }}></i>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* User Reviews */}
          <section>
            <h3>Reviews ({reviews.length})</h3>
            <div style={{ marginTop: '20px' }}>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No reviews yet. Be the first to review this place!</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="review-item">
                    <div className="review-user">
                      <img src={r.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&h=50&q=80'} alt={r.userName} />
                      <div>
                        <div className="review-user-name">{r.userName}</div>
                        <div className="review-date">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="review-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className={i < r.rating ? 'fas fa-star' : 'far fa-star'}></i>
                      ))}
                    </div>
                    <p className="review-comment">{r.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Block */}
            {user ? (
              <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', marginTop: '30px' }}>
                <h4 style={{ marginBottom: '10px' }}>Write a Review</h4>
                {reviewError && <p style={{ color: 'var(--accent-color)', fontSize: '13px', marginBottom: '8px' }}>{reviewError}</p>}
                {reviewSuccess && <p style={{ color: '#10b981', fontSize: '13px', marginBottom: '8px' }}>{reviewSuccess}</p>}
                
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label>Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-color)',
                        fontSize: '14px'
                      }}
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Poor)</option>
                      <option value="1">1 Star (Terrible)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea
                      rows="3"
                      placeholder="Write your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="book-btn" style={{ width: 'auto', padding: '10px 24px', fontSize: '14px' }}>
                    Submit Review
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-color)', borderRadius: '8px', textAlign: 'center', fontSize: '14px' }}>
                Please log in to leave a review.
              </div>
            )}
          </section>
        </div>

        {/* Booking Sidebar Widget */}
        <div>
          <div className="booking-widget">
            <div className="widget-price">
              ${property.pricePerNight} <span>/ night</span>
            </div>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="widget-dates">
                <div className="widget-date-row">
                  <div className="widget-date-col">
                    <label htmlFor="check-in-date">Check In</label>
                    <input
                      id="check-in-date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={checkin}
                      onChange={(e) => setCheckin(e.target.value)}
                      required
                    />
                  </div>
                  <div className="widget-date-col">
                    <label htmlFor="check-out-date">Check Out</label>
                    <input
                      id="check-out-date"
                      type="date"
                      min={checkin || new Date().toISOString().split('T')[0]}
                      value={checkout}
                      onChange={(e) => setCheckout(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Guests Dropdown */}
              <div className="widget-guests" onClick={() => setShowGuestDropdown(!showGuestDropdown)}>
                <label>Guests</label>
                <div className="widget-guests-val">
                  {adults} adults{children > 0 && `, ${children} children`}
                </div>

                {showGuestDropdown && (
                  <div className="guest-dropdown" onClick={(e) => e.stopPropagation()} style={{ width: '100%', top: '105%' }}>
                    <div className="guest-row">
                      <span>Adults</span>
                      <div className="guest-counter">
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}>&ndash;</button>
                        <span>{adults}</span>
                        <button type="button" onClick={() => setAdults(adults + 1)}>+</button>
                      </div>
                    </div>
                    <div className="guest-row">
                      <span>Children</span>
                      <div className="guest-counter">
                        <button type="button" onClick={() => setChildren(Math.max(0, children - 1))}>&ndash;</button>
                        <span>{children}</span>
                        <button type="button" onClick={() => setChildren(children + 1)}>+</button>
                      </div>
                    </div>
                    <button type="button" className="done-btn" onClick={() => setShowGuestDropdown(false)}>
                      Done
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" className="book-btn">
                Reserve Stay
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section style={{ marginTop: '50px', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <h3 style={{ marginBottom: '20px' }}>Similar Accommodations</h3>
          <div className="card-grid">
            {similarProperties.map((s) => (
              <div
                key={s._id}
                className="property-card"
                onClick={() => { navigate(`/property/${s._id}`); window.scrollTo(0, 0); }}
                style={{ cursor: 'pointer' }}
              >
                <div className="property-image">
                  <img src={s.imageGallery[0]} alt={s.title} />
                </div>
                <div className="property-info">
                  <div className="property-header">
                    <h4 className="property-title">{s.title}</h4>
                    <span className="property-rating"><i className="fas fa-star"></i> {s.ratings.average}</span>
                  </div>
                  <p className="property-loc">{s.location.city}, {s.location.country}</p>
                  <p className="property-price">${s.pricePerNight} <span>/ night</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetails;
