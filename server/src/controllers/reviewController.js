import { Review } from '../models/Review.js';
import Joi from 'joi';

const objectId = Joi.string().hex().length(24);
// TODO: write a validation schema for create/update per README.md section 2.
const createSchema = Joi.object({
  courseCode: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('',null),
  reviewedBy: objectId
});

const updateSchema = Joi.object({
  courseCode: Joi.string(),
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().allow('',null),
  reviewedBy: objectId
});
//req contains information about what the client asked for, res contains information about what the server is sending back to the client, next is a function that is used to pass control to the next middleware function in the stack
// GET /api/reviews
// TODO: implement per README.md section 3.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find() // all reviews not a specific course because no parameter is passed in the route
      .sort({ createdAt: -1 }) // -1 means descending order so newest to oldest, 1 means ascending order so oldest to newest
      .populate('reviewedBy'); // tells mongoose to replace the ObjectId in the reviewedBy field with the actual user document from the User collection

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id) // find the review by its id 
      .populate('reviewedBy');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/summary?courseCode=CS101
// TODO: implement per README.md section 4.
export async function getCourseSummary(req, res, next) {
  try {
    const { courseCode } = req.query; ///api/reviews/summary?courseCode=CS101 the part after the ? is called the qyery string and it is used to pass parameters to the server, in this case the courseCode parameter is passed to the server

    const result = await Review.aggregate([
      {
        $match: { courseCode } // match the courseCode field in the Review collection with the courseCode parameter passed in the query string
      },
      {
        $group: { // group the matched reviews by courseCode and calculate the average rating and review count
          _id: '$courseCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    const summary = result[0];

    if (!summary) {
      return res.json({
        courseCode,
        averageRating: null,
        reviewCount: 0
      });
    }

    res.json({
      courseCode,
      averageRating: summary.averageRating,
      reviewCount: summary.reviewCount
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
// TODO: implement per README.md section 3.
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const review = await Review.create(value);

    res.status(201).json({ review }); // 201 Created not 200 OK because a new resource has been created
  } catch (err) {
    next(err);
  }
}
// PATCH /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function updateReview(req, res, next) {
  try {
    const { value, error } = updateSchema.validate(
      req.body,
      { abortEarly: false, stripUnknown: true } // abortEarly: false means that Joi will return all validation errors instead of stopping at the first one, stripUnknown: true means that Joi will remove any keys that are not in the schema
    );

    if (error) {
      return res.status(400).json({ message: error.message }); 
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: value }, // $set operator is used to update the fields in the document with the values in value
      { new: true, runValidators: true } // new: true means that the updated document will be returned, runValidators: true means that the update will be validated against the schema
    ).populate('reviewedBy');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review });
  } catch (err) {
    next(err);
  }
}
// DELETE /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}