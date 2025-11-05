// frontend/src/pages/AllHerbs.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import HerbCard from '../ui/HerbCard';
import ChatModal from '../ui/ChatModal';
import { FaFilter, FaSortAmountDown, FaTimes } from 'react-icons/fa';

const categories = ['All', 'Herbs', 'Herbs Powder', 'seeds', 'vermicompost'];

export default function AllHerbs() {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [sortType, setSortType] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    api.get('/herbs')
      .then((r) => setHerbs(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter by category
  const categoryFiltered = selectedCategory === 'All' 
    ? herbs 
    : herbs.filter(h => (h.category || '').toLowerCase() === selectedCategory.toLowerCase());

  // Filter by price range
  const priceFiltered = categoryFiltered.filter(h => {
    const minPrice = h.minPrice || 0;
    if (priceRange.min && minPrice < parseFloat(priceRange.min)) return false;
    if (priceRange.max && minPrice > parseFloat(priceRange.max)) return false;
    return true;
  });

  // Sort filtered results
  const sortedHerbs = [...priceFiltered].sort((a, b) => {
    switch (sortType) {
      case 'priceLowHigh':
        return (a.minPrice || 0) - (b.minPrice || 0);
      case 'priceHighLow':
        return (b.minPrice || 0) - (a.minPrice || 0);
      case 'nameAZ':
        return (a.name || '').localeCompare(b.name || '');
      case 'nameZA':
        return (b.name || '').localeCompare(a.name || '');
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: '', max: '' });
    setSortType('default');
  };

  const hasActiveFilters = selectedCategory !== 'All' || priceRange.min || priceRange.max || sortType !== 'default';

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
    <div className="all-herbs-page">
      {/* Hero Section */}
      <section className="text-center py-4 mb-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)', borderRadius: '16px' }}>
        <div className="container">
          <h1 className="display-5 fw-bold mb-2" style={{ color: '#2f8a1f' }}>
            All Products
          </h1>
          <p className="text-muted">Browse our complete collection of premium herbs and natural products</p>
        </div>
      </section>

      {/* Mobile Filter Toggle */}
      <div className="d-md-none mb-4">
        <button
          className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          style={{ borderRadius: '12px', padding: '12px' }}
        >
          <FaFilter /> {showMobileFilters ? 'Hide' : 'Show'} Filters
          {hasActiveFilters && (
            <span className="badge bg-light text-success ms-2">{sortedHerbs.length}</span>
          )}
        </button>
      </div>

      <div className="row">
        {/* Sidebar Filters - Desktop & Mobile */}
        <div className={`col-md-3 mb-4 ${showMobileFilters ? 'd-block' : 'd-none'} d-md-block`}>
          <div 
            className="card shadow-sm border-0 sticky-top" 
            style={{ 
              top: '100px',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e8f5e9'
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold" style={{ color: '#2f8a1f' }}>
                <FaFilter className="me-2" />
                Filters
              </h5>
              <button
                className="btn btn-link p-0 d-md-none"
                onClick={() => setShowMobileFilters(false)}
                style={{ color: '#6c757d' }}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Active Filters Badge */}
            {hasActiveFilters && (
              <div className="mb-3">
                <button
                  className="btn btn-sm btn-outline-danger w-100"
                  onClick={clearFilters}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-4">
              <h6 className="fw-semibold mb-3" style={{ color: '#2f8a1f', fontSize: '0.95rem' }}>
                Category
              </h6>
              <div className="d-flex flex-column gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm text-start ${selectedCategory === cat ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      borderRadius: '8px',
                      border: selectedCategory === cat ? 'none' : '1px solid #dee2e6',
                      fontWeight: selectedCategory === cat ? '600' : '400',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat}
                    {cat !== 'All' && (
                      <span className="badge bg-light text-muted ms-2">
                        {herbs.filter(h => (h.category || '').toLowerCase() === cat.toLowerCase()).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-4">
              <h6 className="fw-semibold mb-3" style={{ color: '#2f8a1f', fontSize: '0.95rem' }}>
                Price Range
              </h6>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small text-muted">Min Price (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    style={{ borderRadius: '8px' }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Max Price (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    style={{ borderRadius: '8px' }}
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h6 className="fw-semibold mb-3" style={{ color: '#2f8a1f', fontSize: '0.95rem' }}>
                <FaSortAmountDown className="me-2" />
                Sort By
              </h6>
              <div className="d-flex flex-column gap-2">
                {[
                  { value: 'default', label: 'Default' },
                  { value: 'priceLowHigh', label: 'Price: Low → High' },
                  { value: 'priceHighLow', label: 'Price: High → Low' },
                  { value: 'nameAZ', label: 'Name: A → Z' },
                  { value: 'nameZA', label: 'Name: Z → A' }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`btn btn-sm text-start ${sortType === option.value ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setSortType(option.value)}
                    style={{
                      borderRadius: '8px',
                      border: sortType === option.value ? 'none' : '1px solid #dee2e6',
                      fontWeight: sortType === option.value ? '600' : '400',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-md-9">
          {/* Results Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h3 className="mb-1 fw-bold" style={{ color: '#2f8a1f' }}>
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h3>
              <p className="text-muted mb-0 small">
                {sortedHerbs.length} {sortedHerbs.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            {hasActiveFilters && (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {selectedCategory !== 'All' && (
                  <span className="badge bg-success" style={{ padding: '6px 12px', borderRadius: '20px' }}>
                    {selectedCategory}
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span className="badge bg-info" style={{ padding: '6px 12px', borderRadius: '20px' }}>
                    ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {sortedHerbs.length === 0 ? (
            <div className="card shadow-sm border-0 text-center py-5" style={{ borderRadius: '16px' }}>
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h5 className="mb-2">No products found</h5>
                <p className="text-muted mb-3">Try adjusting your filters or search criteria</p>
                {hasActiveFilters && (
                  <button
                    className="btn btn-success"
                    onClick={clearFilters}
                    style={{ borderRadius: '8px' }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {sortedHerbs.map((h, index) => (
                <div className="col-lg-4 col-md-6" key={h._id || Math.random()}>
                  <div
                    style={{
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease'
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
        </div>
      </div>

      <ChatModal herb={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
