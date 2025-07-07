// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import ProductCard from "./component/ProductCard";
import CartPage from "./pages/CartPage";
import ProductView from "./pages/ProductView";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Footer from "./component/Footer";
const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product, quantity) => {
    setCartItems((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                selected: true, // optional: reselect if added again
              }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity, selected: true }];
      }
    });
  };

  return (
    <Router>
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <Routes>
        <Route
          path="/"
          element={<ProductCard onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={
            <CartPage cartItems={cartItems} onCartUpdate={setCartItems} />
          }
        />
        <Route path="/product-view/:id" element={<ProductView />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;
