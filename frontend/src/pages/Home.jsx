// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import HerbCard from '../ui/HerbCard';
import Carousel from '../ui/Carousel';
import CategorySection from '../ui/CategorySection';
import ChatModal from '../ui/ChatModal';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../App';
import { Link } from 'react-router-dom';

export default function Home() {
  const [herbs, setHerbs] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { search } = useSearch();

  useEffect(() => {
    // Fetch herbs and carousel items in parallel
    Promise.all([
      api.get('/herbs'),
      api.get('/carousel')
    ])
      .then(([herbsRes, carouselRes]) => {
        setHerbs(Array.isArray(herbsRes.data) ? herbsRes.data : []);
        setCarouselItems(Array.isArray(carouselRes.data) ? carouselRes.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = herbs.filter(h => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (h.name && h.name.toLowerCase().includes(term)) ||
      (h.category && h.category.toLowerCase().includes(term))
    );
  });

  const isSearching = search.trim().length > 0;

  function handleCategoryClick(cat) {
    navigate(`/category/${encodeURIComponent(cat)}`);
  }

  const latestHerbs = herbs.slice(0, 4); // Only 4 on homepage

  // Loading state with modern design
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading our premium herbs...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Carousel Section */}
      {!isSearching && (
        <section className="mb-5">
          <Carousel items={carouselItems} interval={5000} />
        </section>
      )}

      {/* Welcome Hero Section */}
      {!isSearching && (
        <section className="text-center py-5 mb-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)', borderRadius: '16px' }}>
          <div className="container">
            <h1 className="display-4 fw-bold mb-3" style={{ color: '#2f8a1f' }}>
              Welcome to Rising Herb
            </h1>
            <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
              Discover nature's finest herbs and spices for your wellness journey
            </p>
          </div>
        </section>
      )}

      {/* Category Section */}
      {!isSearching && (
        <section className="mb-5">
          <div className="container">
            <h2 className="text-center mb-5" style={{ color: '#2f8a1f' }}>
              Shop By Category
            </h2>
            <CategorySection onCategoryClick={handleCategoryClick} />
          </div>
        </section>
      )}

      {/* Latest Herbs Section - Modern Design */}
      <section className="mb-5" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)', padding: '3rem 0', borderRadius: '24px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div style={{ 
              display: 'inline-block',
              padding: '8px 24px',
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
              borderRadius: '50px',
              marginBottom: '1rem'
            }}>
              <span style={{ color: '#2f8a1f', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {isSearching ? 'Search Results' : 'Featured Products'}
              </span>
            </div>
            <h2 
              className="mb-3 fw-bold" 
              style={{ 
                color: '#2f8a1f',
                fontSize: '2.5rem',
                letterSpacing: '-0.5px'
              }}
            >
              {isSearching ? 'Search Results' : 'Latest Updated Herbs'}
            </h2>
            {!isSearching && (
              <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Discover our newest premium additions, carefully selected for quality and authenticity
              </p>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="card shadow-sm border-0 text-center py-5" style={{ borderRadius: '16px', background: 'white' }}>
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>No herbs found matching your search.</p>
                <p className="text-muted small mt-2">Try adjusting your search terms or browse all products</p>
              </div>
            </div>
          ) : (
            <div className="row justify-content-center g-4">
              {(isSearching ? filtered : latestHerbs).map((h, index) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={h._id || Math.random()}>
                  <div
                    style={{
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease',
                      animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                    }}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget.querySelector('.card');
                      if (card) {
                        card.style.transform = 'translateY(-12px) scale(1.02)';
                        card.style.boxShadow = '0 20px 40px rgba(47, 138, 31, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget.querySelector('.card');
                      if (card) {
                        card.style.transform = 'translateY(0) scale(1)';
                        card.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                      }
                    }}
                  >
                    <HerbCard herb={h} onChat={() => setSelected(h)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && (
            <div className="text-center mt-5">
              <button
                className="btn btn-success btn-lg px-5"
                onClick={() => navigate('/all-herbs')}
                style={{
                  borderRadius: '50px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  padding: '12px 40px',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(47, 138, 31, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(47, 138, 31, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(47, 138, 31, 0.2)';
                }}
              >
                View All Products →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      {/* {!isSearching && (
        <section className="mb-5">
          <div className="container">
            <h2 className="text-center mb-5" style={{ color: '#2f8a1f' }}>
              Why Choose Us
            </h2>
            <div className="row g-4">
              <div className="col-md-3 col-sm-6">
                <div
                  className="card shadow-sm border-0 h-100 text-center"
                  style={{
                    borderRadius: '16px',
                    padding: '2rem',
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
                  <img src="/assets/gmp.png" alt="GMP" width="80" className="mb-3" />
                  <h5 className="mb-2 fw-bold" style={{ color: '#2f8a1f' }}>GMP Certified</h5>
                  <p className="text-muted small mb-0">Good Manufacturing Process certified for quality assurance</p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div
                  className="card shadow-sm border-0 h-100 text-center"
                  style={{
                    borderRadius: '16px',
                    padding: '2rem',
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
                  <img src="/assets/ready.png" alt="Ready" width="80" className="mb-3" />
                  <h5 className="mb-2 fw-bold" style={{ color: '#2f8a1f' }}>Ready To Use</h5>
                  <p className="text-muted small mb-0">Finely ground herbs and spices, ready for your use</p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div
                  className="card shadow-sm border-0 h-100 text-center"
                  style={{
                    borderRadius: '16px',
                    padding: '2rem',
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
                  <img src="/assets/secure.png" alt="Secure" width="80" className="mb-3" />
                  <h5 className="mb-2 fw-bold" style={{ color: '#2f8a1f' }}>Secure Payment</h5>
                  <p className="text-muted small mb-0">100% secure transactions with multiple payment options</p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div
                  className="card shadow-sm border-0 h-100 text-center"
                  style={{
                    borderRadius: '16px',
                    padding: '2rem',
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
                  <img src="/assets/fast.png" alt="Fast" width="80" className="mb-3" />
                  <h5 className="mb-2 fw-bold" style={{ color: '#2f8a1f' }}>Fast Shipping</h5>
                  <p className="text-muted small mb-0">Orders processed and shipped within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )} */}

      {/* Call to Action Section */}
      {!isSearching && (
        <section className="text-center py-5" style={{ background: 'linear-gradient(135deg, #2f8a1f 0%, #198754 100%)', borderRadius: '16px', color: 'white' }}>
          <div className="container">
            <h2 className="mb-3">Start Your Wellness Journey Today</h2>
            <p className="lead mb-4">
              Explore our premium collection of natural herbs and spices
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link
                to="/all-herbs"
                className="btn btn-light btn-lg px-5"
                style={{ borderRadius: '50px', textDecoration: 'none', fontWeight: '600' }}
              >
                Browse All Products
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline-light btn-lg px-5"
                style={{ borderRadius: '50px', textDecoration: 'none', fontWeight: '600' }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}

      <ChatModal herb={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
