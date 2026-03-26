import "../App.css";
import { useAuth } from "../AuthContext";

function Navbar({ onLoginClick, onSignupClick }) {
  const { role, login, logout, signup } = useAuth();

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
        {role === "guest" ? (
          <>
            <button onClick={onLoginClick}>Login</button>
            <button onClick={onSignupClick}>Sign Up</button>
          </>
        ) : (
          <>
            <span className="role-text">{role}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;