// backend/routes/pageContent.js
const express = require('express');
const PageContent = require('../models/PageContent');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/page-content/:pageType (public - get page content)
router.get('/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    if (!['about', 'contact'].includes(pageType)) {
      return res.status(400).json({ message: 'Invalid page type' });
    }

    let content = await PageContent.findOne({ pageType });
    
    // Return default content if not found
    if (!content) {
      content = {
        pageType,
        heroTitle: pageType === 'about' ? 'About Rising Herb' : 'Contact Us',
        heroSubtitle: pageType === 'about' 
          ? 'Your trusted partner in natural wellness and herbal solutions'
          : "We'd love to hear from you. Get in touch with us today!",
        missionTitle: '',
        missionContent: '',
        visionTitle: '',
        visionContent: '',
        values: [],
        address: '',
        phone: '',
        email: '',
        whatsapp: '',
        businessHours: '',
        content: ''
      };
    }

    return res.json(content);
  } catch (err) {
    console.error('GET /api/page-content/:pageType error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/page-content/:pageType (admin - update page content)
router.put('/:pageType', authenticate, requireAdmin, async (req, res) => {
  try {
    const { pageType } = req.params;
    if (!['about', 'contact'].includes(pageType)) {
      return res.status(400).json({ message: 'Invalid page type' });
    }

    let content = await PageContent.findOne({ pageType });
    
    if (!content) {
      content = new PageContent({ pageType });
    }

    // Update all provided fields
    const updatableFields = [
      'heroTitle', 'heroSubtitle', 'missionTitle', 'missionContent',
      'visionTitle', 'visionContent', 'values', 'address', 'phone',
      'email', 'whatsapp', 'businessHours', 'content'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field];
      }
    });

    await content.save();
    return res.json(content);
  } catch (err) {
    console.error('PUT /api/page-content/:pageType error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

