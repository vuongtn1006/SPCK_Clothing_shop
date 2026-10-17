import React, { useEffect, useState } from "react";
import banner1 from "../assets/banner4.jpg";
import banner2 from "../assets/banner5.jpg";
import banner3 from "../assets/banner6.jpg";
import "./Banner.css";

const images = [banner1, banner2, banner3];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // đổi ảnh mỗi 3 giây
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-container">
      <img src={images[current]} alt="Banner" className="banner-image" />
    </div>
  );
};

export default Banner;
