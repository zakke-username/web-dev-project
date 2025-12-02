import pool from '../utils/database.js';

export const getAllReviews = async () => {
  const [reviews] = await pool.execute('SELECT * FROM reviews');
  return reviews;
};

export const getReviewById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM reviews WHERE review_id = ?',
    [id]
  );
  if (!rows.length) return false;
  return rows[0];
};

export const getRepliesByReviewId = async (id) => {
  const [replies] = await pool.execute(
    'SELECT * FROM review_replies WHERE review_id = ?',
    [id]
  );
  return replies;
};

export const getReplyById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM review_replies WHERE review_reply_id = ?',
    [id]
  );
  if (!rows.length) return false;
  return rows[0];
};

export const postReview = async ({
  user_id,
  title,
  text,
  rating,
  picture_filename,
}) => {
  const [result] = await pool.execute(
    'INSERT INTO reviews (user_id, title, text, rating, picture_filename) VALUES (?, ?, ?, ?, ?)',
    [user_id, title, text, rating, picture_filename]
  );
  if (result.affectedRows === 0) return false;
  return { id: result.insertId };
};

export const postReply = async ({ userId, reviewId, text }) => {
  const [result] = await pool.execute(
    'INSERT INTO review_replies (user_id, review_id, text) VALUES (?, ?, ?',
    [userId, reviewId, text]
  );
  if (result.affectedRows === 0) return false;
  return { id: result.insertId };
};
