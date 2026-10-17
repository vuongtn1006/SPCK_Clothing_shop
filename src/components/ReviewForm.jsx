import React, { useState } from "react";


export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Vui lòng nhập đánh giá!");
    onSubmit(rating, comment);
    setComment("");
    setRating(5);
  };

  return (
    <form onSubmit={submit} className="review-form">
      <label>Chọn số sao:</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="review-select"
      >
        {[5, 4, 3, 2, 1].map((v) => (
          <option key={v} value={v}>
            {v} sao
          </option>
        ))}
      </select>

      <label>Nhận xét của bạn:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Viết cảm nhận..."
        className="review-textarea"
      />

      <button type="submit" className="review-submit-btn">
        Gửi đánh giá
      </button>
    </form>
  );
}
