import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center minHeight text-center py-5">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="mb-4 text-muted">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-outline-primary rounded-5 px-4 py-2">
        Go Back Home
      </Link>
    </div>
  );
};

export default PageNotFound;
