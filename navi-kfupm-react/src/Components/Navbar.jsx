import "../App.css";

function Navbar() {
  return (
    <nav className="navbar">

      {/* LEFT: Logo/Title */}
      <div className="navbar-left">
        <h2>Navi-KFUPM</h2>
      </div>

      {/* CENTER: pages */}
      <div className="navbar-center">
        <a href="#">Map</a>
        <a href="#">Bus Routes</a>  {/*later we will use links instead */}
        <a href="#">Announcements</a>
        <a href="#">Complaints</a>
        <a href="#">About</a>
      </div>

      {/* RIGHT: Auth buttons */}
      <div className="navbar-right">
        <button>Login</button>
        <button>Sign Up</button>
      </div>

    </nav>
  );
}

export default Navbar;