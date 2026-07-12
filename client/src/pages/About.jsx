import React from 'react';

const About = () => {
  return (
    <div style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto 60px', paddingLeft: '20px', paddingRight: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>About Travelo</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '30px' }}>
        Travelo is a premium travel booking platform designed to make finding and reserving unique stays, stylish hotels, and trending experiences easy, transparent, and beautiful.
      </p>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>Our Mission</h3>
        <p style={{ color: 'var(--text-color)', lineHeight: '1.6' }}>
          We believe travel is the ultimate catalyst for human connection, growth, and joy. Our mission is to bridge the gap between explorers and local hosts, providing verified, high-quality accommodations in breathtaking destinations across the globe—from the towering peaks of Mt. Everest to the tranquil waters of Bali.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>Why Choose Us</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '15px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px var(--shadow-color)' }}>
            <h4 style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '8px' }}>Verified Properties</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Every hotel, cabin, and villa on our platform undergoes rigorous safety and quality checks.</p>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px var(--shadow-color)' }}>
            <h4 style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '8px' }}>Transparent Pricing</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>What you see is what you pay. No hidden costs or surprise surcharges during checkouts.</p>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px var(--shadow-color)' }}>
            <h4 style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '8px' }}>24/7 Support</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Chat directly with our ticketing support specialists anytime, anywhere using our live portal.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
