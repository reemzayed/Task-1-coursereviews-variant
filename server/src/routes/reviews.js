import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  getCourseSummary,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = Router();

// TODO: wire up the routes described in README.md section 3.
router.get('/', getAllReviews);

router.get('/summary', getCourseSummary); // '/summary' : static route 

router.get('/:id', getReview); // '/:id' : dynamic route , broad enough to match any route that starts with /api/reviews/ so it should be placed after the static route '/summary' to avoid conflicts

router.post('/', createReview);

router.patch('/:id', updateReview);

router.delete('/:id', deleteReview);

export default router;
