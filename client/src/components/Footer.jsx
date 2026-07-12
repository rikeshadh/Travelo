import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/faq">Help Center</Link></li>
            <li><Link to="/support">AirCover</Link></li>
            <li><Link to="/faq">Anti-discrimination</Link></li>
            <li><Link to="/faq">Disability support</Link></li>
            <li><Link to="/faq">Cancellation options</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Hosting</h4>
          <ul>
            <li><a href="#host">Travelo your home</a></li>
            <li><a href="#host">Cover for Hosts</a></li>
            <li><a href="#host">Hosting resources</a></li>
            <li><a href="#host">Community forum</a></li>
            <li><a href="#host">Hosting responsibly</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Travelo</h4>
          <ul>
            <li><Link to="/about">Newsroom</Link></li>
            <li><Link to="/about">New features</Link></li>
            <li><Link to="/about">Careers</Link></li>
            <li><Link to="/about">Investors</Link></li>
            <li><Link to="/about">Gift cards</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Stay Connected</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px' }}>
            Subscribe to our newsletter to receive the latest updates, special deals, and travel inspiration.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="email" 
              placeholder="Your email" 
              style={{
                flex: '1',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                background: 'var(--bg-color)',
                color: 'var(--text-color)'
              }}
            />
            <button style={{
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '13px'
            }}>
              Join
            </button>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            <a href="#fb"><i className="fab fa-facebook"></i></a>
            <a href="#tw"><i className="fab fa-twitter"></i></a>
            <a href="#ig"><i className="fab fa-instagram"></i></a>
            <a href="#yt"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Travelo, Inc. All rights reserved. &bull; <Link to="/faq">Privacy</Link> &bull; <Link to="/faq">Terms</Link> &bull; <Link to="/faq">Sitemap</Link></p>
      </div>
    </footer>
  );
};

export default Footer;
