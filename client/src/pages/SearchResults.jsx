import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet CDN icon fix to prevent import issues
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const SearchResults = () => {
  const { user, toggleWishlist } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query string parameters
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialType = queryParams.get('type') || 'all';

  // Filters State
  const [search, setSearch] = useState(initialSearch);
  const [propertyType, setPropertyType] = useState(initialType);
  const [priceMax, setPriceMax] = useState(500);
  const [rating, setRating] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sort, setSort] = useState('newest');
  
  // Results State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Layout View States
  const [isListView, setIsListView] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const amenitiesOptions = ['Wifi', 'Pool', 'Air Conditioning', 'Kitchen', 'Heating', 'Hot Tub', 'Breakfast'];

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        propertyType,
        priceMax,
        page,
        sort,
        limit: isListView ? 5 : 6
      };
      if (rating) params.rating = rating;
      if (selectedAmenities.length > 0) {
        params.amenities = selectedAmenities.join(',');
      }

      const res = await axios.get('/api/properties', { params });
      setProperties(res.data.properties);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error searching properties', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [location.search, page, sort, propertyType, priceMax, rating, selectedAmenities, isListView]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleWishlistToggle = async (e, id) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to add items to your wishlist.');
      return;
    }
    await toggleWishlist(id);
  };

  return (
    <div className="search-page">
      {/* Top Search Controls Header */}
      <div className="search-controls">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Change destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
              width: '220px'
            }}
          />
          <button
            onClick={fetchResults}
            style={{
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}
          >
            Update
          </button>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
              fontSize: '13px'
            }}
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Grid/List Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
            <button
              onClick={() => setIsListView(false)}
              style={{
                padding: '8px 12px',
                border: 'none',
                background: !isListView ? 'var(--accent-color)' : 'var(--card-bg)',
                color: !isListView ? 'white' : 'var(--text-color)'
              }}
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              onClick={() => setIsListView(true)}
              style={{
                padding: '8px 12px',
                border: 'none',
                background: isListView ? 'var(--accent-color)' : 'var(--card-bg)',
                color: isListView ? 'white' : 'var(--text-color)'
              }}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>

          {/* Map Toggle */}
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: showMap ? 'var(--accent-color)' : 'var(--card-bg)',
              color: showMap ? 'white' : 'var(--text-color)',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            <i className="fas fa-map"></i> Map
          </button>
        </div>
      </div>

      {/* Main Search Layout */}
      <div className="search-layout">
        {/* Sidebar Filters */}
        <div className="search-sidebar">
          <div className="filter-group">
            <h4>Property Type</h4>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-color)'
              }}
            >
              <option value="all">All Properties</option>
              <option value="hotel">Hotel</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
              <option value="resort">Resort</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Max Price: ${priceMax} / night</h4>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          <div className="filter-group">
            <h4>Minimum Rating</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[3, 4, 4.5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setRating(rating === stars.toString() ? '' : stars.toString())}
                  style={{
                    flex: '1',
                    padding: '6px 0',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: rating === stars.toString() ? 'var(--accent-color)' : 'var(--bg-color)',
                    color: rating === stars.toString() ? 'white' : 'var(--text-color)',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                >
                  {stars}+ <i className="fas fa-star" style={{ color: rating === stars.toString() ? 'white' : '#f59e0b', fontSize: '10px' }}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Amenities</h4>
            {amenitiesOptions.map((amenity) => (
              <label key={amenity} className="checkbox-label" htmlFor={`amenity-${amenity}`}>
                <input
                  id={`amenity-${amenity}`}
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Search Results List */}
        <div className="search-content">
          <div style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
            Found {total} properties
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Searching accommodations...</div>
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <h3>No properties match your filters.</h3>
              <p>Try broadening your destination search or removing filters.</p>
            </div>
          ) : (
            <div className={isListView ? '' : 'property-grid'}>
              {properties.map((p) => {
                const isFav = user?.wishlist?.some((w) => (w._id || w) === p._id);
                return (
                  <div
                    key={p._id}
                    className="property-card"
                    onClick={() => navigate(`/property/${p._id}`)}
                    style={{
                      cursor: 'pointer',
                      display: isListView ? 'flex' : 'block',
                      marginBottom: isListView ? '20px' : '0',
                      gap: isListView ? '20px' : '0'
                    }}
                  >
                    <div className="property-image" style={{ width: isListView ? '240px' : '100%', flexShrink: 0 }}>
                      <img src={p.imageGallery[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'} alt={p.title} />
                      <button
                        type="button"
                        className={`fav-btn ${isFav ? 'active' : ''}`}
                        onClick={(e) => handleWishlistToggle(e, p._id)}
                      >
                        <i className="fas fa-heart"></i>
                      </button>
                    </div>

                    <div className="property-info" style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div className="property-header">
                          <h3 className="property-title">{p.title}</h3>
                          <div className="property-rating">
                            <i className="fas fa-star"></i> {p.ratings.average}
                          </div>
                        </div>
                        <p className="property-loc">{p.location.city}, {p.location.country}</p>
                        {isListView && (
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                            {p.description.substring(0, 120)}...
                          </p>
                        )}
                        {isListView && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                            {p.amenities.slice(0, 4).map((a) => (
                              <span key={a} style={{ background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="property-price" style={{ marginTop: '15px' }}>
                        ${p.pricePerNight} <span>/ night</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  opacity: page === 1 ? 0.5 : 1
                }}
              >
                Prev
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: page === pNum ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: page === pNum ? 'white' : 'var(--text-color)',
                    fontWeight: 'bold'
                  }}
                >
                  {pNum}
                </button>
              ))}
              <button
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  opacity: page === pages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Map View sidebar */}
        {showMap && properties.length > 0 && (
          <div className="map-container">
            <MapContainer
              center={[properties[0].location.lat, properties[0].location.lng]}
              zoom={5}
              style={{ width: '100%', height: '100%', zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {properties.map((p) => (
                <Marker key={p._id} position={[p.location.lat, p.location.lng]} icon={markerIcon}>
                  <Popup>
                    <div style={{ width: '150px' }}>
                      <img src={p.imageGallery[0]} alt={p.title} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                      <h4 style={{ fontSize: '13px', margin: '6px 0 2px 0' }}>{p.title}</h4>
                      <p style={{ fontSize: '11px', margin: 0, color: 'var(--text-muted)' }}>{p.location.city}</p>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '4px 0 0 0' }}>${p.pricePerNight} / night</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
