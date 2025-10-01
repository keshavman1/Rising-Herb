const express = require('express');
const Joi = require('joi');
const Herb = require('../models/Herb');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const herbSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  category: Joi.string().allow(''),
  minPrice: Joi.number().min(0).required(),
  maxPrice: Joi.number().min(0).required(),
  unit: Joi.string().default('100 gm'),
  whatsappNumber: Joi.string().required(),
  imageUrl: Joi.string().uri().allow(''),
  tags: Joi.array().items(Joi.string()).optional()
});

// Public: list herbs
router.get('/', async (req, res) => {
  try {
    const { q, category, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (q) filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const herbs = await Herb.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    res.json(herbs);
  } catch (err) {
    console.error('get herbs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: get single
router.get('/:id', async (req, res) => {
  try {
    const herb = await Herb.findById(req.params.id);
    if (!herb) return res.status(404).json({ message: 'Not found' });
    res.json(herb);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
});

// Admin: create
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { error, value } = herbSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const herb = new Herb(value);
    await herb.save();
    res.status(201).json(herb);
  } catch (err) {
    console.error('create herb error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { error, value } = herbSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const herb = await Herb.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!herb) return res.status(404).json({ message: 'Not found' });
    res.json(herb);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
});

// Admin: delete
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const herb = await Herb.findByIdAndDelete(req.params.id);
    if (!herb) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
