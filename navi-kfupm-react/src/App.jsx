import './App.css'
import { useState } from "react";
import BusRoutesPage from "./Pages/BusRoutesPage";
import Navbar from "./Components/Navbar";
import { useAuth } from "./AuthContext";


function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const { login, signup } = useAuth();
  return (
    <>
    {/* Navbar with login and signup options */}
      <Navbar 
        onLoginClick={() => setShowLoginPopup(true)}
        onSignupClick={() => setShowSignupPopup(true)}
      />


    {/* Main content area - for now we just show the bus routes page */}
      <BusRoutesPage /> 
      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Login to Navi-KFUPM</h2>
            <p>Select your account type to continue</p>

            <button
              onClick={() => {
                login("user");
                setShowLoginPopup(false);
              }}
            >
              Log in as User
            </button>

            <button
              onClick={() => {
                login("admin");
                setShowLoginPopup(false);
              }}
            >
              Log in as KFUPM Administrator
            </button>

            <button
              onClick={() => {
                login("technical");
                setShowLoginPopup(false);
              }}
            >
              Log in as Technical Admin
            </button>

            <button onClick={() => setShowLoginPopup(false)}>X</button>
          </div>
        </div>
      )}

      {showSignupPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Register for Navi-KFUPM</h2>
            <p>Create an account to access personalized features.</p>

            <button
              onClick={() => {
                signup();
                setShowSignupPopup(false);
              }}
            >
              Register
            </button>
            <button
              onClick={() => {
                setShowSignupPopup(false);
                setShowLoginPopup(true);
              }}
            >
            Login Instead
            </button>

            <button onClick={() => setShowSignupPopup(false)}>X</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
