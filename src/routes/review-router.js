import express from 'express';
import { body } from 'express-validator';
import { validationErrors } from '../middlewares/validation.js';
import { authenticateToken } from '../middlewares/auth.js';
import {
  getAllReviews,
  getReviewById,
  getRepliesByReviewId,
  getReplyById,
  postReview,
} from '../controllers/review-controller.js';

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(
    body('title').trim().isLength({ min: 2, max: 255 }),
    body('text').optional({ checkFalsy: true }).trim().isLength({ max: 10000 }),
    validationErrors,
    authenticateToken,
    postReview
  );
reviewRouter.route('/:id/reply').get(getRepliesByReviewId);
reviewRouter.route('/reply/:id').get(getReplyById);
reviewRouter.route('/:id').get(getReviewById);

export default reviewRouter;
