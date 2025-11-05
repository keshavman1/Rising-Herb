import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaSeedling, FaAward, FaUsers, FaHeart, FaHandshake } from 'react-icons/fa';
import api from '../services/api';

export default function AboutUs() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/page-content/about')
      .then(res => setContent(res.data))
      .catch(err => {
        console.error('Error fetching about content:', err);
        setContent(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Default values if content not loaded
  const defaultValues = [
    {
      icon: <FaLeaf className="text-success" size={40} />,
      title: 'Natural & Organic',
      description: 'We source only the finest natural herbs and organic products, ensuring purity in every batch.'
    },
    {
      icon: <FaAward className="text-success" size={40} />,
      title: 'GMP Certified',
      description: 'Our products meet the highest standards of Good Manufacturing Practices for quality and safety.'
    },
    {
      icon: <FaSeedling className="text-success" size={40} />,
      title: 'Sustainable Sourcing',
      description: 'We work directly with farmers to ensure sustainable and ethical sourcing practices.'
    },
    {
      icon: <FaHeart className="text-success" size={40} />,
      title: 'Health First',
      description: 'Your health and wellness are our top priorities. Every product is carefully selected for its benefits.'
    }
  ];

  const defaultTeam = [
    {
      name: 'Expert Herbalists',
      role: 'Our team of certified herbalists ensures product quality and authenticity.'
    },
    {
      name: 'Quality Assurance',
      role: 'Rigorous testing and quality checks at every stage of production.'
    },
    {
      name: 'Customer Support',
      role: 'Dedicated support team ready to assist you with any questions or concerns.'
    }
  ];

  const values = content?.values && content.values.length > 0 
    ? content.values.map((v, i) => ({
        ...v,
        icon: [<FaLeaf />, <FaAward />, <FaSeedling />, <FaHeart />][i] || <FaLeaf />
      }))
    : defaultValues;

  const team = defaultTeam; // Can be extended to use content.team if added to schema

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const heroTitle = content?.heroTitle || 'About Rising Herb';
  const heroSubtitle = content?.heroSubtitle || 'Your trusted partner in natural wellness and herbal solutions';
  const missionTitle = content?.missionTitle || 'Our Mission';
  const missionContent = content?.missionContent || 'At Rising Herb, we are committed to bringing you the finest quality herbs, spices, and natural products sourced directly from trusted farmers and suppliers.';
  const visionTitle = content?.visionTitle || 'Our Vision';
  const visionContent = content?.visionContent || 'To become the leading provider of natural herbal products, recognized for our commitment to quality, authenticity, and customer satisfaction.';

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="text-center py-5 mb-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)', borderRadius: '16px' }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#2f8a1f' }}>
            {heroTitle}
          </h1>
          <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="card shadow-sm border-0" style={{ borderRadius: '16px', padding: '2rem' }}>
                <h2 className="mb-4" style={{ color: '#2f8a1f' }}>
                  <FaSeedling className="me-2" />
                  {missionTitle}
                </h2>
                <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {missionContent}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-sm border-0" style={{ borderRadius: '16px', padding: '2rem' }}>
                <h2 className="mb-4" style={{ color: '#2f8a1f' }}>
                  <FaHandshake className="me-2" />
                  {visionTitle}
                </h2>
                <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {visionContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: '#2f8a1f' }}>
            Our Core Values
          </h2>
          <div className="row g-4">
            {values.map((value, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div 
                  className="card h-100 shadow-sm border-0 text-center" 
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
                  <div className="mb-3">{value.icon}</div>
                  <h5 className="mb-3 fw-bold" style={{ color: '#2f8a1f' }}>
                    {value.title || 'Value'}
                  </h5>
                  <p className="text-muted small">
                    {value.description || 'Description not available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {/* <section className="mb-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: '#2f8a1f' }}>
            Why Choose Us
          </h2>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', padding: '2rem' }}>
                <img src="/assets/gmp.png" alt="GMP" width="80" className="mb-3" />
                <h5 className="mb-2 fw-bold">GMP Certified</h5>
                <p className="text-muted small">Good Manufacturing Process certified for quality assurance</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', padding: '2rem' }}>
                <img src="/assets/ready.png" alt="Ready" width="80" className="mb-3" />
                <h5 className="mb-2 fw-bold">Ready To Use</h5>
                <p className="text-muted small">Finely ground herbs and spices, ready for your use</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', padding: '2rem' }}>
                <img src="/assets/secure.png" alt="Secure" width="80" className="mb-3" />
                <h5 className="mb-2 fw-bold">Secure Payment</h5>
                <p className="text-muted small">100% secure transactions with multiple payment options</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Team/Expertise Section */}
      <section className="mb-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: '#2f8a1f' }}>
            Our Expertise
          </h2>
          <div className="row g-4">
            {team.map((member, index) => (
              <div className="col-md-4" key={index}>
                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', padding: '2rem', borderLeft: '4px solid #2f8a1f' }}>
                  <div className="d-flex align-items-center mb-3">
                    <FaUsers className="text-success me-3" size={24} />
                    <h5 className="mb-0 fw-bold" style={{ color: '#2f8a1f' }}>
                      {member.name}
                    </h5>
                  </div>
                  <p className="text-muted mb-0">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-5" style={{ background: 'linear-gradient(135deg, #2f8a1f 0%, #198754 100%)', borderRadius: '16px', color: 'white' }}>
        <div className="container">
          <h2 className="mb-3">Join Us on Your Wellness Journey</h2>
          <p className="lead mb-4">
            Discover the power of nature with our premium herbal products
          </p>
          <Link to="/contact" className="btn btn-light btn-lg px-5" style={{ borderRadius: '50px', textDecoration: 'none' }}>
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
