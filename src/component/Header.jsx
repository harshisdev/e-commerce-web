import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginProfileApi } from "../action/productApi";
import { toast } from "react-toastify";
import { MdOutlineLogout } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import defaultUserImg from "../assets/images/default-user.png";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { logout, setUser } from "../app/slice/userSlice";

const Header = ({ cartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const accessToken = sessionStorage.getItem("accessToken");

  const allUserData = useSelector((state) => state.user.data);

  useEffect(() => {
    const loginProfile = async () => {
      if (!accessToken) return;
      try {
        const data = await loginProfileApi(accessToken);
        if (data) {
          dispatch(setUser(data));
          const now = Date.now();
          localStorage.setItem("lastActiveTime", now.toString());
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
        toast.error("Failed to load user profile.");
        sessionStorage.clear();
        localStorage.clear();
      }
    };

    loginProfile();
  }, [accessToken]);

  const handleLogout = () => {
    toast.success("Logout successfully !");
    sessionStorage.clear();
    localStorage.clear();
    dispatch(logout());
    navigate("/");
  };
  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <header className="bg-light position-sticky top-0 z-2 shadow">
      <div className="container">
        <div className="row align-items-center justify-content-between py-3">
          <div className="col-auto">
            E-Commerce-{allUserData?.role === "admin" ? "Store" : "Web"}
          </div>
          <div className="col-auto d-flex align-items-center">
            {!allUserData &&
              !accessToken &&
              location.pathname !== "/login" &&
              location.pathname !== "/register" && (
                <>
                  <Link
                    to="/register"
                    className="text-black text-decoration-none"
                  >
                    Register
                  </Link>
                  <span className="px-2 text-black">/</span>
                  <Link to="/login" className="text-decoration-none text-black">
                    Login
                  </Link>
                </>
              )}

            {allUserData?.role !== "admin" && (
              <div>
                <Link
                  to="/cart"
                  className="btn btn-btn-outline-primary position-relative ms-3 p-0 border-0"
                >
                  <span className="fs-5"> 🛒</span>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount > 0 ? cartCount : ""}
                  </span>
                </Link>
              </div>
            )}
            {allUserData && accessToken && (
              <div className="ms-2 d-flex align-items-center">
                <div
                  style={{ textTransform: "capitalize" }}
                  className="d-none d-sm-block"
                >
                  {truncateText(allUserData?.name, 10)} (
                  <span>{allUserData?.role}</span>)
                </div>
                <div className="dropdown pe-3">
                  <div
                    style={{ width: "30px", height: "30px", cursor: "pointer" }}
                    className="ms-2 dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      className="rounded-pill img-fluid"
                      src={allUserData?.avatar || { defaultUserImg }}
                      alt={allUserData?.name}
                    />
                  </div>
                  <ul
                    className="dropdown-menu mt-3 p-0"
                    style={{ minWidth: "190px" }}
                  >
                    {allUserData?.role === "admin" && (
                      <>
                        <li className="bg-success border-bottom">
                          <Link
                            to={"/add-category"}
                            className="ms-2 d-block py-2 text-white text-decoration-none"
                          >
                            <IoAddOutline className="me-2 fs-5" />
                            Add Category
                          </Link>
                        </li>
                        <li className="bg-success border-bottom">
                          <Link
                            to={"/add-product"}
                            className="ms-2 d-block py-2 text-white text-decoration-none"
                          >
                            <IoAddOutline className="me-2 fs-5" />
                            Add Product
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="bg-success border-bottom d-block d-sm-none py-2 text-white">
                      <span className="ms-2">
                        <CiUser className="fs-5 me-1" />{" "}
                        {truncateText(allUserData?.name, 7)} (
                        <span style={{ textTransform: "capitalize" }}>
                          {allUserData?.role}
                        </span>
                        )
                      </span>
                    </li>
                    <li className="bg-success border-bottom text-white">
                      <Link
                        to={`/profile-update`}
                        state={{ userId: allUserData?.id }}
                        className="ms-2 d-block py-2 text-white text-decoration-none"
                      >
                        <CiUser className="fs-5 me-1" /> Profile Update (
                        {allUserData?.id})
                      </Link>
                    </li>
                    <li className="bg-success border-bottom">
                      <Link
                        className="ms-2 d-block py-2 text-white text-decoration-none"
                        to="/delete"
                        state={{ userId: allUserData?.id }}
                      >
                        <AiOutlineDelete className="me-2 fs-5" />
                        Delete Profile
                      </Link>
                    </li>

                    <li className="bg-success">
                      <Link
                        className="ms-2 d-block py-2 text-white text-decoration-none"
                        onClick={handleLogout}
                      >
                        <MdOutlineLogout className="me-2 fs-5" />
                        Logout
                      </Link>
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
