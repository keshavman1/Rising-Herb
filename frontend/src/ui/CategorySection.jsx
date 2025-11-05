import React from 'react';

const categories = [
  { id: 'Herbs', label: 'Herbs', img: '/assets/cat-herbs.jpg' },
  { id: 'Herbs Powder', label: 'Herbs Powder', img: '/assets/cat-herbspowder.jpg' },
  { id: 'seeds', label: 'Seeds', img: '/assets/cat-seeds.jpg' },
  { id: 'vermicompost', label: 'Vermicompost', img: '/assets/cat-vermicompost.jpg' }
];

export default function CategorySection({ onCategoryClick }) {
  return (
    <div className="category-section">
      <div className="row g-4">
        {categories.map(cat => (
          <div className="col-md-3 col-sm-6" key={cat.id}>
            <div
              className="card shadow-sm border-0"
              onClick={() => onCategoryClick(cat.id)}
              style={{
                cursor: 'pointer',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                height: '200px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid #e8f5e9'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(47, 138, 31, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${cat.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '100%',
                  position: 'relative',
                  filter: 'brightness(0.85)'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-end'
                  }}
                >
                  <h5
                    className="mb-0 fw-bold text-white"
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {cat.label}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
