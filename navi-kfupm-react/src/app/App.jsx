import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from "./Components/Navigation";
import { AuthProvider, useAuth } from "../AuthContext";
import { ThemeProvider } from '../ThemeContext';
import { BusRoutesPage } from "./Pages/BusRoutesPage";
import { EditMapPage } from "./Pages/EditMapPageNew";

// Import these as you build them
// import { HomePage } from "./Pages/HomePage";
import { AnnouncementsPage } from "./Pages/AnnouncementsPage";
import { ComplaintsPage } from "./Pages/ComplaintsPage";
import { AboutPage } from "./Pages/AboutPage";
import { AccountPage } from "./Pages/AccountPage";
import { AdminDashboard } from "./Pages/AdminDashboard";
// import { KFUPMAdminDashboard } from "./Pages/KFUPMAdminDashboard";


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
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/bus-routes" element={<BusRoutesPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/account" element={<AccountPage />} />
          {/* Staff Dashboard Routes */}
          <Route path="/admin" element={<AdminDashboard />}/>
          <Route path="/admin/requests" element={<div>AdminRequestsPage</div>}/>
          <Route path="/admin/filters" element={<div>FilterManagementPage</div>}/>
          <Route path="/admin/feedback" element={<div>FeedbackManagementPage</div>}/>
          <Route path="/admin/announcements" element={<div>AdminAnnouncementsPage</div>}/>
          <Route path="/admin/comments" element={<div>AdminCommentsPage</div>}/>
          <Route path="/admin/edit-map" element={<EditMapPage />}/>
          {/* KFUPM Admin Dashboard Routes */}
          <Route path="/kfupm-admin" element={<div>KFUPMAdminDashboard</div>}/>
          <Route path="/kfupm-admin/requests-to-tech" element={<div>AdminRequestsToTechPage</div>}/>
          <Route path="/kfupm-admin/complaints-management" element={<div>AdminComplaintsManagement</div>}/>
          <Route path="/kfupm-admin/community-paths-review" element={<div>AdminCommunityPathsReview</div>}/>
          <Route path="/kfupm-admin/verify-comments" element={<div>AdminVerifyComments</div>}/>
        </Routes>
      </main>

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