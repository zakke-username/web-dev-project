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

    const { title, rating, text = null, picture_filename = null } = req.body;

    if (!title || rating == null) {
      const error = new Error('Missing required information');
      error.status = 400;
      return next(error);
    }

    const result = await Reviews.postReview({
      user_id: req.user.id,
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

export const deleteReview = async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const id = parseInt(req.params.id);
    const review = await Reviews.getReviewById(id);
    if (!review) return res.sendStatus(404);

    if (req.user.id !== review.user_id && req.user.role !== 'admin')
      return res.sendStatus(403);

    const result = await Reviews.deleteReview(id);
    if (!result) return res.sendStatus(500);

    return res.status(200).json({ message: 'Succesfully deleted review' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const postReply = async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const review = await Reviews.getReviewById(req.params.id);
    if (!review) {
      const error = new Error('Review not found');
      error.status = 404;
      return next(error);
    }

    const { text } = req.body;
    if (!text.trim()) {
      const error = new Error('Missing text');
      error.status = 400;
      return next(error);
    }

    const result = await Reviews.postReply({
      userId: req.user.id,
      reviewId: review.review_id,
      text: text.trim(),
    });

    if (!result) return next(new Error('Could not post review'));

    return res.status(201).json({ message: 'Reply posted successfully' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
