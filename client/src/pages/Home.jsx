import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [destination, setDestination] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  
  // Guest Selector State
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(false);

  // Data State
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel State
  const trendingDestinations = [
    { name: 'Machu Picchu', text: 'Discover nature and ancient ruins above the clouds.', img: '/images/Machu Picchu.webp' },
    { name: 'Mount Everest', text: 'Touch the sky in the heart of the Himalayas.', img: '/images/Mount Everest.webp' },
    { name: 'Great Barrier Reef', text: 'Dive into vibrant coral reefs and marine magic.', img: '/images/Great Barrier Reef.webp' },
    { name: 'Amazon', text: 'Immerse yourself in the lungs of our planet.', img: '/images/Amazon.webp' },
    { name: 'Sahara', text: 'Endless dunes and ancient Berber tales await.', img: '/images/Sahara.webp' },
    { name: 'Petra', text: 'Step into the rose-red city half as old as time.', img: '/images/Petra.webp' }
  ];

  const [carouselIndex, setCarouselIndex] = useState(2); // Start centered

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/properties?limit=3');
        setFeaturedProperties(res.data.properties);
      } catch (err) {
        console.error('Error fetching properties', err);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const guestQuery = `${adults} adults · ${children} children` + (pets ? ' · pets' : '');
    navigate(`/search?search=${destination}&checkin=${checkin}&checkout=${checkout}&guests=${encodeURIComponent(guestQuery)}`);
  };

  const handleNatureClick = (category) => {
    navigate(`/search?type=${category}`);
  };

  // Carousel Logic
  const handleCarouselPrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? trendingDestinations.length - 1 : prev - 1));
  };

  const handleCarouselNext = () => {
    setCarouselIndex((prev) => (prev === trendingDestinations.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <section id="hero">
        <h1>Unlock Your Ultimate Stay</h1>
        <p>Dive into deals on stylish hotels, comfortable homes, and beyond.</p>

        {/* Search Bar */}
        <div className="searchBar-container">
          <form onSubmit={handleSearchSubmit} className="searchBar-box">
            
            {/* Destination */}
            <div className="searchBar-field">
              <i className="fas fa-map-marker-alt"></i>
              <div className="field-content">
                <label htmlFor="destination-input">Where</label>
                <input
                  id="destination-input"
                  type="text"
                  placeholder="Search destinations"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            {/* Checkin Date */}
            <div className="searchBar-field">
              <i className="fas fa-calendar-alt"></i>
              <div className="field-content">
                <label htmlFor="checkin-input">Check in</label>
                <input
                  id="checkin-input"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                />
              </div>
            </div>

            {/* Checkout Date */}
            <div className="searchBar-field">
              <i className="fas fa-calendar-alt"></i>
              <div className="field-content">
                <label htmlFor="checkout-input">Check out</label>
                <input
                  id="checkout-input"
                  type="date"
                  min={checkin || new Date().toISOString().split('T')[0]}
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                />
              </div>
            </div>

            {/* Guests Selector */}
            <div className="searchBar-field relative" onClick={() => setShowGuestDropdown(!showGuestDropdown)} style={{ cursor: 'pointer' }}>
              <i className="fas fa-user-friends"></i>
              <div className="field-content">
                <label>Guests</label>
                <div style={{ fontSize: '14px', marginTop: '3px', color: 'var(--text-color)' }}>
                  {`${adults} adults, ${children} children` + (pets ? ', pets' : '')}
                </div>
              </div>

              {/* Guest Dropdown */}
              {showGuestDropdown && (
                <div className="guest-dropdown" onClick={(e) => e.stopPropagation()}>
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

                  <div className="pets-row">
                    <label className="pets-label" htmlFor="pets-checkbox">
                      <input
                        id="pets-checkbox"
                        type="checkbox"
                        checked={pets}
                        onChange={(e) => setPets(e.target.checked)}
                      />
                      Bringing pets
                    </label>
                    <button
                      type="button"
                      className="clear-all-btn"
                      onClick={() => { setAdults(2); setChildren(0); setPets(false); }}
                    >
                      Clear
                    </button>
                  </div>

                  <button
                    type="button"
                    className="done-btn"
                    onClick={() => setShowGuestDropdown(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Search Submit Button */}
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </section>

      {/* ===== Discover Nature Section ===== */}
      <section className="nature-section">
        <div className="section-header">
          <h2>Discover Nature</h2>
          <p>Explore breathtaking landscapes, from towering mountains to tranquil beaches, dense forests, and timeless heritage sites.</p>
        </div>

        <div className="card-grid">
          <div className="destination-card" onClick={() => handleNatureClick('cabin')}>
            <div className="blur-overlay"></div>
            <img src="/images/mountain.webp" alt="Mountains" />
            <div className="destination-content">
              <h3>Mountains</h3>
              <p>Discover the majestic Himalayas, home to Mt. Everest and peaceful trekking routes.</p>
            </div>
          </div>

          <div className="destination-card" onClick={() => handleNatureClick('villa')}>
            <div className="blur-overlay"></div>
            <img src="/images/beach.webp" alt="Beaches" />
            <div className="destination-content">
              <h3>Beaches</h3>
              <p>Relax on pristine sandy shores, feel the ocean breeze, and enjoy crystal-clear waters.</p>
            </div>
          </div>

          <div className="destination-card" onClick={() => handleNatureClick('cabin')}>
            <div className="blur-overlay"></div>
            <img src="/images/forrest.webp" alt="Forests" />
            <div className="destination-content">
              <h3>Forests</h3>
              <p>Wander through lush greenery, spot wildlife, and breathe in the scent of ancient woods.</p>
            </div>
          </div>

          <div className="destination-card" onClick={() => handleNatureClick('apartment')}>
            <div className="blur-overlay"></div>
            <img src="/images/lake.webp" alt="Lakes" />
            <div className="destination-content">
              <h3>Lakes</h3>
              <p>Visit serene lakes like Phewa and Rara, surrounded by mountains and forests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trending Destinations Carousel ===== */}
      <section className="nature-carousel-section">
        <div className="section-header">
          <h3>Trending Destinations</h3>
        </div>

        <div className="carousel-wrapper">
          <button type="button" className="carousel-arrow left" onClick={handleCarouselPrev}>&#8249;</button>

          <div className="card-carousel">
            {trendingDestinations.map((d, index) => {
              const isFocused = index === carouselIndex;
              return (
                <div
                  key={d.name}
                  className={`trending-card ${isFocused ? 'focused' : ''}`}
                  onClick={() => setCarouselIndex(index)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <img src={d.img} alt={d.name} />
                  <div className="blur-overlay" style={{ opacity: isFocused ? 0 : 0.4 }}></div>
                  <div className="destination-content">
                    <h3>{d.name}</h3>
                    <p style={{ opacity: 1, maxHeight: '80px' }}>{d.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" className="carousel-arrow right" onClick={handleCarouselNext}>&#8250;</button>
        </div>
      </section>

      {/* ===== Featured Properties Section ===== */}
      <section className="nature-section" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <h2>Featured Properties</h2>
          <p>Handpicked accommodations for an unforgettable luxury getaway.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading accommodations...</div>
        ) : (
          <div className="card-grid">
            {featuredProperties.map((p) => (
              <div
                key={p._id}
                className="property-card"
                onClick={() => navigate(`/property/${p._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="property-image">
                  <img src={p.imageGallery[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'} alt={p.title} />
                </div>
                <div className="property-info">
                  <div className="property-header">
                    <h3 className="property-title">{p.title}</h3>
                    <div className="property-rating">
                      <i className="fas fa-star"></i> {p.ratings.average}
                    </div>
                  </div>
                  <p className="property-loc">{p.location.city}, {p.location.country}</p>
                  <p className="property-price">${p.pricePerNight} <span>/ night</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Testimonials ===== */}
      <section className="nature-section">
        <div className="section-header">
          <h2>What Our Travelers Say</h2>
          <p>Real experiences from people who explored the world with Travelo.</p>
        </div>
        <div className="card-grid">
          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px var(--shadow-color)' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              "The Peak Lodge in Nepal was incredible. The mountain views were exactly as advertised, and booking was effortless."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&h=60&q=80" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>David K.</h4>
                <span style={{ fontSize: '12px', color: '#888' }}>London, UK</span>
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px var(--shadow-color)' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              "My family booked an overwater villa in Bali. Travelo's customer support answered all our questions in minutes!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&h=60&q=80" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>Samantha L.</h4>
                <span style={{ fontSize: '12px', color: '#888' }}>New York, USA</span>
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px var(--shadow-color)' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              "The search filters made it simple to find a pet-friendly forest cabin with a hot tub. Will use again for my next trip."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=60&h=60&q=80" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>Elena R.</h4>
                <span style={{ fontSize: '12px', color: '#888' }}>Madrid, Spain</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
