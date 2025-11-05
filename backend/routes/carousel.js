// backend/routes/carousel.js
const express = require('express');
const Carousel = require('../models/Carousel');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/carousel (public - get active carousel items)
router.get('/', async (req, res) => {
  try {
    const items = await Carousel.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('imageUrl title subtitle order');
    return res.json(items);
  } catch (err) {
    console.error('GET /api/carousel error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/carousel/all (admin - get all carousel items)
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const items = await Carousel.find().sort({ order: 1, createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error('GET /api/carousel/all error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/carousel (admin - create new carousel item)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { imageUrl, title, subtitle, order, isActive } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const carouselItem = new Carousel({
      imageUrl,
      title: title || '',
      subtitle: subtitle || '',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await carouselItem.save();
    return res.status(201).json(carouselItem);
  } catch (err) {
    console.error('POST /api/carousel error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/carousel/:id (admin - update carousel item)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { imageUrl, title, subtitle, order, isActive } = req.body;
    
    const item = await Carousel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Carousel item not found' });
    }

    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (title !== undefined) item.title = title;
    if (subtitle !== undefined) item.subtitle = subtitle;
    if (order !== undefined) item.order = order;
    if (isActive !== undefined) item.isActive = isActive;

    await item.save();
    return res.json(item);
  } catch (err) {
    console.error('PUT /api/carousel/:id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/carousel/:id (admin - delete carousel item)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const item = await Carousel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Carousel item not found' });
    }
    return res.json({ message: 'Carousel item deleted' });
  } catch (err) {
    console.error('DELETE /api/carousel/:id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

