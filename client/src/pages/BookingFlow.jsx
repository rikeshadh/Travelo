import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BookingFlow = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Parse booking details from URL Query Params
  const queryParams = new URLSearchParams(location.search);
  const checkInDate = queryParams.get('checkin') || '';
  const checkOutDate = queryParams.get('checkout') || '';
  const adults = Number(queryParams.get('adults')) || 1;
  const children = Number(queryParams.get('children')) || 0;

  // App States
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // Steps: 1 = Guest Details, 2 = Payment, 3 = Confirmation

  // Step 1: Form Guest Details State
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 2: Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 3: Confirmation Summary State
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Calculations
  const [numNights, setNumNights] = useState(1);
  const [basePrice, setBasePrice] = useState(0);
  const [cleaningFee, setCleaningFee] = useState(15);
  const [serviceFee, setServiceFee] = useState(25);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        const prop = res.data.property;
        setProperty(prop);

        // Calculate nights
        if (checkInDate && checkOutDate) {
          const diffTime = Math.abs(new Date(checkOutDate) - new Date(checkInDate));
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const nights = diffDays > 0 ? diffDays : 1;
          setNumNights(nights);

          const base = prop.pricePerNight * nights;
          setBasePrice(base);
          setTotalPrice(base + cleaningFee + serviceFee);
        }
      } catch (err) {
        console.error('Error loading property for checkout', err);
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id, checkInDate, checkOutDate]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!guestName || !guestEmail || !guestPhone) {
        alert('Please fill out all contact fields.');
        return;
      }
      setStep(2);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setErrorMsg('Please complete all credit card fields.');
      return;
    }

    setSubmitting(true);
    try {
      const bookingPayload = {
        propertyId: id,
        checkInDate,
        checkOutDate,
        guests: {
          adults,
          children,
          pets: location.search.includes('pets')
        },
        totalPrice,
        guestDetails: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone
        }
      };

      const res = await axios.post('/api/bookings', bookingPayload);
      setConfirmedBooking(res.data);
      setStep(3);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment simulation failed. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) return <div style={{ padding: '120px', textAlign: 'center' }}>Preparing booking details...</div>;
  if (!property) return <div style={{ padding: '120px', textAlign: 'center' }}>Accommodation details not found.</div>;

  return (
    <div className="booking-flow">
      {/* Step Indicator Header */}
      <div className="step-indicator">
        <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-circle">1</div>
          <span className="step-label">Guest Details</span>
        </div>
        <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-circle">2</div>
          <span className="step-label">Payment</span>
        </div>
        <div className={`step-node ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
          <div className="step-circle">3</div>
          <span className="step-label">Confirmation</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: step === 3 ? '1fr' : '1.8fr 1.2fr', gap: '30px' }}>
        
        {/* Step Views */}
        <div>
          {step === 1 && (
            <div className="booking-card">
              <h2 style={{ marginBottom: '20px' }}>Verify Guest Details</h2>
              <form onSubmit={handleNextStep}>
                <div className="form-group">
                  <label htmlFor="guest-full-name">Full Name</label>
                  <input
                    id="guest-full-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guest-email-address">Email Address</label>
                  <input
                    id="guest-email-address"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guest-phone-number">Phone Number</label>
                  <input
                    id="guest-phone-number"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="special-requests">Special Requests (Optional)</label>
                  <textarea
                    id="special-requests"
                    rows="3"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Late arrival, high floor, quiet room..."
                  ></textarea>
                </div>
                
                <button type="submit" className="book-btn" style={{ marginTop: '10px' }}>
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="booking-card">
              <h2 style={{ marginBottom: '10px' }}>Secure Payment</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                All transactions are safe and encrypted. We support mock card checkouts.
              </p>

              {errorMsg && (
                <div style={{ padding: '10px', background: 'var(--accent-color)', color: 'white', borderRadius: '8px', fontSize: '13px', marginBottom: '15px' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit}>
                <div className="form-group">
                  <label htmlFor="cardholders-name">Name on Card</label>
                  <input
                    id="cardholders-name"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="card-number-input">Card Number</label>
                  <input
                    id="card-number-input"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    placeholder="4111 2222 3333 4444"
                    maxLength="19"
                    required
                  />
                </div>
                
                <div className="checkout-grid">
                  <div className="form-group">
                    <label htmlFor="card-expiry-input">Expiration Date</label>
                    <input
                      id="card-expiry-input"
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="card-cvv-input">CVV</label>
                    <input
                      id="card-cvv-input"
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button type="button" onClick={() => setStep(1)} className="book-btn" style={{ flex: '1', background: 'transparent', border: '1.5px solid var(--border-color)', color: 'var(--text-color)' }}>
                    Back
                  </button>
                  <button type="submit" className="book-btn" style={{ flex: '2' }} disabled={submitting}>
                    {submitting ? 'Processing...' : `Confirm Booking & Pay $${totalPrice}`}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && confirmedBooking && (
            <div className="booking-card" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '24px' }}>
                <i className="fas fa-check"></i>
              </div>
              <h2 style={{ marginBottom: '10px' }}>Booking Confirmed!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                Thank you, {guestName}. Your stay at <strong>{property.title}</strong> is booked. A confirmation email has been sent to {guestEmail}.
              </p>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'left', maxWidth: '500px', margin: '0 auto 30px' }}>
                <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>Booking Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                  <div><strong>Reservation ID:</strong> {confirmedBooking._id}</div>
                  <div><strong>Status:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>Confirmed</span></div>
                  <div><strong>Check-In:</strong> {checkInDate}</div>
                  <div><strong>Check-Out:</strong> {checkOutDate}</div>
                  <div><strong>Guests:</strong> {adults} Adults, {children} Children</div>
                  <div><strong>Total Charged:</strong> ${totalPrice}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button type="button" onClick={() => window.print()} className="book-btn" style={{ width: 'auto', background: 'transparent', border: '1.5px solid var(--border-color)', color: 'var(--text-color)', padding: '12px 30px' }}>
                  Print Receipt
                </button>
                <button type="button" onClick={() => navigate('/dashboard')} className="book-btn" style={{ width: 'auto', padding: '12px 30px' }}>
                  Go to My Bookings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary (Only on steps 1 and 2) */}
        {step < 3 && (
          <div>
            <div className="booking-widget" style={{ position: 'sticky', top: '100px' }}>
              <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
                <img
                  src={property.imageGallery[0]}
                  alt={property.title}
                  style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>{property.title}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <i className="fas fa-star" style={{ color: '#f59e0b', marginRight: '4px' }}></i>
                    {property.ratings.average}
                  </span>
                </div>
              </div>

              <h4 style={{ marginBottom: '10px' }}>Price Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>${property.pricePerNight} x {numNights} nights</span>
                  <span>${basePrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Travelo service fee</span>
                  <span>${serviceFee}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
                <span>Total (USD)</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
