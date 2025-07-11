import { toast } from "react-toastify";
import { loginUserApi } from "../action/productApi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import BreadCrumb from "../component/BreadCrumb";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("accessToken");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      return;
    }
    setLoading(true);
    const loginUser = async () => {
      const payload = {
        email: email,
        password: password,
      };
      try {
        const data = await loginUserApi(payload);
        if (data && data.access_token) {
          const token = data.access_token;
          sessionStorage.setItem("accessToken", token);
          toast.success("Login Successfully!");
          navigate("/");
        } else {
          toast.error("Login failed. No token received.");
        }
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Oops! credentials are incorrect.");
        setEmail("");
        setPassword("");
      } finally {
        setLoading(false);
      }
    };

    loginUser();
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Login", active: true },
  ];

  return (
    <div className="container minHeight">
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
            <h4 className="mb-3 text-center">Login</h4>
            <form onSubmit={handleLogin}>
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
                  tabIndex={1}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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
                  tabIndex={2}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
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

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-outline-primary px-3 rounded-5 d-flex align-items-center gap-2"
                  disabled={loading}
                  tabIndex={3}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Link to="/register" className="text-danger">
                  Register here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
