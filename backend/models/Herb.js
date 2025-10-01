const mongoose = require('mongoose');

const herbSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'general' },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  unit: { type: String, default: '100 gm' },
  whatsappNumber: { type: String, required: true }, // store international number as string e.g. "919876543210"
  imageUrl: { type: String, default: '' },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

herbSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Herb', herbSchema);
