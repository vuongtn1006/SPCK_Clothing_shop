import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = createContext();


const API_BASE = "http://localhost:5000/api/favorites";

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const syncUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUserId(storedUser?._id || null); 
    };

    syncUser();
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);


  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${API_BASE}?userId=${userId}`);
        setFavorites(res.data);
      } catch (err) {
        console.error("Lỗi tải favorites:", err.message);
      }
    };

    fetchFavorites();
  }, [userId]);

  const toggleFavorite = async (product) => {
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm sản phẩm yêu thích!");
      return;
    }

    try {
      // kiểm tra đã tồn tại chưa
      const existing = favorites.find(
        (f) => f.productId === product._id
      );

    
      if (existing) {
        await axios.delete(`${API_BASE}/${existing._id}`);

        setFavorites((prev) =>
          prev.filter((f) => f.productId !== product._id)
        );
      }
      
      else {
        const res = await axios.post(API_BASE, {
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          image:
            product.images?.[0] ||
            product.image ||
            "https://via.placeholder.com/400x300?text=No+Image",
        });

        setFavorites((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error("Lỗi cập nhật favorite:", err.message);
    }
  };


  const isFavorite = (productId) => {
    return favorites.some((f) => f.productId === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);