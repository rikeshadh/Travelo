import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && msg) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMsg('');
    }
  };

  return (
    <div style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto 60px', paddingLeft: '20px', paddingRight: '20px' }}>
      <h2>Contact Us</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Reach out with questions, concerns, or business opportunities.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        
        {/* Contact Form */}
        <div className="booking-card">
          {submitted ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#10b981' }}>
              <i className="fas fa-paper-plane" style={{ fontSize: '2rem', marginBottom: '15px' }}></i>
              <h3>Message Sent!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>We will get back to you within 24 hours.</p>
              <button className="book-btn" style={{ width: 'auto', marginTop: '15px', padding: '8px 20px' }} onClick={() => setSubmitted(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" rows="4" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type your message here..." required></textarea>
              </div>
              <button type="submit" className="book-btn">Submit Inquiry</button>
            </form>
          )}
        </div>

        {/* Office Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 10px var(--shadow-color)' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Headquarters</h4>
            <p style={{ color: 'var(--text-muted)' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: 'var(--accent-color)' }}></i>101 Travelo Plaza, Suite 400<br />San Francisco, CA 94103</p>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 10px var(--shadow-color)' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Direct Support</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '6px' }}><i className="fas fa-phone" style={{ marginRight: '8px', color: 'var(--accent-color)' }}></i>+1 (800) TRAVELO</p>
            <p style={{ color: 'var(--text-muted)' }}><i className="fas fa-envelope" style={{ marginRight: '8px', color: 'var(--accent-color)' }}></i>support@travelo.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
