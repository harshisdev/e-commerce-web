import { toast } from "react-toastify";
import { loginUserApi } from "../action/productApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const credentials = {
      email: form.get("email"),
      password: form.get("password"),
    };

    const loginUser = async () => {
      try {
        const data = await loginUserApi(credentials);
        const token = data.access_token;
        sessionStorage.setItem("accessToken", token);
        if (token) {
          toast.success("Login Successfully!");
          navigate("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Oops! Credentials are incorrect.");
      }
    };

    loginUser();
  };

  return (
    <div className="container d-flex justify-content-center align-items-center minHeight">
      <div
        className="card p-4 shadow-lg mt-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Login</h4>
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

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
