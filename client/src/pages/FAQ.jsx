import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: 'How do I cancel my booking reservation?', a: 'You can cancel any active booking from your User Dashboard under the "My Bookings" tab. Click "Cancel Stay" and confirm. Refund calculations are applied automatically based on the host cancellation policy.' },
    { q: 'Is there a fee for utilizing Travelo?', a: 'We include a minor 5% flat service fee during booking checkout to maintain our premium verification checkups and 24/7 customer support live ticketing channels.' },
    { q: 'How can I become a host on Travelo?', a: 'Click the Host link in the top menu, fill out your property details (images, pricing, capacity), and submit. Our verification team will contact you within 48 hours.' },
    { q: 'What is the refund turnaround time?', a: 'Once a booking cancellation is confirmed, refunds are processed immediately. The credits typically reflect back on your payment method within 5-7 business days depending on your financial institution.' }
  ];

  return (
    <div style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto 60px', paddingLeft: '20px', paddingRight: '20px' }}>
      <h2 style={{ marginBottom: '8px' }}>Frequently Asked Questions</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Common support topics, booking terms, and hosting questions answered.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px 24px',
                cursor: 'pointer',
                boxShadow: '0 4px 10px var(--shadow-color)'
              }}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '15px' }}>
                <span>{faq.q}</span>
                <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--accent-color)' }}></i>
              </div>
              
              {isOpen && (
                <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', animation: 'fadeIn 0.2s ease-out' }}>
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
