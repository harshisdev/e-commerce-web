import React, { useEffect } from "react";
import { userRegisterApi } from "../action/productApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const userData = {
      email: form.get("email"),
      name: form.get("name"),
      password: form.get("password"),
      role: form.get("role"),
      avatar: form.get("avatar"),
    };

    const registerUser = async () => {
      try {
        const data = await userRegisterApi(userData);
        toast.success("Registration Successfully!");
        navigate("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Registration failed. Please try again.");
      }
    };

    registerUser();
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken]);

  return (
    <div className="container d-flex justify-content-center align-items-center minHeight">
      <div
        className="card p-4 shadow-lg mt-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Register</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select className="form-select" name="role" id="role" required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="avatar" className="form-label">
              Avatar URL
            </label>
            <input
              type="url"
              className="form-control"
              name="avatar"
              id="avatar"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
