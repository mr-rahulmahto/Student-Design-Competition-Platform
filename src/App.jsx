import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CompetitionDiscovery } from './pages/CompetitionDiscovery';
import { CompetitionDetail } from './pages/CompetitionDetail';
import { SubmissionWorkbench } from './pages/SubmissionWorkbench';
import { SubmissionTracking } from './pages/SubmissionTracking';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfile } from './pages/StudentProfile';
import { AdminPanel } from './pages/AdminPanel';

const AppRoutes = () => {
  const { currentRoute, isAuthenticated, openAuthModal } = useApp();

  const renderRoute = () => {
    switch (currentRoute) {
      case 'competitions':
        return <CompetitionDiscovery />;
      case 'detail':
        return <CompetitionDetail />;
      case 'submit':
        return <SubmissionWorkbench />;
      case 'my-submissions':
        return <SubmissionTracking />;
      case 'dashboard':
        return <StudentDashboard />;
      case 'profile':
        return <StudentProfile />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <CompetitionDiscovery />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 min-h-[calc(100vh-140px)]">
      {renderRoute()}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
        <div>
          <Navbar />
          <AppRoutes />
          <AuthModal />
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
