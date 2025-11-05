import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('carousel');
  const [carouselItems, setCarouselItems] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);
  const [contactContent, setContactContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carousel form
  const [carouselForm, setCarouselForm] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    order: 0,
    isActive: true
  });
  const [editingCarouselId, setEditingCarouselId] = useState(null);

  useEffect(() => {
    fetchCarousel();
    fetchAboutContent();
    fetchContactContent();
  }, []);

  const fetchCarousel = async () => {
    try {
      const res = await api.get('/carousel/all');
      setCarouselItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAboutContent = async () => {
    try {
      const res = await api.get('/page-content/about');
      setAboutContent(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchContactContent = async () => {
    try {
      const res = await api.get('/page-content/contact');
      setContactContent(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Carousel handlers
  const handleCarouselSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!carouselForm.imageUrl) throw new Error('Image URL is required');

      if (editingCarouselId) {
        await api.put(`/carousel/${editingCarouselId}`, carouselForm);
      } else {
        await api.post('/carousel', carouselForm);
      }

      setCarouselForm({ imageUrl: '', title: '', subtitle: '', order: 0, isActive: true });
      setEditingCarouselId(null);
      fetchCarousel();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  const startEditCarousel = (item) => {
    setEditingCarouselId(item._id);
    setCarouselForm({
      imageUrl: item.imageUrl || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      order: item.order || 0,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
  };

  const deleteCarousel = async (id) => {
    if (!confirm('Delete this carousel item?')) return;
    try {
      await api.delete(`/carousel/${id}`);
      fetchCarousel();
    } catch (e) {
      alert('Delete failed');
    }
  };

  // About Us handlers
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put('/page-content/about', aboutContent);
      alert('About Us content updated successfully!');
      fetchAboutContent();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Contact Us handlers
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put('/page-content/contact', contactContent);
      alert('Contact Us content updated successfully!');
      fetchContactContent();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-center">Manage Website Content</h3>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid #dee2e6' }}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'carousel' ? 'active' : ''}`}
            onClick={() => setActiveTab('carousel')}
            style={{ border: 'none', background: 'none', color: activeTab === 'carousel' ? '#2f8a1f' : '#6c757d' }}
          >
            Carousel
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
            style={{ border: 'none', background: 'none', color: activeTab === 'about' ? '#2f8a1f' : '#6c757d' }}
          >
            About Us
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
            style={{ border: 'none', background: 'none', color: activeTab === 'contact' ? '#2f8a1f' : '#6c757d' }}
          >
            Contact Us
          </button>
        </li>
      </ul>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Carousel Tab */}
      {activeTab === 'carousel' && (
        <div>
          <h4 className="mb-3">Manage Carousel Images</h4>
          <div className="form-centered mx-auto mb-5">
            <form onSubmit={handleCarouselSubmit}>
              <div className="mb-3">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  className="form-control"
                  value={carouselForm.imageUrl}
                  onChange={(e) => setCarouselForm({ ...carouselForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Title (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={carouselForm.title}
                  onChange={(e) => setCarouselForm({ ...carouselForm, title: e.target.value })}
                  placeholder="Carousel title"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Subtitle (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={carouselForm.subtitle}
                  onChange={(e) => setCarouselForm({ ...carouselForm, subtitle: e.target.value })}
                  placeholder="Carousel subtitle"
                />
              </div>
              <div className="mb-3 row">
                <div className="col-6">
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={carouselForm.order}
                    onChange={(e) => setCarouselForm({ ...carouselForm, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={carouselForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setCarouselForm({ ...carouselForm, isActive: e.target.value === 'true' })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingCarouselId ? 'Update' : 'Add Carousel Item'}
                </button>
                {editingCarouselId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingCarouselId(null);
                      setCarouselForm({ imageUrl: '', title: '', subtitle: '', order: 0, isActive: true });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <h5 className="mb-3">Existing Carousel Items</h5>
          <div className="row g-3">
            {carouselItems.map((item) => (
              <div className="col-md-4" key={item._id}>
                <div className="card p-3 h-100" style={{ borderRadius: 12 }}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }} />
                  )}
                  <div>
                    <b>{item.title || 'No title'}</b>
                    <p className="small text-muted mb-1">{item.subtitle || 'No subtitle'}</p>
                    <div className="small">
                      Order: {item.order} | {item.isActive ? <span className="text-success">Active</span> : <span className="text-muted">Inactive</span>}
                    </div>
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => startEditCarousel(item)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCarousel(item._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Us Tab */}
      {activeTab === 'about' && aboutContent && (
        <div>
          <h4 className="mb-3">Edit About Us Content</h4>
          <div className="form-centered mx-auto">
            <form onSubmit={handleAboutSubmit}>
              <div className="mb-3">
                <label className="form-label">Hero Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={aboutContent.heroTitle || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, heroTitle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Hero Subtitle</label>
                <input
                  type="text"
                  className="form-control"
                  value={aboutContent.heroSubtitle || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, heroSubtitle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mission Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={aboutContent.missionTitle || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, missionTitle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mission Content</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={aboutContent.missionContent || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, missionContent: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Vision Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={aboutContent.visionTitle || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, visionTitle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Vision Content</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={aboutContent.visionContent || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, visionContent: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Values (JSON format - array of objects with title and description)</label>
                <textarea
                  className="form-control"
                  rows={8}
                  value={JSON.stringify(aboutContent.values || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setAboutContent({ ...aboutContent, values: parsed });
                    } catch (err) {
                      // Invalid JSON, keep as is
                    }
                  }}
                />
                <small className="form-text text-muted">
                  Example: [{'{'}"title": "Value 1", "description": "Description 1"{'}'}, {'{'}"title": "Value 2", "description": "Description 2"{'}'}]
                </small>
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Update About Us'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Us Tab */}
      {activeTab === 'contact' && contactContent && (
        <div>
          <h4 className="mb-3">Edit Contact Us Content</h4>
          <div className="form-centered mx-auto">
            <form onSubmit={handleContactSubmit}>
              <div className="mb-3">
                <label className="form-label">Hero Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactContent.heroTitle || ''}
                  onChange={(e) => setContactContent({ ...contactContent, heroTitle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Hero Subtitle</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactContent.heroSubtitle || ''}
                  onChange={(e) => setContactContent({ ...contactContent, heroSubtitle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactContent.address || ''}
                  onChange={(e) => setContactContent({ ...contactContent, address: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactContent.phone || ''}
                  onChange={(e) => setContactContent({ ...contactContent, phone: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={contactContent.email || ''}
                  onChange={(e) => setContactContent({ ...contactContent, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">WhatsApp Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactContent.whatsapp || ''}
                  onChange={(e) => setContactContent({ ...contactContent, whatsapp: e.target.value })}
                  placeholder="e.g., +1234567890"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Business Hours</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactContent.businessHours || ''}
                  onChange={(e) => setContactContent({ ...contactContent, businessHours: e.target.value })}
                  placeholder="e.g., Mon - Sat: 9:00 AM - 6:00 PM"
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Update Contact Us'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

