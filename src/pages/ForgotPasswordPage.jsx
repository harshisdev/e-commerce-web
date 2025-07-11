import { useEffect, useState } from "react";
import { userProfileGetApi, userUpdateApi } from "../action/productApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import BreadCrumb from "../component/BreadCrumb";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const res = await userProfileGetApi(userId);
          if (res) {
            setEmail(res.email || "");
            setName(res.name || "");
            setRole(res.role || "");
            setAvatar(res.avatar || "");
            setOldPassword(res.password || "");
          } else {
            toast.error("ID is wrong.");
          }
        } catch (error) {
          toast.error("Failed to fetch user.");
          console.error("User Not Found", error);
        }
      };

      fetchUser();
    }
  }, [userId]);

  const handleForgot = async (e) => {
    e.preventDefault();

    if (!userId) return toast.error("User ID is required.");
    if (!newPassword) return toast.error("Please enter a new password.");

    setLoading(true);

    const payload = {
      email,
      name,
      password: newPassword,
      role,
      avatar,
    };

    try {
      const res = await userUpdateApi(userId, payload);
      if (res?.id) {
        toast.success("Password updated successfully!");
        navigate("/login", { state: { userId: res.id } });
      } else {
        toast.error("Failed to update password.");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Forgot Password", active: true },
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
            <h4 className="mb-3 text-center">Forgot Password</h4>
            {name && <p className="text-center text-primary">Hey, {name}</p>}
            <form onSubmit={handleForgot}>
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                  User ID
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>

              {userId && (
                <>
                  <div className="mb-3">
                    <label htmlFor="oldPassword" className="form-label">
                      Old Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        className="form-control"
                        id="oldPassword"
                        value={oldPassword}
                        disabled
                      />
                      <span
                        className="input-group-text"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showOldPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="form-control"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <span
                        className="input-group-text"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>
                    </div>
                  </div>
                </>
              )}

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
                      Updating...
                    </>
                  ) : (
                    "Update Password"
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

export default ForgotPasswordPage;
