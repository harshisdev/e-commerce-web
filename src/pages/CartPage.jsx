import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = ({ cartItems: initialCartItems, onCartUpdate }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems || []);
  const [allSelected, setAllSelected] = useState(true);

  // Optional: Sync with prop updates (if cartItems are passed from parent and change dynamically)
  useEffect(() => {
    if (initialCartItems?.length) {
      const itemsWithSelection = initialCartItems.map((item) => ({
        ...item,
        selected: item.selected ?? true, // default to true
      }));
      setCartItems(itemsWithSelection);
    } else {
      setCartItems([]);
    }
  }, [initialCartItems]);

  const handleShopNow = () => {
    onCartUpdate([]);
    navigate("/");
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    onCartUpdate(updatedCart); // ✅ update header
    if (updatedCart.length === 0) {
      navigate("/");
    }
  };

  const proceedToCheckout = () => {
    toast.success("Order placed successfully!");
    setCartItems([]);
    if (onCartUpdate) onCartUpdate([]);
    navigate("/");
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => (item.selected ? sum + item.quantity * item.price : sum),
    0
  );

  const totalQuantity = cartItems.reduce(
    (sum, item) => (item.selected ? sum + item.quantity : sum),
    0
  );

  const toggleSelect = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updated);
  };

  const toggleSelectAll = () => {
    const newSelected = !allSelected;
    setCartItems(cartItems.map((item) => ({ ...item, selected: newSelected })));
    setAllSelected(newSelected);
  };

  useEffect(() => {
    const allChecked = cartItems.every((item) => item.selected);
    setAllSelected(allChecked);
  }, [cartItems]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <h2 className="mb-4">🛒 Your Cart</h2>
        </div>
        {cartItems.length > 0 && (
          <div className="col-auto d-flex align-items-center">
            <input
              type="checkbox"
              checked={allSelected}
              id="selectAll"
              onChange={toggleSelectAll}
              className="form-check-input me-2"
            />
            <label htmlFor="selectAll" className="form-check-label">
              Select All
            </label>
          </div>
        )}
      </div>
      {cartItems.length === 0 ? (
        <>
          <p>Your cart is empty.</p>
          <button className="btn btn-outline-primary" onClick={handleShopNow}>
            Shop Now
          </button>
        </>
      ) : (
        <>
          <div className="row">
            {cartItems.map((item) => (
              <div className="col-12 mb-3" key={item.id}>
                <div
                  className={`card p-3 d-flex flex-row align-items-center ${
                    item.selected ? "bg-light shadow" : "bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                    className="form-check-input opacity-0 w-75 h-100 position-absolute top-0 bottom-0 start-0 "
                  />
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                    className="me-3"
                  />
                  <div className="flex-grow-1 w-75">
                    <h5>{item.title}</h5>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Price: ${item.price} x {item.quantity} ={" "}
                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </p>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-end mt-2">
            <h4 className="fs-4">Total Quantity: {totalQuantity}</h4>
            <h4 className="fs-4">Total: ${totalPrice.toFixed(2)}</h4>
          </div>
          <div className="row">
            <div className="col">
              <Link to="/" className="btn btn-outline-primary">
                Back To Page
              </Link>
            </div>
            <div className="col d-flex justify-content-end">
              <button className="btn btn-success" onClick={proceedToCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
