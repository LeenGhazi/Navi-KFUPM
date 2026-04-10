import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from "./Components/Navigation";
import { AuthProvider, useAuth } from "../AuthContext";
import { ThemeProvider } from '../ThemeContext';
import { BusRoutesPage } from "./Pages/BusRoutesPage";

// Import these as you build them
// import { HomePage } from "./Pages/HomePage";
import { AnnouncementsPage } from "./Pages/AnnouncementsPage";
// import { ComplaintsPage } from "./Pages/ComplaintsPage";
import { AboutPage } from "./Pages/AboutPage";
import { AccountPage } from "./Pages/AccountPage";
// import { AccountPage } from "./Pages/AccountPage";
// import { AdminDashboard } from "./Pages/AdminDashboard";
// import { KFUPMAdminDashboard } from "./Pages/KFUPMAdminDashboard";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Separate inner component so it can use useAuth hook
function AppContent() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const { login, signup } = useAuth();

  return (
    <>
      <Navigation
        onLoginClick={() => setShowLoginPopup(true)}
        onRegisterClick={() => setShowSignupPopup(true)}
      />

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/bus-routes" element={<BusRoutesPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/complaints" element={<div>Complaints Page</div>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<div>Staff Dashboard</div>} />
          <Route path="/kfupm-admin" element={<div>KFUPM Admin Dashboard</div>} />
        </Routes>
      </main>
      <Routes>
        <Route path="/" element={<BusRoutesPage />} />
         {/* Admin routes */}
        <Route path="/kfupm-admin" element={<h1>Admin Dashboard</h1>} />
        <Route path="/kfupm-admin/requests" element={<h1>Requests Page</h1>} />
        <Route path="/kfupm-admin/complaints" element={<h1>Complaints Page</h1>} />
        <Route path="/kfupm-admin/paths" element={<h1>Paths Page</h1>} />
          {/* Technical Admin routes */}
        <Route path="/admin" element={<h1>Technical Dashboard</h1>} />
        <Route path="/admin/requests" element={<h1>Technical Requests</h1>} />
        <Route path="/admin/filters" element={<h1>Filter Page</h1>} />
        <Route path="/admin/announcements" element={<h1>Announcements Page</h1>} />

      </Routes>

      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Login to Navi-KFUPM</h2>
            <p>Select your account type to continue</p>
            <button onClick={() => { login("user"); setShowLoginPopup(false); }}>Log in as User</button>
            <button onClick={() => { login("admin"); setShowLoginPopup(false); }}>Log in as KFUPM Administrator</button>
            <button onClick={() => { login("technical"); setShowLoginPopup(false); }}>Log in as Technical Admin</button>
            <button onClick={() => setShowLoginPopup(false)}>X</button>
          </div>
        </div>
      )}

      {showSignupPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Register for Navi-KFUPM</h2>
            <p>Create an account to access personalized features.</p>
            <button onClick={() => { signup(); setShowSignupPopup(false); }}>Register</button>
            <button onClick={() => { setShowSignupPopup(false); setShowLoginPopup(true); }}>Login Instead</button>
            <button onClick={() => setShowSignupPopup(false)}>X</button>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;