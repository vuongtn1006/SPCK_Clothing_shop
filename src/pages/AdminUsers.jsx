import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUsers.css";

const API_URL = "http://localhost:5000/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  /* =========================
     LOAD USERS
  ========================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi tải user:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =========================
     TOGGLE ACTIVE
  ========================= */
  const toggleStatus = async (user) => {
    try {
      await axios.put(`${API_URL}/${user._id}/status`, {
        isActive: !user.isActive,
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi update:", err.message);
    }
  };

  /* =========================
     DELETE USER
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá user này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi xoá:", err.message);
    }
  };

  /* =========================
     FILTER + PAGINATION
  ========================= */
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="admin-users-container">
      <div className="card">
        <div className="card-header">
          <h2> Quản lý người dùng</h2>
          <span className="user-count">
            {filteredUsers.length} users
          </span>
        </div>

        {/* SEARCH */}
        <div className="toolbar">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Role</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((u) => (
                <tr key={u._id}>
                  <td className="name">{u.name}</td>
                  <td>{u.email}</td>

                  <td>
                    <span className={`role ${u.role}`}>
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        u.isActive
                          ? "badge active"
                          : "badge inactive"
                      }
                    >
                      {u.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>

                  <td className="actions">
                    <button
                      className={
                        u.isActive
                          ? "btn warning"
                          : "btn success"
                      }
                      onClick={() => toggleStatus(u)}
                    >
                      {u.isActive ? "Khóa" : "Mở"}
                    </button>

                    <button
                      className="btn danger"
                      onClick={() => handleDelete(u._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Prev
          </button>

          <span>
            Trang {currentPage} / {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;