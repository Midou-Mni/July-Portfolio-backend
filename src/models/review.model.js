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