import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NewProjectModal } from './components/NewProjectModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { DashboardOverview } from './pages/DashboardOverview';
import { UploadPage } from './pages/UploadPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { GenerateDocPage } from './pages/GenerateDocPage';
import { DocEditorPage } from './pages/DocEditorPage';
import { ApiDocPage } from './pages/ApiDocPage';
import { ReadmeGenPage } from './pages/ReadmeGenPage';
import { CodeExplainerPage } from './pages/CodeExplainerPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'register', 'dashboard'
  const [dashboardTab, setDashboardTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // If user is on landing/login/register
  if (currentView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => {
          if (isAuthenticated) {
            setCurrentView('dashboard');
            setDashboardTab('generate');
          } else {
            setCurrentView('register');
          }
        }}
        onOpenLogin={() => setCurrentView('login')}
        onOpenRegister={() => setCurrentView('register')}
        onTryDemo={() => {
          setCurrentView('dashboard');
          setDashboardTab('dashboard');
        }}
      />
    );
  }

  if (currentView === 'login') {
    return (
      <LoginPage
        onSwitchToRegister={() => setCurrentView('register')}
        onLoginSuccess={() => setCurrentView('dashboard')}
        onBackToHome={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterPage
        onSwitchToLogin={() => setCurrentView('login')}
        onRegisterSuccess={() => setCurrentView('dashboard')}
        onBackToHome={() => setCurrentView('landing')}
      />
    );
  }

  // Render Dashboard Views
  const renderDashboardContent = () => {
    switch (dashboardTab) {
      case 'dashboard':
      case 'projects':
        return (
          <DashboardOverview
            onNavigate={(tab) => setDashboardTab(tab)}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          />
        );
      case 'upload':
        return (
          <UploadPage
            onNavigateToAnalyzer={() => setDashboardTab('analyzer')}
          />
        );
      case 'analyzer':
        return (
          <AnalyzerPage
            onNavigateToGenerateDocs={() => setDashboardTab('generate')}
            onNavigateToExplainer={() => setDashboardTab('explainer')}
          />
        );
      case 'generate':
        return (
          <GenerateDocPage
            onNavigateToEditor={() => setDashboardTab('editor')}
          />
        );
      case 'editor':
        return <DocEditorPage />;
      case 'api-docs':
        return <ApiDocPage />;
      case 'readme':
        return <ReadmeGenPage />;
      case 'explainer':
        return (
          <CodeExplainerPage
            onNavigateToEditor={() => setDashboardTab('editor')}
          />
        );
      case 'history':
        return (
          <HistoryPage
            onNavigateToEditor={() => setDashboardTab('editor')}
          />
        );
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardOverview
            onNavigate={(tab) => setDashboardTab(tab)}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        activeTab={dashboardTab}
        onSelectTab={(tab) => {
          setDashboardTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenLanding={() => setCurrentView('landing')}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        
        {/* Top Header */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        />

        {/* View Component */}
        <main className="flex-1 pb-16">
          {renderDashboardContent()}
        </main>
      </div>

      {/* Global New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectCreated={() => setDashboardTab('upload')}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}
