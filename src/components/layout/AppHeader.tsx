import React, { useState } from 'react';
import {
  Search,
  Bell,
  UploadCloud,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Sparkles,
  Menu,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AppView, NotificationItem } from '../../types';

interface AppHeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsAsRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
  onLogout: () => void;
  userName?: string;
  userAvatar?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  onOpenSearch,
  onToggleMobileSidebar,
  notifications,
  onMarkNotificationsAsRead,
  onNotificationClick,
  onLogout,
  userName = 'User',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const viewTitles: Record<AppView, { title: string; subtitle?: string }> = {
    landing: { title: 'Welcome', subtitle: 'Public Overview' },
    dashboard: { title: 'Dashboard', subtitle: 'Overview & Document Workspace' },
    documents: { title: 'My Documents', subtitle: 'All Files & Folders' },
    viewer: { title: 'PDF Viewer', subtitle: 'Interactive Document Intelligence' },
    chat: { title: 'AI Chat', subtitle: 'Conversational Document Q&A' },
    summarizer: { title: 'AI Summarizer', subtitle: 'Executive & Structured Summaries' },
    ocr: { title: 'OCR Extraction', subtitle: 'Scanned Document & Image Text' },
    translate: { title: 'Document Translation', subtitle: 'Multi-lingual Localization' },
    tools: { title: 'PDF Tools', subtitle: 'Convert, Merge, Compress & Transform' },
    search: { title: 'AI Semantic Search', subtitle: 'Natural Language Cross-File Search' },
    favorites: { title: 'Favorites', subtitle: 'Pinned & Bookmarked Documents' },
    shared: { title: 'Shared with Me', subtitle: 'Collaborator & Shared Files' },
    trash: { title: 'Trash', subtitle: 'Deleted Document Archives' },
    settings: { title: 'Settings', subtitle: 'Preferences, Profile & Security' },
    help: { title: 'Help Center', subtitle: 'Knowledge Base & Support' },
  };

  const currentInfo = viewTitles[currentView] || { title: 'Workspace' };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-slate-900 leading-tight">
            {currentInfo.title}
          </h1>
          {currentInfo.subtitle && (
            <p className="hidden sm:block text-xs text-slate-500 font-normal">
              {currentInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="group flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-1.5 text-xs text-slate-500 shadow-2xs transition-all hover:border-slate-300 hover:bg-white"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600" />
            <span>Search documents or ask anything with AI...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Quick Upload, Notifications, User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <UploadCloud className="h-3.5 w-3.5 text-blue-600" />
          <span>Upload</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-semibold text-blue-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onMarkNotificationsAsRead();
                    }}
                    className="text-[11px] font-medium text-blue-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1.5 scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onNotificationClick(notif);
                        setShowNotifications(false);
                      }}
                      className={`cursor-pointer rounded-lg p-2.5 transition-colors ${
                        notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${notif.isRead ? 'font-medium text-slate-800' : 'font-semibold text-slate-900'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 leading-snug line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <img
              src={userAvatar}
              alt={userName}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">alex.morgan@enterprise.ai</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Profile & Account</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  <span>View Public Website</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
