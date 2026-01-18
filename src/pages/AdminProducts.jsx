import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProducts.css";

const API_URL = "http://localhost:3001/api/products";

const categoryMap = {
  shoes: "Giày dép",
  clothes: "Quần áo",
  accessories: "Phụ kiện",
};

const genderMap = {
  men: "Nam",
  women: "Nữ",
  unisex: "Unisex",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    gender: "",
    images: ["", "", ""],
    sizes: [],
  });

  /* ============================
     LOAD PRODUCTS
  ============================ */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải sản phẩm:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ============================
     CATEGORY → AUTO SIZE
  ============================ */
  const getSizesByCategory = (cat) => {
    if (cat === "shoes") return [39, 40, 41, 42, 43];
    if (cat === "clothes") return ["S", "M", "L", "XL"];
    if (cat === "accessories") return ["Free Size"];
    return [];
  };

  /* ============================
     ADD PRODUCT
  ============================ */
  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const images = newProduct.images.filter((i) => i.trim());

    const productData = {
      id: Date.now().toString(),
      ...newProduct,
      price: Number(newProduct.price),
      images,
      sizes: getSizesByCategory(newProduct.category),
      stock: 10,
    };

    try {
      await axios.post(API_URL, productData);
      alert("✅ Thêm sản phẩm thành công");

      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        gender: "",
        images: ["", "", ""],
        sizes: [],
      });

      fetchProducts();
    } catch (err) {
      console.error("❌ Lỗi thêm sản phẩm:", err.message);
    }
  };

  /* ============================
     DELETE PRODUCT
  ============================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err.message);
    }
  };

  /* ============================
     SAVE EDIT
  ============================ */
  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `${API_URL}/${editingProduct.id}`,
        {
          ...editingProduct,
          price: Number(editingProduct.price),
          sizes: getSizesByCategory(editingProduct.category),
        }
      );

      setEditingProduct(null);
      fetchProducts();
      alert("✅ Cập nhật sản phẩm thành công");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err.message);
    }
  };

  /* ============================
     RENDER
  ============================ */
  return (
    <div className="admin-products">
      <h1>Quản lý sản phẩm</h1>

      {/* ================= ADD PRODUCT ================= */}
      <div className="add-product-form">
        <h3>+ Thêm sản phẩm mới</h3>

        <input
          placeholder="Tên sản phẩm"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Giá (VNĐ)"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        <select
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              category: e.target.value,
              sizes: getSizesByCategory(e.target.value),
            })
          }
        >
          <option value="">Chọn danh mục</option>
          <option value="shoes">Giày dép</option>
          <option value="clothes">Quần áo</option>
          <option value="accessories">Phụ kiện</option>
        </select>

        <select
          value={newProduct.gender}
          onChange={(e) =>
            setNewProduct({ ...newProduct, gender: e.target.value })
          }
        >
          <option value="">Chọn giới tính</option>
          <option value="men">Nam</option>
          <option value="women">Nữ</option>
          <option value="unisex">Unisex</option>
        </select>

        <textarea
          placeholder="Mô tả sản phẩm"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description: e.target.value,
            })
          }
        />

        {newProduct.images.map((img, i) => (
          <input
            key={i}
            placeholder={`Link ảnh ${i + 1}`}
            value={img}
            onChange={(e) => {
              const imgs = [...newProduct.images];
              imgs[i] = e.target.value;
              setNewProduct({ ...newProduct, images: imgs });
            }}
          />
        ))}

        <p>
          <b>Kích cỡ:</b>{" "}
          {newProduct.sizes.length
            ? newProduct.sizes.join(", ")
            : "Chưa có"}
        </p>

        <button onClick={handleAdd}>Thêm sản phẩm</button>
      </div>

      {/* ================= PRODUCT TABLE ================= */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Giới tính</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={p.images?.[0] || "https://via.placeholder.com/60"}
                  width="60"
                  alt=""
                />
              </td>
              <td>{p.name}</td>
              <td>{p.price?.toLocaleString()} ₫</td>
              <td>{categoryMap[p.category]}</td>
              <td>{genderMap[p.gender]}</td>
              <td>
                <button onClick={() => setEditingProduct(p)}>
                  ✏️ Sửa
                </button>
                <button onClick={() => handleDelete(p.id)}>
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= EDIT MODAL (DỌC) ================= */}
      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Chỉnh sửa sản phẩm</h3>

            <input
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: e.target.value,
                })
              }
            />

            <textarea
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />

            {editingProduct.images?.map((img, i) => (
              <input
                key={i}
                value={img}
                placeholder={`Link ảnh ${i + 1}`}
                onChange={(e) => {
                  const imgs = [...editingProduct.images];
                  imgs[i] = e.target.value;
                  setEditingProduct({
                    ...editingProduct,
                    images: imgs,
                  });
                }}
              />
            ))}

            <select
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
            >
              <option value="shoes">Giày dép</option>
              <option value="clothes">Quần áo</option>
              <option value="accessories">Phụ kiện</option>
            </select>

            <select
              value={editingProduct.gender}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  gender: e.target.value,
                })
              }
            >
              <option value="men">Nam</option>
              <option value="women">Nữ</option>
              <option value="unisex">Unisex</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleSaveEdit}>💾 Lưu</button>
              <button onClick={() => setEditingProduct(null)}>
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
