import mongoose from 'mongoose';

// TODO: define the Review schema per README.md section 1.

const reviewSchema = new mongoose.Schema(
  {
    // TODO
    courseCode: { 
      type: String, 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String,
    }, //optional so no need to include required: false because it is false by default
    reviewedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    } //optional 
  },
  { timestamps: true }

);
// TODO: add the uniqueness constraint described in README.md section 1.
reviewSchema.index(
      { courseCode: 1, reviewedBy: 1 }, 
      { unique: true }
);

export const Review = mongoose.model('Review', reviewSchema);
