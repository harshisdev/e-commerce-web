import React, { useEffect, useState } from "react";
import { userProfileGetApi, userUpdateApi } from "../action/productApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const UpdateProfile = () => {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await userProfileGetApi(id);
        setEmail(res.email || "");
        setName(res.name || "");
        setAvatar(res.avatar || "");
        setPassword(res.password || "");
        setRole(res.role || "");
      } catch (error) {
        console.error("Profile Get failed:", error);
      }
    };

    getUserProfile();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      name,
      role,
      avatar,
    };

    if (password) userData.password = password;

    const updateUser = async () => {
      try {
        await userUpdateApi(id, userData);
        toast.success("Profile Update Successfully!");
      } catch (error) {
        console.error("Profile Update failed:", error);
        toast.error("Profile Update failed. Please try again.");
      }
    };

    updateUser();
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [!accessToken]);

  return (
    <div className="container d-flex justify-content-center align-items-center minHeight">
      <div
        className="card p-4 shadow-lg mt-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Update</h4>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              style={{
                position: "absolute",
                top: "38px",
                right: "15px",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>

            <select
              className="form-select"
              name="role"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
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
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
