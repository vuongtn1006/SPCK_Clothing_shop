import React from "react";

export default function Filters({ q, setQ, min, setMin, max, setMax }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-3">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm kiếm tên..." className="border px-3 py-2 rounded w-60" />
      <input type="number" value={min} onChange={e=>setMin(e.target.value)} placeholder="Giá từ" className="border px-3 py-2 rounded w-36" />
      <input type="number" value={max} onChange={e=>setMax(e.target.value)} placeholder="Giá đến" className="border px-3 py-2 rounded w-36" />
    </div>
  );
}
