import { useEffect, useState } from "react";
import { userRegisterApi } from "../action/productApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("accessToken");

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (!name) {
      toast.error("Name is required.");
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      return;
    }
    if (!role) {
      toast.error("Role is required.");
      return;
    }
    if (!avatar) {
      toast.error("Avatar url is required.");
      return;
    }

    setLoading(true);
    const registerUser = async () => {
      const payload = {
        email: email,
        name: name,
        password: password,
        role: role,
        avatar: avatar,
      };
      try {
        await userRegisterApi(payload);
        toast.success("Registration Successfully!");
        navigate("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    registerUser();
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="container d-flex justify-content-center align-items-center minHeight">
      <div
        className="card p-4 shadow-lg mt-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Register</h4>
        <form onSubmit={handleRegister}>
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
              minLength={5}
              maxLength={10}
            />
            {password.length > 0 && (
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
            )}
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

          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-outline-primary px-3 rounded-5"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
