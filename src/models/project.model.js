const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: [{
      type: String,
      required: true,
    }],
    category: {
      type: String,
      default: 'dev'
    },
    imageUrl: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
projectSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'project',
  justOne: false,
});

// Method to get average rating
projectSchema.methods.getAverageRating = async function () {
  const reviews = await mongoose.model('Review').find({ project: this._id });
  
  if (reviews.length === 0) {
    return 0;
  }
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 