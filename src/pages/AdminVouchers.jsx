import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminVouchers.css";

/* ============================
   API EXPRESS BACKEND
============================ */
const API_URL = "http://localhost:3001/api/vouchers";

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    discountType: "percent",
    discountValue: "",
    minOrderValue: "",
    expiryDate: "",
    image: "",
  });

  /* ============================
     LOAD VOUCHERS
  ============================ */
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await axios.get(API_URL);
      setVouchers(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải voucher:", error.message);
    }
  };

  /* ============================
     FORM CHANGE
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* ============================
     ADD / UPDATE VOUCHER
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVoucher) {
        await axios.put(
          `${API_URL}/${editingVoucher.id}`,
          form
        );
      } else {
        const newVoucher = {
          id: Date.now().toString(),
          ...form,
          discountValue: Number(form.discountValue),
          minOrderValue: Number(form.minOrderValue),
        };

        await axios.post(API_URL, newVoucher);
      }

      resetForm();
      fetchVouchers();
    } catch (error) {
      console.error("❌ Lỗi khi lưu voucher:", error.message);
      alert("Không thể lưu voucher!");
    }
  };

  /* ============================
     EDIT
  ============================ */
  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setForm({ ...voucher });
  };

  /* ============================
     DELETE
  ============================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá voucher này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchVouchers();
    } catch (error) {
      console.error("❌ Lỗi khi xoá voucher:", error.message);
    }
  };

  /* ============================
     RESET
  ============================ */
  const resetForm = () => {
    setForm({
      code: "",
      title: "",
      description: "",
      discountType: "percent",
      discountValue: "",
      minOrderValue: "",
      expiryDate: "",
      image: "",
    });
    setEditingVoucher(null);
  };

  /* ============================
     RENDER
  ============================ */
  return (
    <div className="voucher-admin">
      <h2 className="title">Quản lý Voucher</h2>

      {/* ===== FORM ===== */}
      <form className="voucher-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mã voucher</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tiêu đề</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Loại giảm giá</label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
          >
            <option value="percent">Giảm %</option>
            <option value="fixed">Giảm cố định (₫)</option>
            <option value="freeship">Miễn phí ship</option>
          </select>
        </div>

        <div className="form-group">
          <label>Giá trị giảm</label>
          <input
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Đơn tối thiểu</label>
          <input
            type="number"
            name="minOrderValue"
            value={form.minOrderValue}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ngày hết hạn</label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full">
          <label>Link ảnh</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit">
          {editingVoucher ? "Cập nhật voucher" : "+ Thêm voucher mới"}
        </button>
      </form>

      {/* ===== LIST ===== */}
      <div className="voucher-list">
        {vouchers.map((v) => (
          <div key={v.id} className="voucher-card">
            <img
              src={
                v.image || "https://via.placeholder.com/280x160"
              }
              alt={v.title}
              className="voucher-image"
            />

            <h3>{v.title}</h3>
            <p className="desc">{v.description}</p>

            <p><b>Mã:</b> {v.code}</p>

            <p>
              <b>Giảm:</b>{" "}
              {v.discountType === "percent"
                ? `${v.discountValue}%`
                : v.discountType === "fixed"
                ? `${v.discountValue.toLocaleString()} ₫`
                : "Miễn phí ship"}
            </p>

            <p><b>Đơn tối thiểu:</b> {v.minOrderValue.toLocaleString()} ₫</p>
            <p><b>HSD:</b> {v.expiryDate}</p>

            <div className="action-buttons">
              <button
                className="btn-edit"
                onClick={() => handleEdit(v)}
              >
                Sửa
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(v.id)}
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVouchers;
