import loader from "../assets/images/loader.svg";
const Loader = (width) => {
  return (
    <div
      style={{ height: "calc(100vh - 202px)" }}
      className="d-flex justify-content-center align-items-center"
    >
      <img
        src={loader}
        style={{ width: width.width, height: "auto" }}
        alt="loader"
      />
    </div>
  );
};

export default Loader;
