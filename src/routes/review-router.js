import express from 'express';
import { body } from 'express-validator';
import { validationErrors } from '../middlewares/validation.js';
import { authenticateToken } from '../middlewares/auth.js';
import { upload, createImage, createThumbnail } from '../middlewares/images.js';
import {
  getAllReviews,
  getReviewById,
  getRepliesByReviewId,
  getReplyById,
  postReview,
  deleteReview,
  postReply,
} from '../controllers/review-controller.js';

const reviewRouter = express.Router();

/**
 * @api {get} /review Get all reviews
 * @apiName GetReviews
 * @apiGroup Review
 * @apiSuccess {Object[]} reviews
 */
reviewRouter
  .route('/')
  .get(getAllReviews)

  /**
   * @api {post} /review Post new review
   * @apiName PostReview
   * @apiGroup Review
   * @apiBody {String} title
   * @apiBody {String} description
   * @apiBody {Number} rating
   * @apiBody {File} review-image Optional image
   */
  .post(
    authenticateToken,
    upload.single('review-image'),
    createImage,
    createThumbnail,
    body('title').trim().isLength({ min: 2, max: 255 }),
    body('text').optional({ checkFalsy: true }).trim().isLength({ max: 10000 }),
    validationErrors,
    postReview
  );

/**
 * @api {get} /review/:id/reply Get all replies by review ID
 * @apiName GetReviewReplies
 * @apiGroup Review
 * @apiParam {Number} id Review ID
 * @apiSuccess {Object[]} replies
 */
reviewRouter
  .route('/:id/reply')
  .get(getRepliesByReviewId)

  /**
   * @api {post} /review/:id/reply Post comment/reply to review
   * @apiName PostReply
   * @apiGroup Review
   * @apiParam {Number} id Review ID
   * @apiBody {String} text
   */
  .post(
    body('text').trim().isLength({ max: 10000 }),
    validationErrors,
    authenticateToken,
    postReply
  );

/**
 * @api {get} /review/reply/:id Get reply by ID
 * @apiName GetReply
 * @apiGroup Reply
 * @apiParam {Number} id Reply ID
 * @apiSuccess {Object} reply
 * @apiSuccess {Number} reply.review_reply_id
 * @apiSuccess {Number} reply.user_id Poster's user ID
 * @apiSuccess {Number} reply.review_id Review ID
 * @apiSuccess {String} reply.text
 * @apiSuccess {Number} reply.likes
 */
reviewRouter.route('/reply/:id').get(getReplyById);

/**
 * @api {get} /review/:id Get review by ID
 * @apiName GetReview
 * @apiGroup Review
 * @apiParam {Number} id Review ID
 * @apiSuccess {Object} review
 * @apiSuccess {Number} review.review_id
 * @apiSuccess {Number} review.user_id Poster's user ID
 * @apiSuccess {String} review.title
 * @apiSuccess {String} review.text
 * @apiSuccess {Number} review.rating
 * @apiSuccess {Number} review.likes
 * @apiSuccess {String} review.picture_filename
 */
reviewRouter
  .route('/:id')
  .get(getReviewById)

  /**
   * @api {Delete} /review/:id Delete review by ID
   * @apiName DeleteReview
   * @apiGroup Review
   * @apiHeader {String} Authorization Bearer token
   * @apiParam {Number} id Review ID
   */
  .delete(authenticateToken, deleteReview);

export default reviewRouter;
