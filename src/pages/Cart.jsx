import React, { useState, useEffect } from "react";
import "./CartPage.css";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [user] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [coords, setCoords] = useState(null);

  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(
    JSON.parse(localStorage.getItem("selectedVoucher")) || null
  );
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);

  /* ===============================
     ĐỒNG BỘ LOCALSTORAGE
  =============================== */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(updatedCart);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ===============================
     LOAD VOUCHER
  =============================== */
  useEffect(() => {
    fetch("http://localhost:5000/api/vouchers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVouchers(data);
        } else {
          setVouchers([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải voucher:", err);
        setVouchers([]);
      });
  }, []);

  /* ===============================
     LẤY TOẠ ĐỘ ĐỊA CHỈ
  =============================== */
  useEffect(() => {
    if (address.trim().length < 5) return;

    const timer = setTimeout(async () => {
      try {
        const query = encodeURIComponent(address);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=VN&limit=1`
        );
        const data = await res.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCoords([parseFloat(lat), parseFloat(lon)]);
          toast.info("📍 Đã xác định toạ độ giao hàng!", { autoClose: 2000 });
        } else {
          setCoords(null);
          toast.warn("⚠️ Không tìm thấy địa chỉ này!", { autoClose: 2500 });
        }
      } catch (err) {
        console.error("Lỗi khi tìm toạ độ:", err);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [address]);

  /* ===============================
     THAY ĐỔI SỐ LƯỢNG
  =============================== */
  const handleQtyChange = (productId, newQty, size) => {
    if (newQty < 1) return;

    setCart((prevCart) => {
      const updated = prevCart.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: newQty }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  /* ===============================
     XOÁ SẢN PHẨM
  =============================== */
  const handleRemove = (productId, size) => {
    setCart((prevCart) => {
      const updated = prevCart.filter(
        (item) => !(item.productId === productId && item.size === size)
      );

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    toast.info("🗑️ Đã xóa sản phẩm khỏi giỏ hàng!");
  };

  /* ===============================
     TÍNH TỔNG
  =============================== */
  const total = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const discountedTotal = (() => {
    if (!selectedVoucher) return total;
    if (total < selectedVoucher.minOrderValue) return total;

    if (selectedVoucher.discountType === "percent") {
      return total - (total * selectedVoucher.discountValue) / 100;
    }

    if (selectedVoucher.discountType === "fixed") {
      return Math.max(total - selectedVoucher.discountValue, 0);
    }

    if (selectedVoucher.discountType === "freeship") {
      return total;
    }

    return total;
  })();

  /* ===============================
     THANH TOÁN
  =============================== */
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.warn("🛒 Giỏ hàng đang trống!");
      return;
    }

    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ!");
      return;
    }

    const phoneRegex = /^(0[0-9]{9})$/;
    if (!phoneRegex.test(phone.trim())) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    if (!coords) {
      toast.warn("Vui lòng chờ xác định toạ độ giao hàng!");
      return;
    }

    const loadingToast = toast.loading("Đang xử lý thanh toán...");

    try {
      const order = {
        id: String(Date.now()),
        userId: user?._id ? String(user._id) : null,
        userName: user?.name || "Khách vãng lai",
        address: address.trim(),
        phone: phone.trim(),
        coords,
        items: cart.map((item) => ({
          productId: String(item.productId),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || "Free",
          image: item.image,
        })),
        total: discountedTotal,
        voucher: selectedVoucher?.code || null,
        status: "pending",
        deliveryStatus: "preparing",
        createdAt: new Date().toISOString(),
      };

      await new Promise((r) => setTimeout(r, 1500));

      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      toast.dismiss(loadingToast);
      toast.success("Thanh toán thành công!", {
        position: "top-center",
        autoClose: 2500,
      });

      setCart([]);
      localStorage.removeItem("cart");
      localStorage.removeItem("selectedVoucher");

      setTimeout(() => {
        window.location.href = "/orders";
      }, 2500);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Lỗi thanh toán:", error);
      toast.error("Lỗi khi xử lý thanh toán!", { position: "top-center" });
    }
  };

  /* ===============================
     CHỌN VOUCHER
  =============================== */
  const handleSelectVoucher = (voucher) => {
    if (total < voucher.minOrderValue) {
      toast.warn("Đơn hàng chưa đủ điều kiện áp dụng voucher này!");
      return;
    }

    setSelectedVoucher(voucher);
    localStorage.setItem("selectedVoucher", JSON.stringify(voucher));

    toast.success(`Đã chọn mã: ${voucher.code}`);
    setShowVoucherPopup(false);
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    localStorage.removeItem("selectedVoucher");
    toast.info("Đã bỏ chọn voucher!");
  };

  return (
    <div className="cart-container">
      <h1>🛍️ Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Giỏ hàng của bạn đang trống.</p>
          <a href="/" className="continue-btn">
            Tiếp tục mua sắm
          </a>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />

                <div className="cart-item-info">
                  <h2>{item.name}</h2>

                  {item.size && (
                    <p className="cart-size">
                      <strong>Size:</strong> {item.size}
                    </p>
                  )}

                  <p className="price">{Number(item.price).toLocaleString()}₫</p>

                  <div className="qty-control">
                    <button
                      onClick={() =>
                        handleQtyChange(item.productId, item.quantity - 1, item.size)
                      }
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQtyChange(
                          item.productId,
                          Number(e.target.value),
                          item.size
                        )
                      }
                    />

                    <button
                      onClick={() =>
                        handleQtyChange(item.productId, item.quantity + 1, item.size)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <p>{(Number(item.price) * item.quantity).toLocaleString()}₫</p>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.productId, item.size)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ĐỊA CHỈ */}
          <div className="address-section">
            <label>Địa chỉ giao hàng:</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ chi tiết của bạn..."
              rows="3"
              className="address-input"
            />

            <label>Số điện thoại liên hệ:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại của bạn..."
              className="phone-input"
            />

            {coords && (
              <p style={{ marginTop: "10px", color: "green" }}>
                📍 Toạ độ: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
              </p>
            )}
          </div>

          {/* VOUCHER */}
          <div className="voucher-section">
            <p>
              Mã giảm giá:{" "}
              {selectedVoucher ? (
                <strong>{selectedVoucher.code}</strong>
              ) : (
                <em>Chưa chọn</em>
              )}
            </p>

            <div className="voucher-actions">
              <button
                className="select-voucher-btn"
                onClick={() => setShowVoucherPopup(true)}
              >
                {selectedVoucher ? "Chọn lại voucher" : "Chọn voucher"}
              </button>

              {selectedVoucher && (
                <button className="remove-voucher-btn" onClick={handleRemoveVoucher}>
                  Bỏ voucher
                </button>
              )}
            </div>
          </div>

          {/* TỔNG */}
          <div className="cart-summary">
            <div className="summary-info">
              <p>Tổng cộng:</p>
              <h2>
                {discountedTotal.toLocaleString()}₫{" "}
                {selectedVoucher && discountedTotal !== total && (
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#888",
                      fontSize: "0.9rem",
                      marginLeft: "8px",
                    }}
                  >
                    {total.toLocaleString()}₫
                  </span>
                )}
              </h2>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Thanh toán (COD)
            </button>
          </div>

          {/* POPUP VOUCHER */}
          {showVoucherPopup && (
            <div className="voucher-modal">
              <div className="voucher-content">
                <h3>🎟️ Chọn mã giảm giá</h3>

                <div className="voucher-list">
                  {vouchers.map((v) => (
                    <div
                      key={v._id || v.id}
                      className="voucher-item"
                      onClick={() => handleSelectVoucher(v)}
                    >
                      <img src={v.image} alt={v.code} />

                      <div>
                        <h4>{v.title}</h4>
                        <p>{v.description}</p>
                        <small>HSD: {v.expiryDate}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="close-voucher-btn"
                  onClick={() => setShowVoucherPopup(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ToastContainer />
    </div>
  );
}