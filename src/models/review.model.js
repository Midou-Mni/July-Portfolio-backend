const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    name: {
      type: String,
      default: 'Anonymous',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    contact: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: function(v) {
            return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: 'Please enter a valid email address'
        }
      },
      whatsapp: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            return !v || /^\+?[\d\s\-\(\)]{10,}$/.test(v);
          },
          message: 'Please enter a valid WhatsApp number'
        }
      },
      instagram: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            return !v || /^[a-zA-Z0-9._]{1,30}$/.test(v);
          },
          message: 'Please enter a valid Instagram username'
        }
      },
      facebook: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            return !v || /^[a-zA-Z0-9.]{5,50}$/.test(v);
          },
          message: 'Please enter a valid Facebook username'
        }
      }
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from same IP for same project
reviewSchema.index({ project: 1, ipAddress: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 