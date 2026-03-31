import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navigation } from '@/app/components/Navigation';
import { LoginDialog } from '@/app/components/LoginDialog';
import { RegisterDialog } from '@/app/components/RegisterDialog';
import { HomePage } from '@/app/pages/HomePage';
import { BusRoutesPage } from '@/app/pages/BusRoutesPage';
import { AboutPage } from '@/app/pages/AboutPage';
import { AccountPage } from '@/app/pages/AccountPage';
import { AnnouncementsPage } from '@/app/pages/AnnouncementsPage';
import { ComplaintsPage } from '@/app/pages/ComplaintsPage';
import { AdminDashboard } from '@/app/pages/AdminDashboard';
import { AdminRequestsPage } from '@/app/pages/AdminRequestsPage';
import { EditMapPage } from '@/app/pages/EditMapPageNew';
import { FilterManagementPage } from '@/app/pages/FilterManagementPage';
import { FeedbackManagementPage } from '@/app/pages/FeedbackManagementPage';
import { AdminAnnouncementsPage } from '@/app/pages/AdminAnnouncementsPage';
import { AdminCommentsPage } from '@/app/pages/AdminCommentsPage';
import { KFUPMAdminDashboard } from '@/app/pages/KFUPMAdminDashboard';
import { AdminRequestsToTechPage } from '@/app/pages/AdminRequestsToTechPage';
import { AdminComplaintsManagement } from '@/app/pages/AdminComplaintsManagement';
import { AdminCommunityPathsReview } from '@/app/pages/AdminCommunityPathsReview';
import { AdminVerifyComments } from '@/app/pages/AdminVerifyComments';
import { Toaster } from '@/app/components/ui/sonner';

function AppContent() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-background">
        {/* Navigation */}
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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/requests" element={<AdminRequestsPage />} />
            <Route path="/admin/filters" element={<FilterManagementPage />} />
            <Route path="/admin/feedback" element={<FeedbackManagementPage />} />
            <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
            <Route path="/admin/comments" element={<AdminCommentsPage />} />
            <Route path="/admin/edit-map" element={<EditMapPage />} />
            {/* KFUPM Admin Dashboard Routes */}
            <Route path="/kfupm-admin" element={<KFUPMAdminDashboard />} />
            <Route path="/kfupm-admin/requests-to-tech" element={<AdminRequestsToTechPage />} />
            <Route path="/kfupm-admin/complaints-management" element={<AdminComplaintsManagement />} />
            <Route path="/kfupm-admin/community-paths-review" element={<AdminCommunityPathsReview />} />
            <Route path="/kfupm-admin/verify-comments" element={<AdminVerifyComments />} />
          </Routes>
        </main>

        {/* Dialogs */}
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
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}