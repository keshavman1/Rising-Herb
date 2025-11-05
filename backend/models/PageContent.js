const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  pageType: { 
    type: String, 
    required: true,
    enum: ['about', 'contact'],
    unique: true
  },
  // About Us fields
  heroTitle: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  missionTitle: { type: String, default: '' },
  missionContent: { type: String, default: '' },
  visionTitle: { type: String, default: '' },
  visionContent: { type: String, default: '' },
  values: [{
    title: String,
    description: String
  }],
  // Contact Us fields
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  businessHours: { type: String, default: '' },
  // Common fields
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

pageContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PageContent', pageContentSchema);

