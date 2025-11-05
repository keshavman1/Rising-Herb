// frontend/src/ui/HerbCard.jsx
import React from 'react';
import { FaWhatsapp, FaTag } from 'react-icons/fa';

function getApiBaseForFiles() {
  const env = import.meta.env.VITE_API_URL || '';
  if (!env) return window.location.origin;
  return env.replace(/\/api\/?$/, '');
}

function normalizeImageUrl(imageUrl) {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const base = getApiBaseForFiles();
  if (imageUrl.startsWith('/')) return `${base}${imageUrl}`;
  if (imageUrl.startsWith('uploads/')) return `${base}/${imageUrl}`;
  return `${base}/uploads/${imageUrl}`;
}

export default function HerbCard({ herb = {}, onChat = () => {} }) {
  if (!herb || typeof herb !== 'object') return null;

  const imageUrl = normalizeImageUrl(herb.imageUrl);
  const adminNumber = herb.adminWhatsapp || '';
  const cleaned = String(adminNumber || '').replace(/\D/g, '');
  const waLink = cleaned ? `https://wa.me/${cleaned}?text=${encodeURIComponent("Hi! I'm interested in " + (herb.name || 'this herb'))}` : null;

  return (
    <div 
      className="card h-100 border-0 herb-card" 
      style={{ 
        borderRadius: '16px', 
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        border: '1px solid #e8f5e9'
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            className="card-img-top" 
            alt={herb.name || 'herb'} 
            style={{ 
              height: '240px', 
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        ) : (
          <div 
            style={{ 
              height: '240px', 
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <FaTag className="text-success" size={48} />
          </div>
        )}
        
        {/* Category Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(47, 138, 31, 0.9)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'capitalize',
            backdropFilter: 'blur(10px)'
          }}
        >
          {herb.category || 'General'}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body d-flex flex-column" style={{ padding: '1.5rem' }}>
        <h5 
          className="mb-2 fw-bold" 
          style={{ 
            color: '#2f8a1f',
            fontSize: '1.1rem',
            lineHeight: '1.4',
            minHeight: '3.2em'
          }}
        >
          {herb.name || 'Unnamed Herb'}
        </h5>
        
        <p 
          className="text-muted mb-3" 
          style={{ 
            fontSize: '0.875rem',
            lineHeight: '1.6',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em'
          }}
        >
          {herb.description || 'Premium quality natural product for your wellness.'}
        </p>

        <div style={{ marginTop: 'auto' }}>
          {/* Price Section */}
          <div className="mb-3">
            <div className="d-flex align-items-baseline justify-content-between">
              <div>
                <small className="text-muted d-block" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                  Price Range
                </small>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2f8a1f' }}>
                  ₹{herb.minPrice ?? '—'}
                  {herb.maxPrice && herb.maxPrice !== herb.minPrice && (
                    <span style={{ fontSize: '1rem', fontWeight: '500', color: '#6c757d' }}>
                      {' - ₹' + herb.maxPrice}
                    </span>
                  )}
                </div>
                {herb.unit && (
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    per {herb.unit}
                  </small>
                )}
              </div>

              {/* WhatsApp Button */}
              {waLink ? (
                <a 
                  href={waLink} 
                  rel="noreferrer" 
                  target="_blank" 
                  title="Contact on WhatsApp"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
                  }}
                >
                  <FaWhatsapp size={20} />
                </a>
              ) : (
                <button 
                  className="btn" 
                  disabled 
                  title="WhatsApp number not available" 
                  style={{ 
                    backgroundColor: '#25D366',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.5,
                    border: 'none',
                    cursor: 'not-allowed'
                  }}
                >
                  <FaWhatsapp size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
