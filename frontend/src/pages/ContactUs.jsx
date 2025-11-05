import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';
import api from '../services/api';

export default function ContactUs() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get('/page-content/contact')
      .then(res => setContent(res.data))
      .catch(err => {
        console.error('Error fetching contact content:', err);
        setContent(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const heroTitle = content?.heroTitle || 'Contact Us';
  const heroSubtitle = content?.heroSubtitle || "We'd love to hear from you. Get in touch with us today!";
  
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt size={24} />,
      title: 'Address',
      details: content?.address || '123 Herbal Street, Wellness City, WC 12345',
      link: null
    },
    {
      icon: <FaPhone size={24} />,
      title: 'Phone',
      details: content?.phone || '+1 (555) 123-4567',
      link: content?.phone ? `tel:${content.phone.replace(/\D/g, '')}` : null
    },
    {
      icon: <FaEnvelope size={24} />,
      title: 'Email',
      details: content?.email || 'info@risingherb.com',
      link: content?.email ? `mailto:${content.email}` : 'mailto:info@risingherb.com'
    },
    {
      icon: <FaWhatsapp size={24} />,
      title: 'WhatsApp',
      details: content?.whatsapp ? `Chat with us on WhatsApp` : 'Chat with us on WhatsApp',
      link: content?.whatsapp ? `https://wa.me/${content.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/15551234567'
    },
    {
      icon: <FaClock size={24} />,
      title: 'Business Hours',
      details: content?.businessHours || 'Mon - Sat: 9:00 AM - 6:00 PM',
      link: null
    }
  ];

  return (
    <div className="contact-us-page">
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

      <div className="container">
        <div className="row g-5">
          {/* Contact Information */}
          <div className="col-lg-4">
            <div className="mb-4">
              <h2 className="mb-4" style={{ color: '#2f8a1f' }}>
                Get in Touch
              </h2>
              <p className="text-muted">
                Have questions about our products? Need assistance with an order? 
                Our team is here to help you!
              </p>
            </div>

            <div className="contact-info-list">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="card shadow-sm border-0 mb-3" 
                  style={{ 
                    borderRadius: '12px', 
                    padding: '1.5rem',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    border: '1px solid #e8f5e9'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(47, 138, 31, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="d-flex align-items-start">
                    <div className="text-success me-3" style={{ marginTop: '4px' }}>
                      {info.icon}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#2f8a1f' }}>
                        {info.title}
                      </h6>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          target={info.link.startsWith('http') ? '_blank' : '_self'}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                          className="text-muted text-decoration-none"
                          style={{ fontSize: '0.9rem' }}
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                          {info.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0" style={{ borderRadius: '16px', padding: '2.5rem' }}>
              <h2 className="mb-4" style={{ color: '#2f8a1f' }}>
                Send us a Message
              </h2>

              {submitted && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Thank you!</strong> Your message has been sent. We'll get back to you soon.
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSubmitted(false)}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2f8a1f';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(47, 138, 31, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ced4da';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2f8a1f';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(47, 138, 31, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ced4da';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2f8a1f';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(47, 138, 31, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ced4da';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="subject" className="form-label fw-semibold">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2f8a1f';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(47, 138, 31, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ced4da';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="message" className="form-label fw-semibold">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2f8a1f';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(47, 138, 31, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ced4da';
                        e.target.style.boxShadow = 'none';
                      }}
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg px-5"
                      style={{ 
                        borderRadius: '50px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 16px rgba(47, 138, 31, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section (Optional) */}
        <section className="mt-5 mb-5">
          <div className="card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2f8a1f'
            }}>
              <div className="text-center">
                <FaMapMarkerAlt size={48} className="mb-3" />
                <h5>Map Location</h5>
                <p className="text-muted">Interactive map would be integrated here</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
