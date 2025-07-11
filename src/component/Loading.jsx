import { TailSpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div
      style={{ height: "calc(100vh - 202px)" }}
      className="d-flex justify-content-center align-items-center"
    >
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loading;
