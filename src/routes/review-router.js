import express from 'express';
import {
  getAllReviews,
  getReviewById,
  getRepliesByReviewId,
  getReplyById,
} from '../controllers/review-controller.js';

const reviewRouter = express.Router();

reviewRouter.route('/').get(getAllReviews);
reviewRouter.route('/reply/all/:id').get(getRepliesByReviewId);
reviewRouter.route('/reply/:id').get(getReplyById);
reviewRouter.route('/:id').get(getReviewById);

export default reviewRouter;
