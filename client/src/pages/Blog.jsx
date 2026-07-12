import React from 'react';

const Blog = () => {
  const posts = [
    {
      title: 'Trekking Everest Base Camp: A Guide for Novice Adventurers',
      excerpt: 'Preparing for the Himalayas? Read our packing guides, conditioning routines, and altitude safety protocols before flying to Lukla.',
      date: 'June 18, 2026',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Top 5 Hidden Waterfalls in Seminyak, Bali',
      excerpt: 'Skip the crowded beaches and discover secret natural lagoons tucked away in the deep tropical jungles of Bali.',
      date: 'May 22, 2026',
      img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Santorini Sunset spots: Secret Cliffs to Avoid the Crowds',
      excerpt: 'Oia is famous for sunsets, but the main path gets packed. Here are three secluded cliff viewpoints to enjoy the views in peace.',
      date: 'April 14, 2026',
      img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div style={{ paddingTop: '100px', maxWidth: '900px', margin: '0 auto 60px', paddingLeft: '20px', paddingRight: '20px' }}>
      <h2>Travelo Journal</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Inspiration, packing lists, and local guides written by travel experts.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {posts.map((post) => (
          <div
            key={post.title}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              gap: '20px',
              boxShadow: '0 4px 15px var(--shadow-color)'
            }}
          >
            <img src={post.img} alt={post.title} style={{ width: '250px', height: '170px', objectFit: 'cover' }} />
            <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: 'bold' }}>{post.date}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 10px 0' }}>{post.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{post.excerpt}</p>
              </div>
              <a href="#read" style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-color)', textDecoration: 'underline', marginTop: '10px' }}>
                Read Article
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
