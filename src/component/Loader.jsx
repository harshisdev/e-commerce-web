import loader from "../assets/images/loader.gif";
const Loader = () => {
  return (
    <div
      style={{ height: "calc(100vh - 202px)" }}
      className="d-flex justify-content-center align-items-center"
    >
      <img src={loader} className="img-fulid" alt="loader" />
    </div>
  );
};

export default Loader;
