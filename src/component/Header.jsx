import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginProfileApi } from "../action/productApi";
import { toast } from "react-toastify";

const Header = ({ cartCount }) => {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const [profileData, setprofileData] = useState(null);
  useEffect(() => {
    const loginProfile = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const data = await loginProfileApi(accessToken);
        setprofileData(data);
      } catch (error) {
        console.error("Profile fetch failed:", error);
        toast.error("Failed to load user profile.");
      }
    };

    loginProfile();
  }, [accessToken]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };
  return (
    <header className="bg-light">
      <div className="container">
        <div className="row align-items-center justify-content-between py-3">
          <div className="col-2">E-Coumerce-Web</div>
          <div className="col-auto d-flex align-items-center">
            {!profileData ? (
              <>
                <Link to="/register">Register</Link>
                <span className="px-2">/</span>
                <Link to="/login">Login</Link>
              </>
            ) : (
              ""
            )}
            <div>
              <Link
                to="/cart"
                className="btn btn-btn-outline-primary position-relative ms-3 p-0"
              >
                <span className="fs-4"> 🛒</span>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount > 0 ? cartCount : ""}
                </span>
              </Link>
            </div>
            {profileData && (
              <div className="ms-2 d-flex align-items-center">
                <div>{profileData.name}</div>
                <div class="dropdown">
                  <div
                    style={{ width: "30px", height: "30px", cursor: "pointer" }}
                    className="ms-2 dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      className="rounded-pill img-fluid"
                      src={profileData.avatar || "/default-avatar.png"}
                      alt={profileData.name}
                    />
                  </div>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        className="btn btn-outline-primary border-0 p-0 ms-2"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
