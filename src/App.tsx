import React, { useState } from 'react';
import { AppView, AuthMode, DocumentItem, NotificationItem, UserSettings } from './types';
import { SAMPLE_DOCUMENTS, INITIAL_NOTIFICATIONS, DEFAULT_USER_SETTINGS } from './data/mockDocuments';
import { Navbar } from './components/layout/Navbar';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { LandingPage } from './components/public/LandingPage';
import { DashboardView } from './components/workspace/DashboardView';
import { DocumentsView } from './components/workspace/DocumentsView';
import { PdfViewerWorkspace } from './components/workspace/PdfViewerWorkspace';
import { SummarizerView } from './components/workspace/SummarizerView';
import { OcrExtractionView } from './components/workspace/OcrExtractionView';
import { TranslationView } from './components/workspace/TranslationView';
import { PdfToolsView } from './components/workspace/PdfToolsView';
import { SemanticSearchView } from './components/workspace/SemanticSearchView';
import { SettingsView } from './components/workspace/SettingsView';
import { HelpCenterView } from './components/workspace/HelpCenterView';
import { UploadModal } from './components/workspace/UploadModal';
import { ShareModal } from './components/workspace/ShareModal';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  // Navigation & Authentication state
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);

  // Documents & Workspace state
  const [documents, setDocuments] = useState<DocumentItem[]>(SAMPLE_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(SAMPLE_DOCUMENTS[0]?.id || null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);

  // Modals & Layout state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [shareModalDoc, setShareModalDoc] = useState<DocumentItem | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const selectedDocument = documents.find((d) => d.id === selectedDocId) || documents[0] || null;

  // Sync view state with browser history / popstate
  const navigateToView = (view: AppView, pushState = true) => {
    setCurrentView(view);
    setMobileSidebarOpen(false);
    if (pushState && typeof window !== 'undefined') {
      window.history.pushState({ view }, '', `?view=${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    // Initial page load check URL query
    const params = new URLSearchParams(window.location.search);
    const initialView = (params.get('view') as AppView) || 'landing';
    if (initialView !== 'landing') {
      setIsAuthenticated(true);
      setCurrentView(initialView);
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        setCurrentView(e.state.view);
      } else {
        const queryParams = new URLSearchParams(window.location.search);
        const queryView = (queryParams.get('view') as AppView) || 'landing';
        setCurrentView(queryView);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // View Handlers
  const handleNavigate = (view: AppView) => {
    navigateToView(view);
  };

  const handleStartForFree = () => {
    setIsAuthenticated(true);
    navigateToView('dashboard');
  };

  const handleSelectDocument = (doc: DocumentItem, targetView: AppView = 'viewer') => {
    setSelectedDocId(doc.id);
    navigateToView(targetView);
  };

  const handleToggleFavorite = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, isTrash: true } : d))
    );
  };

  const handleRenameDocument = (docId: string, newTitle: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, title: newTitle } : d))
    );
  };

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Document Ready',
        description: `"${newDoc.title}" was parsed and indexed successfully.`,
        timestamp: 'Just now',
        isRead: false,
        docId: newDoc.id,
      },
      ...prev,
    ]);
  };

  const handleMarkNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (notif.docId) {
      const doc = documents.find((d) => d.id === notif.docId);
      if (doc) {
        setSelectedDocId(doc.id);
        navigateToView('viewer');
      }
    }
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigateToView('landing');
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. PUBLIC LANDING VIEW */}
      {currentView === 'landing' ? (
        <div>
          <Navbar
            onOpenAuth={(mode) => setAuthMode(mode)}
            onStartForFree={handleStartForFree}
            onNavigateToApp={() => {
              setIsAuthenticated(true);
              setCurrentView('dashboard');
            }}
          />

          <LandingPage
            onStartForFree={handleStartForFree}
            onOpenAuth={(mode) => setAuthMode(mode)}
            onNavigateToTool={(view) => {
              setIsAuthenticated(true);
              setCurrentView((view as AppView) || 'tools');
            }}
          />
        </div>
      ) : (
        /* 2. AUTHENTICATED APP WORKSPACE SHELL */
        <div className="flex h-screen overflow-hidden">
          {/* Collapsible / Responsive Sidebar */}
          <AppSidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            collapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top Navigation & Action Header */}
            <AppHeader
              currentView={currentView}
              onNavigate={handleNavigate}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onOpenSearch={() => setCurrentView('search')}
              onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              notifications={notifications}
              onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
              onNotificationClick={handleNotificationClick}
              onLogout={handleLogout}
              userName={settings.name}
            />

            {/* Viewport Router */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
              {currentView === 'dashboard' && (
                <DashboardView
                  documents={documents}
                  userName={settings.name.split(' ')[0]}
                  onOpenUpload={() => setIsUploadModalOpen(true)}
                  onSelectDocument={handleSelectDocument}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigate={handleNavigate}
                />
              )}

              {(currentView === 'documents' ||
                currentView === 'favorites' ||
                currentView === 'shared' ||
                currentView === 'trash') && (
                <DocumentsView
                  documents={
                    currentView === 'favorites'
                      ? documents.filter((d) => d.isFavorite && !d.isTrash)
                      : currentView === 'shared'
                      ? documents.filter((d) => d.isShared && !d.isTrash)
                      : currentView === 'trash'
                      ? documents.filter((d) => d.isTrash)
                      : documents
                  }
                  onOpenUpload={() => setIsUploadModalOpen(true)}
                  onSelectDocument={handleSelectDocument}
                  onToggleFavorite={handleToggleFavorite}
                  onDeleteDocument={handleDeleteDocument}
                  onRenameDocument={handleRenameDocument}
                  onOpenShareModal={(doc) => setShareModalDoc(doc)}
                />
              )}

              {(currentView === 'viewer' || currentView === 'chat') && (
                <PdfViewerWorkspace
                  document={selectedDocument}
                  onOpenShareModal={(doc) => setShareModalDoc(doc)}
                  onBackToDocs={() => setCurrentView('documents')}
                />
              )}

              {currentView === 'summarizer' && (
                <SummarizerView
                  documents={documents}
                  selectedDocument={selectedDocument}
                  onSelectDocument={(doc) => setSelectedDocId(doc.id)}
                />
              )}

              {currentView === 'ocr' && (
                <OcrExtractionView
                  documents={documents}
                  selectedDocument={selectedDocument}
                />
              )}

              {currentView === 'translate' && (
                <TranslationView
                  documents={documents}
                  selectedDocument={selectedDocument}
                />
              )}

              {currentView === 'tools' && (
                <PdfToolsView
                  documents={documents}
                  onOpenUpload={() => setIsUploadModalOpen(true)}
                />
              )}

              {currentView === 'search' && (
                <SemanticSearchView
                  documents={documents}
                  onSelectDocument={handleSelectDocument}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                />
              )}

              {currentView === 'help' && <HelpCenterView />}
            </main>
          </div>
        </div>
      )}

      {/* Global Upload & Processing Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Share Document Modal */}
      <ShareModal
        document={shareModalDoc}
        onClose={() => setShareModalDoc(null)}
      />

      {/* Auth Modal (Login / Sign Up / Forgot Password / Verification) */}
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitchMode={(mode) => setAuthMode(mode)}
        onSuccessLogin={handleStartForFree}
      />
    </div>
  );
}
