const Loader = ({ fullScreen = false, label = "Loading" }) => (
  <div className={fullScreen ? "loader-screen" : "loader-inline"}>
    <div className="spinner" />
    <p>{label}</p>
  </div>
);

export default Loader;

