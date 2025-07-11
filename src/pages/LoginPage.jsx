import { toast } from "react-toastify";
import { loginUserApi, userProfileGetApi } from "../action/productApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import BreadCrumb from "../component/BreadCrumb";
import TermsAndConditions from "./TermsAndConditionsPage";
import { Button, Modal } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsCondition, setTermsCondition] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termModal, setTermModal] = useState(false);
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    const userProfileGet = async () => {
      if (!userId) return;

      try {
        const res = await userProfileGetApi(userId);
        if (res) {
          setEmail(res.email);
          setPassword(res.password);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    };
    userProfileGet();
  }, [userId]);

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
    if (!termsCondition) {
      toast.error("Term & condition is required.");
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
        setTermsCondition(false);
      } finally {
        setLoading(false);
      }
    };

    loginUser();
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, []);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Login", active: true },
  ];

  const handleTermModal = () => {
    setTermModal(true);
  };

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
              <div className="d-flex mb-3">
                <input
                  type="checkbox"
                  className="form-check"
                  id="termcondition"
                  checked={termsCondition}
                  onChange={(e) => setTermsCondition(e.target.checked)}
                  tabIndex={3}
                />
                <label
                  htmlFor="termcondition"
                  style={{ cursor: "pointer" }}
                  className="ms-2"
                >
                  I agree to the{" "}
                  <span
                    onClick={handleTermModal}
                    className="text-primary text-decoration-underline"
                  >
                    Terms and Conditions
                  </span>
                </label>
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
                <span>Forgot your password? </span>
                <Link to="/reset-password" className="text-danger">
                  Reset Password
                </Link>
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
      <Modal
        show={termModal}
        onHide={() => setTermModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TermsAndConditions />
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              if (!termsCondition) {
                setTermsCondition(true);
              }
              setTermModal(false);
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
