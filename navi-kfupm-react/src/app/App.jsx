import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from "./Components/Navigation";
import { AuthProvider, useAuth } from "../AuthContext";
import { ThemeProvider } from '../ThemeContext';
import { BusRoutesPage } from "./Pages/BusRoutesPage";
import { EditMapPage } from "./Pages/EditMapPageNew";
import { LoginDialog } from './Components/LoginDialog';
import { Toaster } from './Components/ui/sonner';
import { RegisterDialog } from './Components/RegisterDialog';
import { HomePage } from "./Pages/HomePage";
import { AnnouncementsPage } from "./Pages/AnnouncementsPage";
import { AdminAnnouncementsPage } from "./Pages/AdminAnnouncementsPage"; 
import { ComplaintsPage } from "./Pages/ComplaintsPage";
import { AboutPage } from "./Pages/AboutPage";
import { AccountPage } from "./Pages/AccountPage";
import { AdminDashboard } from "./Pages/AdminDashboard";
import { AdminRequestsPage } from './Pages/AdminRequestsPage';
import { AdminComplaintsManagement } from "./Pages/AdminComplaintsManagement";
import { KFUPMAdminDashboard } from "./Pages/KFUPMAdminDashboard";
import { FilterManagementPage } from './Pages/FilterManagementPage';
import { FeedbackManagementPage } from './Pages/FeedbackManagementPage';
import { AdminCommentsPage } from './Pages/AdminCommentsPage';
import { AdminRequestsToTechPage } from './Pages/AdminRequestsToTechPage';
import { AdminCommunityPathsReview } from './Pages/AdminCommunityPathsReview';
import { AdminVerifyComments } from './Pages/AdminVerifyComments';



function AppContent() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      
      <Navigation
        onLoginClick={() => setLoginOpen(true)}
        onRegisterClick={() => setRegisterOpen(true)}
      />


      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bus-routes" element={<BusRoutesPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/account" element={<AccountPage />} />
          {/* Staff Dashboard Routes */}
          <Route path="/admin" element={<AdminDashboard />}/>
          <Route path="/admin/requests" element={<AdminRequestsPage/>}/>
          <Route path="/admin/filters" element={<FilterManagementPage/>}/>
          <Route path="/admin/feedback" element={<FeedbackManagementPage/>}/>
          <Route path="/admin/announcements" element={<AdminAnnouncementsPage />}/>
          <Route path="/admin/comments" element={<AdminCommentsPage/>}/>
          <Route path="/admin/edit-map" element={<EditMapPage />}/>
          {/* KFUPM Admin Dashboard Routes */}
          <Route path="/kfupm-admin" element={<KFUPMAdminDashboard/>}/>
          <Route path="/kfupm-admin/requests-to-tech" element={<AdminRequestsToTechPage/>}/>
          <Route path="/kfupm-admin/complaints-management" element={<AdminComplaintsManagement />}/>
          <Route path="/kfupm-admin/community-paths-review" element={<AdminCommunityPathsReview/>}/>
          <Route path="/kfupm-admin/verify-comments" element={<AdminVerifyComments/>}/>
        </Routes>
      </main>
      
      
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

