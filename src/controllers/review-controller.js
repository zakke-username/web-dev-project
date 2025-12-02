import * as Reviews from '../models/review-model.js';

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Reviews.getAllReviews();
    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const review = await Reviews.getReviewById(id);
    if (!review) {
      const error = new Error('Could not find review');
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(review);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getRepliesByReviewId = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const replies = await Reviews.getRepliesByReviewId(id);
    return res.status(200).json(replies);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getReplyById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const reply = await Reviews.getReplyById(id);
    if (!reply) {
      const error = new Error('Reply not found');
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(reply);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const postReview = async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const {
      user_id,
      title,
      rating,
      text = null,
      picture_filename = null,
    } = req.body;

    if (!user_id || !title || rating == null) {
      const error = new Error('Missing required information');
      error.status = 400;
      return next(error);
    }

    const result = await Reviews.postReview({
      user_id,
      title,
      rating,
      text,
      picture_filename,
    });

    if (!result) return next(new Error('Error: could not post review'));

    res.status(201).json({ message: 'Successfully posted review' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
