import React from "react";


export default function ReviewList({ reviews }) {
  if (!reviews.length)
    return <div className="no-review">Chưa có đánh giá nào.</div>;

  return (
    <div className="review-box">
      <h3 className="review-box-title">Đánh giá từ khách hàng</h3>
      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id} className="review-card">
            <div className="review-header">
              <span className="review-user">{r.userName}</span>
              <span className="review-rating">⭐ {r.rating}/5</span>
            </div>
            <p className="review-comment">{r.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
