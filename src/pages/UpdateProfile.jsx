import { useEffect, useState } from "react";
import { userProfileGetApi, userUpdateApi } from "../action/productApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import BreadCrumb from "../component/BreadCrumb";
import { useDispatch } from "react-redux";
import { userNameUpdate, userRoleUpdate } from "../app/slice/userSlice";

const UpdateProfile = () => {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const dispatch = useDispatch();

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

  const handleUpdate = (e) => {
    e.preventDefault();
    const userData = {
      email,
      name,
      role,
      avatar,
    };
    setLoading(true);

    if (password) userData.password = password;

    const updateUser = async () => {
      try {
        await userUpdateApi(id, userData);
        dispatch(userRoleUpdate(role));
        dispatch(userNameUpdate(name));
        toast.success("Profile Update Successfully!");
      } catch (error) {
        console.error("Profile Update failed:", error);
        toast.error("Profile Update failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    updateUser();
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [!accessToken]);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Update Profile", active: true },
  ];

  return (
    <div className="container minHeight mb-4">
      <div className="row my-4">
        <div className="col-12">
          <BreadCrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-center">
          <div
            className="card p-4 shadow-lg"
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <h4 className="mb-3 text-center">Update</h4>
            <form onSubmit={handleUpdate}>
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
                  tabIndex={1}
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
                  tabIndex={2}
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
                  tabIndex={3}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "38px",
                    right: "15px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword((prev) => !prev)}
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
                  tabIndex={4}
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
                  tabIndex={5}
                />
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-outline-primary px-3 rounded-5"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updateing Profile...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
