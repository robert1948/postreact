const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['content', 'analysis', 'support', 'automation', 'creative']
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'credits', 'subscription'],
      required: true
    },
    creditCost: {
      type: Number,
      default: 0
    }
  },
  capabilities: [{
    type: String
  }],
  apiEndpoint: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'deprecated'],
    default: 'active'
  },
  requiredSubscription: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    default: 'free'
  }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);